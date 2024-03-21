const express = require("express");
const PromotionalBanner = require("../../models/PromotionalBanner");
const deleteFiles = require("../../helper/deleteFiles");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const mongoose = require("mongoose");

//Add Promotional Banner
const addPromotionalBanner = async (req, res, next) => {
  try {
    const addedBanner = req.body;
    if (req.file) {
      addedBanner.image = req.file.filename;
    }
    const newCat = await new PromotionalBanner(addedBanner);

    const result = await newCat.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Promotional Banner
const updatePromotionalBanner = async (req, res, next) => {
  try {
    const banner = await PromotionalBanner.findById(req.params.id);
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "Promotional Banner not found.");

    const updatedData = req.body;
    updatedData.image = banner.image;
    if (req.file) {
      deleteFiles("banner/" + banner.image);
      updatedData.image = req.file.filename;
    }

    const isUpdate = await PromotionalBanner.findByIdAndUpdate(req.params.id, { $set: updatedData });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await PromotionalBanner.findById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Promotional Banner Status
const updateProBannerStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const banner = await PromotionalBanner.findById(id);
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "Promotional Banner not found.");

    banner.status = !banner.status;
    const result = await banner.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Delete Single Promotional Banner
const deletePromotionalBanner = async (req, res, next) => {
  try {
    const id = req.params.id;
    const banner = await PromotionalBanner.findById(id);
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "Promotional Banner not found.");
    deleteFiles("banner/" + banner.image);
    await PromotionalBanner.deleteOne({ _id: id });
    deleteResponse(res, "PromotionalBanner deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple Promotional Banner
const deleteMultPromotionalBanner = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      const banner = await PromotionalBanner.findById(item);
      if (!banner) return queryErrorRelatedResponse(req, res, 404, "Promotional Banner not found.");
      deleteFiles("PromotionalBanner/" + banner.image);

      await PromotionalBanner.deleteOne({ _id: item });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Get All Promotional Banner
const getAllPromotionalBanner = async (req, res, next) => {
  try {
    const banner = await PromotionalBanner.find();
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "Promotional Banner not found.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BANNER_PATH;

    const AllData = {
      banner: banner,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addPromotionalBanner,
  updatePromotionalBanner,
  updateProBannerStatus,
  deletePromotionalBanner,
  deleteMultPromotionalBanner,
  getAllPromotionalBanner,
};
