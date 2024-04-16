const express = require("express");
const HomeBanner = require("../../models/HomeBanner");
const PromotionBanner = require("../../models/PromotionBanner");
const {
  createResponse,
  queryErrorRelatedResponse,
  successResponse,
  successResponseOfFiles,
} = require("../../helper/sendResponse");

// const AddBanner = async (req, res, next) => {
//   try {
//     const newBanners = req.body;
//     if (req.files["banner1"]) {
//       newBanners.banner1 = req.files["banner1"][0].filename;
//     }

//     if (req.files["banner2"]) {
//       newBanners.banner2 = req.files["banner2"][0].filename;
//     }

//     if (req.files["banner3"]) {
//       newBanners.banner3 = req.files["banner3"][0].filename;
//     }

//     const addBanners = await new HomeBanner(newBanners);

//     const result = await addBanners.save();

//     return createResponse(res, result);
//   } catch (err) {
//     next(err);
//   }
// };

// const updateBanners = async (req, res, next) => {
//   try {
//     //Check user exist or not
//     const banners = await HomeBanner.findById(req.body.id);
//     if (!banners) return queryErrorRelatedResponse(req, res, 401, "Invalid Banner Details!!");

//     const newBanners = req.body;
//     if (req.files["banner1"]) {
//       deleteFiles("banner/" + banners.banner1);
//       newBanners.banner1 = req.files["banner1"][0].filename;
//     }

//     if (req.files["banner2"]) {
//       deleteFiles("banner/" + banners.banner2);
//       newBanners.banner2 = req.files["banner2"][0].filename;
//     }

//     if (req.files["banner3"]) {
//       deleteFiles("banner/" + banners.banner3);
//       newBanners.banner3 = req.files["banner3"][0].filename;
//     }

//     const isUpdate = await HomeBanner.findByIdAndUpdate(req.body.id, { $set: req.body });

//     const baseUrl =
//       req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BANNER_PATH;

//     return successResponseOfFiles(res, "Banners Updated!", baseUrl);
//   } catch (err) {
//     next(err);
//   }
// };

//Add Home Banner
const AddBanner = async (req, res, next) => {
  try {
    const addedBanner = req.body;
    if (req.file) {
      addedBanner.image = req.file.filename;
    }
    const newCat = await new HomeBanner(addedBanner);

    const result = await newCat.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Home Banner
const updateBanners = async (req, res, next) => {
  try {
    const banner = await HomeBanner.findById(req.params.id);
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "Banner not found.");

    const updatedData = req.body;
    updatedData.image = banner.image;
    if (req.file) {
      deleteFiles("banner/" + banner.image);
      updatedData.image = req.file.filename;
    }

    const isUpdate = await HomeBanner.findByIdAndUpdate(req.params.id, { $set: updatedData });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await HomeBanner.findById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Home Banner Status
const updateBannerStatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const banner = await HomeBanner.findById(id);
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "Banner not found.");

    const check_banner = await HomeBanner.findOne({ status: true, _id: { $ne: id } });
    const check_pro_banner = await PromotionBanner.findOne({ status: true });

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

//Get All promotion Banner
const getAllBanner = async (req, res, next) => {
  try {
    const banner = await HomeBanner.find();
    if (!banner) return queryErrorRelatedResponse(req, res, 404, "promotion Banner not found.");

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BANNER_PATH;

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
  AddBanner,
  updateBanners,
  updateBannerStatus,
  getAllBanner,
};
