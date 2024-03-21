const GeneralSettings = require("../../../models/GeneralSettings");
const HomeBanner = require("../../../models/HomeBanner");
const PromotionalBanner = require("../../../models/PromotionalBanner");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");

//Get  General Settings
const getGeneralSettings = async (req, res, next) => {
  try {
    const getSettingsData = await GeneralSettings.findOne({}, "user_tc user_pp"); //beautician_tc beautician_pp
    if (!getSettingsData) return queryErrorRelatedResponse(req, res, 404, "Data not found.");
    successResponse(res, getSettingsData);
  } catch (err) {
    next(err);
  }
};

//Get Banners
const getBanners = async (req, res, next) => {
  try {
    const getBanners = await HomeBanner.find({ status: true });

    const getProBanners = await PromotionalBanner.find().populate({
      path: "beautican_id",
      match: { status: true },
      populate: {
        path: "services",
        match: { status: true },
        model: "services",
      },
    });

    // Merge the two arrays
    const mergedBanners = getBanners.concat(getProBanners);
    if (mergedBanners && mergedBanners.length > 0) {
      const baseUrl_banner =
        req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BANNER_PATH;

      const baseUrl_category =
        req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_CATEGORY_PATH;

      const baseUrl_profile =
        req.protocol +
        "://" +
        req.get("host") +
        process.env.BASE_URL_PUBLIC_PATH +
        process.env.BASE_URL_BEAUTICIAN_PATH;

      const baseUrl_service =
        req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

      const AllData = {
        banners: mergedBanners,
        baseUrl_banner: baseUrl_banner,
        baseUrl_category: baseUrl_category,
        baseUrl_profile: baseUrl_profile,
        baseUrl_service: baseUrl_service,
      };

      successResponse(res, AllData);
    } else {
      return queryErrorRelatedResponse(req, res, 404, "Data not found.");
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGeneralSettings,
  getBanners,
};
