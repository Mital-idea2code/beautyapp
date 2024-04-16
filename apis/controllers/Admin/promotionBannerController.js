const express = require("express");
const promotionBanner = require("../../models/PromotionBanner");
const Beautician = require("../../models/Beautician");
const HomeBanner = require("../../models/HomeBanner");
const deleteFiles = require("../../helper/deleteFiles");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const mongoose = require("mongoose");

//Add promotion Banner
const addpromotionBanner = async (req, res, next) => {
  try {
    const addedBanner = req.body;
    if (req.file) {
      addedBanner.image = req.file.filename;
    }
    const newCat = await new promotionBanner(addedBanner);

    const result = await newCat.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update promotion Banner
const updatepromotionBanner = async (req, res, next) => {
  try {
    const banner = await promotionBanner.findById(req.params.id);
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "promotion Banner not found.");

    const updatedData = req.body;
    updatedData.image = banner.image;
    if (req.file) {
      deleteFiles("banner/" + banner.image);
      updatedData.image = req.file.filename;
    }

    const isUpdate = await promotionBanner.findByIdAndUpdate(req.params.id, { $set: updatedData });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await promotionBanner.findById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update promotion Banner Status
const updateProBannerStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const banner = await promotionBanner.findById(id);
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "promotion Banner not found.");

    const check_banner = await promotionBanner.findOne({ status: true, _id: { $ne: id } });
    const check_pro_banner = await HomeBanner.findOne({ status: true });

    if (!check_banner && !check_pro_banner) {
      return queryErrorRelatedResponse(req, res, 213, "At least one banner must have the status set to enabled.");
    } else {
      banner.status = !banner.status;
      const result = await banner.save();
      return successResponse(res, result);
    }
  } catch (err) {
    next(err);
  }
};

//Delete Single promotion Banner
const deletepromotionBanner = async (req, res, next) => {
  try {
    const id = req.params.id;
    const banner = await promotionBanner.findById(id);
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "promotion Banner not found.");
    deleteFiles("banner/" + banner.image);
    await promotionBanner.deleteOne({ _id: id });
    deleteResponse(res, "promotionBanner deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple promotion Banner
const deleteMultpromotionBanner = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      const banner = await promotionBanner.findById(item);
      if (!banner) return queryErrorRelatedResponse(req, res, 404, "promotion Banner not found.");
      deleteFiles("promotionBanner/" + banner.image);

      await promotionBanner.deleteOne({ _id: item });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Get All promotion Banner
const getAllpromotionBanner = async (req, res, next) => {
  try {
    const banner = await promotionBanner.find().populate([
      {
        path: "beautican_id",
        select: "name email",
      },
      {
        path: "service_id",
        select: "name",
      },
    ]);
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "promotion Banner not found.");

    // Transform the data using a for loop
    const transformedData = [];
    for (const item of banner) {
      transformedData.push({
        _id: item._id,
        image: item.image,
        beautican_id: item.beautican_id._id ? item.beautican_id._id : "Null",
        name: item.beautican_id.name ? item.beautican_id.name : "Null",
        email: item.beautican_id.email ? item.beautican_id.email : "Null",
        email: item.beautican_id.email ? item.beautican_id.email : "Null",
        service_id: item.service_id._id ? item.service_id._id : "Null",
        service_name: item.service_id.name ? item.service_id.name : "Null",
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      });
    }

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BANNER_PATH;

    const AllData = {
      banner: transformedData,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addpromotionBanner,
  updatepromotionBanner,
  updateProBannerStatus,
  deletepromotionBanner,
  deleteMultpromotionBanner,
  getAllpromotionBanner,
};
