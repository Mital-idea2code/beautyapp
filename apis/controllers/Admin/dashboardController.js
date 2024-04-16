const express = require("express");
const Appointment = require("../../models/Appointment");
const User = require("../../models/User");
const Beautician = require("../../models/Beautician");
const Category = require("../../models/Category");
const Service = require("../../models/Service");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { transformAdminAppointmentData } = require("../../helper/commonServices");
//Get Dashboard Count Data
const getDashboardCount = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const beauticianCount = await Beautician.countDocuments();
    const CategoryCount = await Category.countDocuments();
    const ServiceCount = await Service.countDocuments();
    const pendingCount = await Appointment.countDocuments({ status: 0 });
    const acceptedCount = await Appointment.countDocuments({ status: 3 });
    const completedCount = await Appointment.countDocuments({ status: 1 });
    const cancelledCount = await Appointment.countDocuments({ status: 2 });

    const result = {
      userCount: userCount,
      beauticianCount: beauticianCount,
      CategoryCount: CategoryCount,
      ServiceCount: ServiceCount,
      pendingCount: pendingCount,
      acceptedCount: acceptedCount,
      completedCount: completedCount,
      cancelledCount: cancelledCount,
    };

    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Get Top Beautician Data
const getTopBeauticianData = async (req, res, next) => {
  try {
    const mostAppointments = await Appointment.aggregate([
      {
        $match: {
          status: 1,
        },
      },
      {
        $group: {
          _id: "$beautican_id",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let beautician = {};
    let counts = {
      Pending: 0,
      Accepted: 0,
      Completed: 0,
      Cancelled: 0,
    };

    if (mostAppointments.length > 0) {
      const topBeauticianId = mostAppointments[0]._id;
      beautician = await Beautician.findById(topBeauticianId);
      counts.Pending = await Appointment.countDocuments({ status: 0, beautician_id: topBeauticianId });
      counts.Accepted = await Appointment.countDocuments({ status: 3, beautician_id: topBeauticianId });
      counts.Completed = mostAppointments[0].count;
      counts.Cancelled = await Appointment.countDocuments({ status: 2, beautician_id: topBeauticianId });
    }

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const result = {
      _id: beautician._id || "",
      name: beautician.name || "",
      email: beautician.email || "",
      image: beautician.image || "",
      baseUrl: baseUrl,
      topCount: mostAppointments.length > 0 ? mostAppointments[0].count : 0,
      counts: counts,
    };

    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Get Top User Data
const getTopUserData = async (req, res, next) => {
  try {
    const mostAppointments = await Appointment.aggregate([
      {
        $match: {
          status: 1, // Filter appointments where status is 1
        },
      },
      {
        $group: {
          _id: "$user_id",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    let user = {};
    let counts = {
      Pending: 0,
      Accepted: 0,
      Completed: 0,
      Cancelled: 0,
    };

    if (mostAppointments.length > 0) {
      const topUserId = mostAppointments[0]._id;
      user = await User.findById(topUserId);
      counts.Pending = await Appointment.countDocuments({ status: 0, user_id: topUserId });
      counts.Accepted = await Appointment.countDocuments({ status: 3, user_id: topUserId });
      counts.Completed = mostAppointments[0].count;
      counts.Cancelled = await Appointment.countDocuments({ status: 2, user_id: topUserId });
    }

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const result = {
      _id: user._id || "",
      name: user.name || "",
      email: user.email || "",
      image: user.image || "",
      baseUrl: baseUrl,
      topCount: mostAppointments.length > 0 ? mostAppointments[0].count : 0,
      counts: counts,
    };

    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Get Upcoming top 2 Appointments list
const topUpcomingAppList = async (req, res, next) => {
  try {
    // Get the current date and time in ISO format and UNIX timestamp
    const currentDate = moment().format("YYYY-MM-DD");
    const currentTime = moment().format("x");

    const app = await Appointment.find({
      $or: [{ status: 0 }, { status: 3 }],
      app_date: { $gte: currentDate },
      $or: [{ app_date: currentDate, app_time: { $gte: currentTime } }, { app_date: { $gt: currentDate } }],
    })
      .sort({
        app_date: 1,
        app_time: 1,
      })
      .limit(2)
      .populate([
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
  getDashboardCount,
  getTopBeauticianData,
  getTopUserData,
  topUpcomingAppList,
};
