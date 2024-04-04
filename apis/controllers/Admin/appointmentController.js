const express = require("express");
const Appointment = require("../../models/Appointment");
const ReviewRating = require("../../models/ReviewRating");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const { transformAdminAppointmentData } = require("../../helper/commonServices");
const mongoose = require("mongoose");
const moment = require("moment-timezone");

//Get Upcoming Appointment list
const upcomingAppList = async (req, res, next) => {
  try {
    // Get the current date and time in ISO format and UNIX timestamp
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("x");

    const app = await Appointment.find({
      //   beautican_id: req.beautician._id,
      status: 0,
      app_date: { $gte: currentDate }, // Appointments on or after the current date
      $or: [
        { app_date: currentDate, app_time: { $gte: currentTime } }, // Same date but future time
        { app_date: { $gt: currentDate } }, // Future dates
      ],
    }).populate([
      {
        path: "beautican_id",
        model: "beautician",
        select: { name: 1, image: 1, email: 1 },
      },
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

    const transformedInfo = transformAdminAppointmentData(app);

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
      //   beautican_id: req.beautician._id,
      status: 0,
    }).populate([
      {
        path: "beautican_id",
        model: "beautician",
        select: { name: 1, image: 1, email: 1 },
      },
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

    const transformedInfo = transformAdminAppointmentData(app);

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
      //   beautican_id: req.beautician._id,
      status: 1,
    }).populate([
      {
        path: "beautican_id",
        model: "beautician",
        select: { name: 1, image: 1, email: 1 },
      },
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

    const transformedInfo = transformAdminAppointmentData(app);

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
      //   beautican_id: req.beautician._id,
      status: 2,
    }).populate([
      {
        path: "beautican_id",
        model: "beautician",
        select: { name: 1, image: 1, email: 1 },
      },
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

    const transformedInfo = transformAdminAppointmentData(app);

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

module.exports = {
  pendingAppList,
  completedAppList,
  cancelledAppList,
  upcomingAppList,
};
