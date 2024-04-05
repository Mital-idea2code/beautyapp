const express = require("express");
const Appointment = require("../../../models/Appointment");
const ReviewRating = require("../../../models/ReviewRating");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const { transformAppointmentData } = require("../../../helper/commonServices");
const mongoose = require("mongoose");
const moment = require("moment-timezone");

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
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

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
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

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
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

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
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

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
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

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
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

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
