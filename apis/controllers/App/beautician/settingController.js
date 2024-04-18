const GeneralSettings = require("../../../models/GeneralSettings");
const Faqs = require("../../../models/Faqs");
const Beautician = require("../../../models/Beautician");
const Category = require("../../../models/Category");
const Favourite = require("../../../models/Favourite");
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
    const getSettingsData = await GeneralSettings.findOne({}, "beautician_tc beautician_pp");
    if (!getSettingsData) return queryErrorRelatedResponse(req, res, 404, "Data not found.");
    successResponse(res, getSettingsData);
  } catch (err) {
    next(err);
  }
};

//Get Support Data
const getSupportData = async (req, res, next) => {
  try {
    const getSupportData = await GeneralSettings.findOne({}, "beautician_support_email beautician_support_mono"); //beautician_tc beautician_pp
    if (!getSupportData) return queryErrorRelatedResponse(req, res, 404, "Data not found.");
    successResponse(res, getSupportData);
  } catch (err) {
    next(err);
  }
};

// Change Password
const changePassword = async (req, res, next) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;

    const beautician = await Beautician.findById(req.beautician._id);
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    const valid_pass = await bcrypt.compare(old_password, beautician.password);
    if (!valid_pass) return queryErrorRelatedResponse(req, res, 401, "Invalid Old Password");

    if (new_password != confirm_password) {
      return queryErrorRelatedResponse(req, res, 404, "Confirm password does not match.");
    }

    beautician.password = new_password;
    await beautician.save();
    successResponse(res, "Password changed successfully!");
  } catch (err) {
    next(err);
  }
};

//Update Notification Status
const updateNotitatus = async (req, res, next) => {
  try {
    // Convert string is into Object id
    const beautician = await Beautician.findById(req.beautician._id);
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    beautician.noti_status = !beautician.noti_status;
    const noti_status = beautician.noti_status;
    await beautician.save();
    return successResponse(res, { noti_status: noti_status });
  } catch (err) {
    next(err);
  }
};

//Get  Faqs
const getFaqs = async (req, res, next) => {
  try {
    const getFaqsData = await Faqs.find({ status: true, role: 2 }, "question answer");
    if (!getFaqsData) return queryErrorRelatedResponse(req, res, 404, "Faqs not found.");
    successResponse(res, getFaqsData);
  } catch (err) {
    next(err);
  }
};

//Get All Active Category
const getAllCategory = async (req, res, next) => {
  try {
    const allCat = await Category.find({ status: true }, "name image");
    if (!allCat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_CATEGORY_PATH;

    const AllData = {
      cat: allCat,
      baseUrl: baseUrl,
    };

    successResponse(res, allCat);
  } catch (err) {
    next(err);
  }
};

//Who Likes Me - Favourite API
const likeMe = async (req, res, next) => {
  try {
    const allFav = await Favourite.find({ beautican_id: req.beautician._id }).populate([
      {
        path: "service_id",
        select: { name: 1 },
      },
      {
        path: "user_id",
        model: "user",
        select: { name: 1, city: 1, image: 1, email: 1, mo_no: 1 },
      },
    ]);
    if (!allFav) return queryErrorRelatedResponse(req, res, 404, "Data not found.");

    // Transform the "fav" array
    const transformedFav = [];
    for (const item of allFav) {
      const transformedItem = {
        _id: item._id,
        beautican_id: item.beautican_id,
        user_id: item.user_id._id,
        user_name: item.user_id.name,
        user_email: item.user_id.email,
        user_city: item.user_id.city,
        user_mo_no: item.user_id.mo_no,
        user_image: item.user_id.image,
        service_id: item.service_id._id,
        service_name: item.service_id.name,
      };
      transformedFav.push(transformedItem);
    }

    const baseUrl_user_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const AllData = {
      fav: transformedFav,
      baseUrl_user_profile: baseUrl_user_profile,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get All Notifications
const getAllNotifications = async (req, res, next) => {
  try {
    const allNoti = await Notification.find({ role: 2, user_id: req.beautician._id });
    if (!allNoti) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    successResponse(res, allNoti);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGeneralSettings,
  getSupportData,
  changePassword,
  updateNotitatus,
  getFaqs,
  getAllCategory,
  likeMe,
  getAllNotifications,
};
