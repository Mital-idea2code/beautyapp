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
      $or: [{ status: 0 }, { status: 3 }],
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

    const baseUrl_beautician =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
      baseUrl_beautician: baseUrl_beautician,
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

    const baseUrl_beautician =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
      baseUrl_beautician: baseUrl_beautician,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Accepted Appointment list
const acceptedAppList = async (req, res, next) => {
  try {
    const app = await Appointment.find({
      //   beautican_id: req.beautician._id,
      status: 3,
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

    const baseUrl_beautician =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
      baseUrl_beautician: baseUrl_beautician,
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

    const baseUrl_beautician =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
      baseUrl_beautician: baseUrl_beautician,
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

    const baseUrl_beautician =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
      baseUrl_beautician: baseUrl_beautician,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Appointment Info By ID
const AppInfo = async (req, res, next) => {
  try {
    const app = await Appointment.findById(req.params.id).populate([
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
        select: { name: 1, about: 1, display_image: 1, address: 1 },
      },
    ]);
    if (!app) return queryErrorRelatedResponse(req, res, 404, "Appointments not found.");

    const review = await ReviewRating.findOne({
      appointment_id: app._id,
    });

    // Transform the data as per the new structure
    const transformedData = {
      _id: app._id,
      appointment_id: app.appointment_id,
      user_name: app.user_id.name,
      user_address: app.user_id.address,
      user_email: app.user_id.email,
      user_mo_no: app.user_id.mo_no,
      user_image: app.user_id.image,
      beautician_name: app.beautican_id.name,
      beautician_email: app.beautican_id.email,
      beautician_image: app.beautican_id.image,
      beautician_address: app.beautican_id.address ? app.beautican_id.address : "",
      category_name: app.cat_id.name,
      service_name: app.service_id.name,
      service_about: app.service_id.about,
      service_display_image: app.service_id.display_image,
      app_date: moment(app.app_date).format("MMMM DD, YYYY"),
      app_time: moment(parseInt(app.app_time)).format("hh:mm A"),
      amount: app.amount,
      status: app.status,
      cancel_reason: app.cancel_reason,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      review: review ? review.review : "",
      rate: review ? review.rate : "",
    };

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

    const baseUrl_beautician =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const AllData = {
      appointments: transformedData,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
      baseUrl_beautician: baseUrl_beautician,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get  Appointment list From Beautician ID
const beauticianAppList = async (req, res, next) => {
  try {
    const app = await Appointment.find({
      beautican_id: req.params.id,
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

    const baseUrl_beautician =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
      baseUrl_beautician: baseUrl_beautician,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get  Appointment list From User ID
const userAppList = async (req, res, next) => {
  try {
    const app = await Appointment.find({
      user_id: req.params.id,
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

    const baseUrl_beautician =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const AllData = {
      appointments: transformedInfo,
      baseUrl_user_profile: baseUrl_user_profile,
      baseUrl_service: baseUrl_service,
      baseUrl_beautician: baseUrl_beautician,
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
  acceptedAppList,
  AppInfo,
  beauticianAppList,
  userAppList,
};
