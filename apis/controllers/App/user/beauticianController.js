const express = require("express");
const Beautician = require("../../../models/Beautician");
const Category = require("../../../models/Category");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const mongoose = require("mongoose");

//Get All Active Beautician
const getHomeBeauticians = async (req, res, next) => {
  try {
    const cat = await Category.findOne({ status: true });
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    // const beautician = await Beautician.find({ status: true }).populate({
    //   path: "services",
    //   match: { cat_id: cat._id }, // Match the service ID
    // });

    // const beautician = await Beautician.find({ status: true, services: { $elemMatch: { cat_id: cat._id } } }).populate(
    //   "services"
    // );

    const beautician = await Beautician.aggregate([
      {
        $match: { status: true }, // Match active beauticians
      },
      {
        $lookup: {
          from: "services", // Name of the Services collection
          localField: "services",
          foreignField: "_id",
          as: "services", // Populate the services field
        },
      },
      {
        $unwind: "$services", // Unwind the services array
      },
      {
        $match: { "services.cat_id": cat._id }, // Filter based on cat_id
      },
    ]);

    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    const baseUrl_profile =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BEAUTICIAN_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      beautician: beautician,
      baseUrl_profile: baseUrl_profile,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get All Active Beautician
const getBeauticiansByid = async (req, res, next) => {
  try {
    // const beautician = await Beautician.find({
    //   status: true,
    //   services: { $elemMatch: { cat_id: req.params.id } },
    // }).populate("services");

    const catId = "65f7e12290e46e827763625d"; // Assuming this is the cat_id you want to filter by

    const beautician = await Beautician.aggregate([
      {
        $match: { status: true }, // Match active beauticians
      },
      {
        $lookup: {
          from: "services", // Name of the Services collection
          localField: "services",
          foreignField: "_id",
          as: "services", // Populate the services field
        },
      },
      {
        $unwind: "$services", // Unwind the services array
      },
      {
        $match: { "services.cat_id": catId }, // Filter based on cat_id
      },
    ]);

    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    const baseUrl_profile =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BEAUTICIAN_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      beautician: beautician,
      baseUrl_profile: baseUrl_profile,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = { getHomeBeauticians, getBeauticiansByid };
