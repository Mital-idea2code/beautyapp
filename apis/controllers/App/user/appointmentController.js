const express = require("express");
const Appointment = require("../../../models/Appointment");
const ReviewRating = require("../../../models/ReviewRating");
const Beautician = require("../../../models/Beautician");
const Favourite = require("../../../models/Favourite");
const Notification = require("../../../models/Notification");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateUniqueID } = require("../../../helper/uniqueId");
const { transformUserAppointmentData } = require("../../../helper/commonServices");

const firebaseadmin = require("firebase-admin");
const serviceAccount = require("../../../config/glamspot-firebase.json"); // Replace with your service account key

firebaseadmin.initializeApp({
  credential: firebaseadmin.credential.cert(serviceAccount),
});

//Add Appointment
const bookAppointment = async (req, res, next) => {
  try {
    const beautician = await Beautician.findOne({ _id: req.body.beautican_id });
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    const addedApp = req.body;

    req.body.app_time = moment(req.body.app_time, "h:mm A").valueOf(); //HH:mm
    req.body.app_date = moment(req.body.app_date).format("YYYY-MM-DD");
    req.body.appointment_id = generateUniqueID();
    const newApp = await new Appointment(addedApp);

    const result = await newApp.save();

    const title = "New Appointment Received!";
    const description =
      "Exciting news! You've received a new appointment. Appointment ID is " +
      req.body.appointment_id +
      ". Please check the details and confirm your availability.";

    const newNoti = await Notification.create({
      title: title,
      description: description,
      user_id: req.body.beautican_id,
      role: 2,
    });
    await newNoti.save();

    // const message = {
    //   notification: {
    //     title: title,
    //     body: description,
    //   },
    //   token: beautician.fcm_token,
    // };

    // await firebaseadmin.messaging().send(message);

    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Add Review Rating
const addReview = async (req, res, next) => {
  try {
    const beautician = await Beautician.findOne({ _id: req.body.beautican_id });
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    const app = await Appointment.findOne({ _id: req.body.appointment_id, status: 1 });
    if (!app)
      return queryErrorRelatedResponse(req, res, 404, "You can't leave a review before completing the appointment.");

    const added = await ReviewRating.findOne({ appointment_id: req.body.appointment_id, user_id: req.body.user_id });
    if (added)
      return queryErrorRelatedResponse(
        req,
        res,
        200,
        "You've already provided feedback, you won't be able to do so again."
      );

    const addedReview = req.body;
    const newReview = await new ReviewRating(addedReview);

    const result = await newReview.save();

    let totalReviews = 0;
    let totalRatings = 0;
    let averageRating = 0;
    const allRatings = await ReviewRating.find({ beautican_id: req.body.beautican_id });
    if (allRatings && allRatings.length > 0) {
      totalReviews = allRatings.length;
      totalRatings = allRatings.reduce((sum, review) => sum + review.rate, 0);
      averageRating = totalRatings / totalReviews;
      averageRating = parseFloat(averageRating.toFixed(1));
    }

    // Add the new service to the category array
    beautician.reviews.push(result);
    beautician.totalReviews = totalReviews;
    beautician.totalRatings = totalRatings;
    beautician.averageRating = averageRating;

    // Save the category with the new services
    await beautician.save();

    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Filter Reviews based on rate
const filterReviews = async (req, res, next) => {
  try {
    let where = { beautican_id: req.body.beautican_id };
    if (req.body.rate != 0) {
      where = { rate: req.body.rate };
    }

    const getReviews = await ReviewRating.find(where, "review rate").populate({
      path: "user_id",
      model: "user",
      select: { name: 1, image: 1 },
    });
    if (!getReviews) return queryErrorRelatedResponse(req, res, 404, "Data not found.");

    let transformedReviews = [];
    if (getReviews && getReviews.length > 0) {
      transformedReviews = getReviews.map((review) => ({
        _id: review._id,
        name: review.user_id.name,
        image: review.user_id.image,
        review: review.review,
        rate: review.rate,
      }));
    }

    totalReviews = getReviews.length;
    const baseUrl_user_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const AllData = {
      totalReviews: totalReviews,
      baseUrl_user_profile: baseUrl_user_profile,
      reviews: transformedReviews,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Upcoming Appointments
const getUpcomingApp = async (req, res, next) => {
  try {
    // Get the current date and time in ISO format and UNIX timestamp
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("x");

    const getApp = await Appointment.find(
      {
        user_id: req.user._id,
        $or: [{ status: 0 }, { status: 3 }],
        app_date: { $gte: currentDate }, // Appointments on or after the current date
        $or: [
          { app_date: currentDate, app_time: { $gte: currentTime } }, // Same date but future time
          { app_date: { $gt: currentDate } }, // Future dates
        ],
      },
      "beautican_id service_id app_date app_time amount appointment_id status"
    ).populate([
      {
        path: "beautican_id",
        model: "beautician",
        select: { name: 1, address: 1, image: 1, reviews: 1 },
        populate: {
          path: "reviews",
          select: { review: 1, rate: 1, user_id: 1 },
        },
      },
      {
        path: "cat_id",
        model: "category",
        select: { name: 1 },
      },
      {
        path: "service_id",
        model: "services",
        select: { name: 1, about: 1, display_image: 1 },
      },
    ]);

    if (!getApp) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    // let transformedData = [];
    // if (getApp && getApp.length > 0) {
    //   for (let i = 0; i < getApp.length; i++) {
    //     const data = getApp[i];

    //     let like = 0;
    //     let averageRating = 0;
    //     let transformedReviews = [];
    //     if (data.beautican_id.reviews && data.beautican_id.reviews.length > 0) {
    //       transformedReviews = data.beautican_id.reviews.map((review) => ({
    //         rate: review.rate,
    //       }));
    //     }

    //     if (transformedReviews && transformedReviews.length > 0) {
    //       totalReviews = transformedReviews.length;
    //       totalRatings = transformedReviews.reduce((sum, review) => sum + review.rate, 0);
    //       averageRating = totalRatings / totalReviews;
    //       averageRating = parseFloat(averageRating.toFixed(1));
    //     }

    //     const fav = await Favourite.findOne({
    //       user_id: req.user._id,
    //       beautican_id: data.beautican_id._id,
    //       service_id: data.service_id._id,
    //     });

    //     if (fav) {
    //       like = 1;
    //     }

    //     transformedData.push({
    //       _id: data._id,
    //       appointment_id: data.appointment_id,
    //       status: data.status,
    //       beautician_name: data.beautican_id.name,
    //       beautician_address: data.beautican_id.address,
    //       beautician_image: data.beautican_id.image,
    //       service_name: data.service_id.name,
    //       service_about: data.service_id.about,
    //       service_image: data.service_id.display_image,
    //       app_date: moment(data.app_date).format("MMMM DD, YYYY"),
    //       app_time: moment(parseInt(data.app_time)).format("hh:mm A"),
    //       amount: data.amount,
    //       totalReviews: totalReviews,
    //       averageRating: averageRating,
    //       like: like,
    //     });
    //   }
    // }

    // Call the transformUserAppointmentData function
    const transformedData = transformUserAppointmentData(getApp, req);

    const baseUrl_beauty_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;
    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      appointments: transformedData,
      baseUrl_beauty_profile: baseUrl_beauty_profile,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Completed Appointments
const getCompletedApp = async (req, res, next) => {
  try {
    const getApp = await Appointment.find(
      {
        user_id: req.user._id,
        status: 1,
      },
      "beautican_id service_id app_date app_time amount appointment_id status"
    ).populate([
      {
        path: "beautican_id",
        model: "beautician",
        select: { name: 1, address: 1, image: 1, reviews: 1, banner: 1 },
        populate: {
          path: "reviews",
          select: { review: 1, rate: 1, user_id: 1 },
        },
      },
      {
        path: "cat_id",
        model: "category",
        select: { name: 1 },
      },
      {
        path: "service_id",
        model: "services",
        select: { name: 1, about: 1, display_image: 1 },
      },
    ]);

    if (!getApp) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    // let transformedData = [];
    // if (getApp && getApp.length > 0) {
    //   for (let i = 0; i < getApp.length; i++) {
    //     const data = getApp[i];

    //     let like = 0;
    //     let averageRating = 0;
    //     let transformedReviews = [];
    //     if (data.beautican_id.reviews && data.beautican_id.reviews.length > 0) {
    //       transformedReviews = data.beautican_id.reviews.map((review) => ({
    //         rate: review.rate,
    //       }));
    //     }

    //     if (transformedReviews && transformedReviews.length > 0) {
    //       totalReviews = transformedReviews.length;
    //       totalRatings = transformedReviews.reduce((sum, review) => sum + review.rate, 0);
    //       averageRating = totalRatings / totalReviews;
    //       averageRating = parseFloat(averageRating.toFixed(1));
    //     }

    //     const fav = await Favourite.findOne({
    //       user_id: req.user._id,
    //       beautican_id: data.beautican_id._id,
    //       service_id: data.service_id._id,
    //     });

    //     if (fav) {
    //       like = 1;
    //     }

    //     transformedData.push({
    //       _id: data._id,
    //       appointment_id: data.appointment_id,
    //       status: data.status,
    //       beautician_name: data.beautican_id.name,
    //       beautician_address: data.beautican_id.address,
    //       beautician_image: data.beautican_id.image,
    //       beautician_banner: data.beautican_id.banner,
    //       service_name: data.service_id.name,
    //       service_about: data.service_id.about,
    //       service_image: data.service_id.display_image,
    //       app_date: moment(data.app_date).format("MMMM DD, YYYY"),
    //       app_time: moment(parseInt(data.app_time)).format("hh:mm A"),
    //       amount: data.amount,
    //       totalReviews: totalReviews,
    //       averageRating: averageRating,
    //       like: like,
    //     });
    //   }
    // }

    // Call the transformUserAppointmentData function
    const transformedData = transformUserAppointmentData(getApp, req);

    const baseUrl_beauty_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;
    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      appointments: transformedData,
      baseUrl_beauty_profile: baseUrl_beauty_profile,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Cancelled Appointments
const getCancelledApp = async (req, res, next) => {
  try {
    const getApp = await Appointment.find(
      {
        user_id: req.user._id,
        status: 2,
      },
      "beautican_id service_id app_date app_time amount cat_id appointment_id status"
    ).populate([
      {
        path: "beautican_id",
        model: "beautician",
        select: { name: 1, address: 1, image: 1, reviews: 1, banner: 1, open_time: 1, close_time: 1, duration: 1 },
        populate: {
          path: "reviews",
          select: { review: 1, rate: 1, user_id: 1 },
        },
      },
      {
        path: "cat_id",
        model: "category",
        select: { name: 1 },
      },
      {
        path: "service_id",
        model: "services",
        select: { name: 1, about: 1, display_image: 1 },
      },
    ]);

    if (!getApp) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    // Call the transformUserAppointmentData function
    const transformedData = transformUserAppointmentData(getApp, req);

    const baseUrl_beauty_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;
    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      appointments: transformedData,
      baseUrl_beauty_profile: baseUrl_beauty_profile,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Pending Appointments
const getPendingApp = async (req, res, next) => {
  try {
    const getApp = await Appointment.find(
      {
        user_id: req.user._id,
        $or: [{ status: 0 }, { status: 3 }],
      },
      "beautican_id service_id app_date app_time amount cat_id appointment_id status"
    ).populate([
      {
        path: "beautican_id",
        model: "beautician",
        select: { name: 1, address: 1, image: 1, reviews: 1, banner: 1, open_time: 1, close_time: 1, duration: 1 },
        populate: {
          path: "reviews",
          select: { review: 1, rate: 1, user_id: 1 },
        },
      },
      {
        path: "cat_id",
        model: "category",
        select: { name: 1 },
      },
      {
        path: "service_id",
        model: "services",
        select: { name: 1, about: 1, display_image: 1 },
      },
    ]);

    if (!getApp) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    // Call the transformUserAppointmentData function
    const transformedData = transformUserAppointmentData(getApp, req);

    const baseUrl_beauty_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;
    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      appointments: transformedData,
      baseUrl_beauty_profile: baseUrl_beauty_profile,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  bookAppointment,
  addReview,
  filterReviews,
  getUpcomingApp,
  getCompletedApp,
  getCancelledApp,
  getPendingApp,
};
