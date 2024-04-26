const express = require("express");
const Appointment = require("../../../models/Appointment");
const ReviewRating = require("../../../models/ReviewRating");
const Notification = require("../../../models/Notification");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const { transformAppointmentData } = require("../../../helper/commonServices");
const mongoose = require("mongoose");
const moment = require("moment-timezone");

const firebaseadmin = require("firebase-admin");
const serviceAccount = require("../../../config/glamspot-firebase.json"); // Replace with your service account key

//Get Home Counts
const getHomeCount = async (req, res, next) => {
  try {
    const allApp = await Appointment.countDocuments({ beautican_id: req.beautician._id });
    const pendingApp = await Appointment.countDocuments({ beautican_id: req.beautician._id, status: 0 });
    const completedApp = await Appointment.countDocuments({ beautican_id: req.beautician._id, status: 1 });
    const cancelledApp = await Appointment.countDocuments({ beautican_id: req.beautician._id, status: 2 });

    const AllData = {
      allApp: allApp,
      pendingApp: pendingApp,
      completedApp: completedApp,
      cancelledApp: cancelledApp,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Datewise Appointment list
const datewiseAppList = async (req, res, next) => {
  try {
    const app = await Appointment.find({
      beautican_id: req.beautician._id,
      app_date: moment(req.body.app_date, "YYYY-M-D").format("YYYY-MM-DD"),
    }).populate([
      {
        path: "user_id",
        model: "user",
        select: { name: 1, address: 1, image: 1, email: 1, mo_no: 1 },
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
    if (!app) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    const transformedInfo = transformAppointmentData(app);

    const baseUrl_user_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Upcoming Appointment list
const upcomingAppList = async (req, res, next) => {
  try {
    // Get the current date and time in ISO format and UNIX timestamp
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("x");

    const app = await Appointment.find({
      beautican_id: req.beautician._id,
      $or: [{ status: 0 }, { status: 3 }],
      app_date: { $gte: currentDate }, // Appointments on or after the current date
      $or: [
        { app_date: currentDate, app_time: { $gte: currentTime } }, // Same date but future time
        { app_date: { $gt: currentDate } }, // Future dates
      ],
    }).populate([
      {
        path: "user_id",
        model: "user",
        select: { name: 1, address: 1, image: 1, email: 1, mo_no: 1 },
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
    if (!app) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    const transformedInfo = transformAppointmentData(app);

    const baseUrl_user_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Pending Appointment list
const pendingAppList = async (req, res, next) => {
  try {
    const app = await Appointment.find({
      beautican_id: req.beautician._id,
      $or: [{ status: 0 }, { status: 3 }],
    }).populate([
      {
        path: "user_id",
        model: "user",
        select: { name: 1, address: 1, image: 1, email: 1, mo_no: 1 },
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
    if (!app) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    const transformedInfo = transformAppointmentData(app);

    const baseUrl_user_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Completed Appointment list
const completedAppList = async (req, res, next) => {
  try {
    const app = await Appointment.find({
      beautican_id: req.beautician._id,
      status: 1,
    }).populate([
      {
        path: "user_id",
        model: "user",
        select: { name: 1, address: 1, image: 1, email: 1, mo_no: 1 },
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
    if (!app) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    const transformedInfo = transformAppointmentData(app);

    const baseUrl_user_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Cancelled Appointment list
const cancelledAppList = async (req, res, next) => {
  try {
    const app = await Appointment.find({
      beautican_id: req.beautician._id,
      status: 2,
    }).populate([
      {
        path: "user_id",
        model: "user",
        select: { name: 1, address: 1, image: 1, email: 1, mo_no: 1 },
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
    if (!app) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    const transformedInfo = transformAppointmentData(app);

    const baseUrl_user_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Update Appointment Status
const updateApptatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const app = await Appointment.findById(id);
    if (!app) return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");

    app.status = req.body.status;
    app.cancel_reason = req.body.cancel_reason;

    const result = await app.save();

    firebaseadmin.initializeApp({
      credential: firebaseadmin.credential.cert(serviceAccount),
    });

    let title = "";
    let description = "";
    if (req.body.status == 1) {
      title = "Congratulations! Appointment Completed!";
      description =
        "Congratulations! Your appointment has been completed. Here's your appointment ID: " +
        app.appointment_id +
        ". We hope you had a positive experience and look forward to serving you again in the future.";
    } else if (req.body.status == 2) {
      title = "Sorry, Appointment Cancellation Notice";
      description =
        "We regret to inform you that your appointment with appointment ID " +
        app.appointment_id +
        " has been canceled due to " +
        req.body.cancel_reason +
        ". We apologize for any inconvenience this may cause and appreciate your understanding.Please feel free to reschedule at your convenience.";
    } else if (req.body.status == 3) {
      title = "Hooray! Appointment Accepted!";
      description =
        "Great news! Your appointment has been accepted. Here's your appointment ID: " +
        app.appointment_id +
        ". Looking forward to seeing you there!";
    }

    const newNoti = await Notification.create({
      title: title,
      description: description,
      user_id: app.user_id,
      role: 1,
    });
    await newNoti.save();

    const message = {
      notification: {
        title: title,
        body: description,
      },
      token: beautician.fcm_token,
    };

    await firebaseadmin.messaging().send(message);

    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Filter Reviews based on rate
const filterReviews = async (req, res, next) => {
  try {
    let where = { beautican_id: req.beautician._id };
    if (req.params.id != 0) {
      where = { rate: req.params.id };
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

module.exports = {
  updateApptatus,
  getHomeCount,
  datewiseAppList,
  pendingAppList,
  completedAppList,
  cancelledAppList,
  upcomingAppList,
  filterReviews,
};
