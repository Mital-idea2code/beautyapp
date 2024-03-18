const GeneralSettings = require("../../../models/GeneralSettings");
const HomeBanner = require("../../../models/HomeBanner");
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
    const getBanners = await HomeBanner.find(); //beautician_tc beautician_pp
    if (!getBanners) return queryErrorRelatedResponse(req, res, 404, "Data not found.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BANNER_PATH;

    const AllData = {
      banners: getBanners,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGeneralSettings,
  getBanners,
};
