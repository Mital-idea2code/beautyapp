const express = require("express");
const HomeBanner = require("../../models/HomeBanner");
const {
  createResponse,
  queryErrorRelatedResponse,
  successResponse,
  successResponseOfFiles,
} = require("../../helper/sendResponse");

const AddBanner = async (req, res, next) => {
  try {
    const newBanners = req.body;
    if (req.files["banner1"]) {
      newBanners.banner1 = req.files["banner1"][0].filename;
    }

    if (req.files["banner2"]) {
      newBanners.banner2 = req.files["banner2"][0].filename;
    }

    if (req.files["banner3"]) {
      newBanners.banner3 = req.files["banner3"][0].filename;
    }

    const addBanners = await new HomeBanner(newBanners);

    const result = await addBanners.save();

    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

const updateBanners = async (req, res, next) => {
  try {
    //Check user exist or not
    const banners = await HomeBanner.findById(req.body.id);
    if (!banners) return queryErrorRelatedResponse(req, res, 401, "Invalid Banner Details!!");

    const newBanners = req.body;
    if (req.files["banner1"]) {
      deleteFiles("banner/" + banners.banner1);
      newBanners.banner1 = req.files["banner1"][0].filename;
    }

    if (req.files["banner2"]) {
      deleteFiles("banner/" + banners.banner2);
      newBanners.banner2 = req.files["banner2"][0].filename;
    }

    if (req.files["banner3"]) {
      deleteFiles("banner/" + banners.banner3);
      newBanners.banner3 = req.files["banner3"][0].filename;
    }

    const isUpdate = await HomeBanner.findByIdAndUpdate(req.body.id, { $set: req.body });

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BANNER_PATH;

    return successResponseOfFiles(res, "Banners Updated!", baseUrl);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  AddBanner,
  updateBanners,
};
