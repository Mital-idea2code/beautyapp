const GeneralSettings = require("../../models/GeneralSettings");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");

//Add General Settings
const addGeneralSettings = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const newSeetings = await GeneralSettings.create({
      email,
      password,
    });
    //save Admin and response
    createResponse(res, newSeetings);
  } catch (err) {
    next(err);
  }
};

//Update General Settings
const updateGeneralSetting = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const pp = await GeneralSettings.findById(req.params.id);
    if (!pp) return queryErrorRelatedResponse(req, res, 404, "Data not found.");

    pp.email = email;
    pp.password = password;
    let result = await pp.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Get  General Settings
const getGeneralSettings = async (req, res, next) => {
  try {
    const pp = await GeneralSettings.findOne();
    if (!pp) return queryErrorRelatedResponse(req, res, 404, "Data not found.");
    successResponse(res, pp);
  } catch (err) {
    next(err);
  }
};

//Update Terms &  Conditions
const updateUserTc = async (req, res, next) => {
  try {
    const { user_tc } = req.body;
    const tc = await GeneralSettings.findById(req.params.id);
    if (!tc) return queryErrorRelatedResponse(req, res, 404, "Terms & Condition not found.");

    tc.user_tc = user_tc;
    const result = await tc.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Terms &  Conditions
const updateBeauticianTc = async (req, res, next) => {
  try {
    const { beautician_tc } = req.body;
    const tc = await GeneralSettings.findById(req.params.id);
    if (!tc) return queryErrorRelatedResponse(req, res, 404, "Terms & Condition not found.");

    tc.beautician_tc = beautician_tc;
    const result = await tc.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Privacy Policy
const updateUserPP = async (req, res, next) => {
  try {
    const { user_pp } = req.body;
    const tc = await GeneralSettings.findById(req.params.id);
    if (!tc) return queryErrorRelatedResponse(req, res, 404, "Privacy Policy not found.");

    tc.user_pp = user_pp;
    const result = await tc.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Privacy Policy
const updateBeauticianPP = async (req, res, next) => {
  try {
    const { beautician_pp } = req.body;
    const tc = await GeneralSettings.findById(req.params.id);
    if (!tc) return queryErrorRelatedResponse(req, res, 404, "Privacy Policy not found.");

    tc.beautician_pp = beautician_pp;
    const result = await tc.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update User Support Data
const updatSupportData = async (req, res, next) => {
  try {
    const { user_support_email, user_support_mono, beautician_support_email, beautician_support_mono } = req.body;
    const supportData = await GeneralSettings.findById(req.params.id);
    if (!supportData) return queryErrorRelatedResponse(req, res, 404, "Data not found.");

    supportData.user_support_email = user_support_email;
    supportData.user_support_mono = user_support_mono;
    supportData.beautician_support_email = beautician_support_email;
    supportData.beautician_support_mono = beautician_support_mono;
    const result = await supportData.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getGeneralSettings,
  addGeneralSettings,
  updateGeneralSetting,
  updateUserTc,
  updateBeauticianTc,
  updateUserPP,
  updateBeauticianPP,
  updatSupportData,
};
