const GeneralSettings = require("../../../models/GeneralSettings");
const Faqs = require("../../../models/Faqs");
const HomeBanner = require("../../../models/HomeBanner");
const User = require("../../../models/User");
const promotionBanner = require("../../../models/PromotionBanner");
const Notification = require("../../../models/Notification");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const bcrypt = require("bcrypt");

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

//Get Support Data
const getSupportData = async (req, res, next) => {
  try {
    const getSupportData = await GeneralSettings.findOne({}, "user_support_email user_support_mono"); //beautician_tc beautician_pp
    if (!getSupportData) return queryErrorRelatedResponse(req, res, 404, "Data not found.");
    successResponse(res, getSupportData);
  } catch (err) {
    next(err);
  }
};

//Get Banners
const getBanners = async (req, res, next) => {
  try {
    const getBanners = await HomeBanner.find({ status: true });

    const getProBanners = await promotionBanner.find({ status: true });

    // Merge the two arrays
    const mergedBanners = getBanners.concat(getProBanners);
    if (mergedBanners && mergedBanners.length > 0) {
      const baseUrl_banner =
        req.protocol +
        "://" +
        req.get("host") +
        process.env.BASE_URL_API_FOLDER +
        process.env.BASE_URL_PUBLIC_PATH +
        process.env.BASE_URL_BANNER_PATH;

      const baseUrl_category =
        req.protocol +
        "://" +
        req.get("host") +
        process.env.BASE_URL_API_FOLDER +
        process.env.BASE_URL_PUBLIC_PATH +
        process.env.BASE_URL_CATEGORY_PATH;

      const baseUrl_profile =
        req.protocol +
        "://" +
        req.get("host") +
        process.env.BASE_URL_PUBLIC_PATH +
        process.env.BASE_URL_BEAUTICIAN_PATH;

      const baseUrl_service =
        req.protocol +
        "://" +
        req.get("host") +
        process.env.BASE_URL_API_FOLDER +
        process.env.BASE_URL_PUBLIC_PATH +
        process.env.BASE_URL_SERVICE_PATH;

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

// Change Password
const changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "User not found.");

    const valid_pass = await bcrypt.compare(old_password, user.password);
    if (!valid_pass) return queryErrorRelatedResponse(req, res, 401, "Invalid Old Password");

    if (new_password != confirm_password) {
      return queryErrorRelatedResponse(req, res, 404, "Confirm password does not match.");
    }

    user.password = new_password;
    await user.save();
    successResponse(res, "Password changed successfully!");
  } catch (err) {
    next(err);
  }
};

//Update Notification Status
const updateNotitatus = async (req, res, next) => {
  try {
    // Convert string is into Object id
    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "User not found.");

    user.noti_status = !user.noti_status;
    const noti_status = user.noti_status;
    await user.save();
    return successResponse(res, { noti_status: noti_status });
  } catch (err) {
    next(err);
  }
};

//Get  Faqs
const getFaqs = async (req, res, next) => {
  try {
    const getFaqsData = await Faqs.find({ status: true, role: 1 }, "question answer");
    if (!getFaqsData) return queryErrorRelatedResponse(req, res, 404, "Faqs not found.");
    successResponse(res, getFaqsData);
  } catch (err) {
    next(err);
  }
};

//Get All Notifications
const getAllNotifications = async (req, res, next) => {
  try {
    const allNoti = await Notification.find({ role: 1, user_id: req.user._id });
    if (!allNoti) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    successResponse(res, allNoti);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGeneralSettings,
  getSupportData,
  getBanners,
  changePassword,
  updateNotitatus,
  getFaqs,
  getAllNotifications,
};
