const express = require("express");
const router = express.Router();
const {
  getGeneralSettings,
  getBanners,
  updateNotitatus,
  changePassword,
  getFaqs,
  getSupportData,
  getAllNotifications,
} = require("../../../controllers/App/user/settingController");
const verifyUserAppToken = require("../../../helper/verifyUserAppToken");

router.get("/getGeneralSettings", getGeneralSettings);
router.get("/getSupportData", getSupportData);
router.get("/getBanners", verifyUserAppToken, getBanners);
router.post("/updateNotitatus", verifyUserAppToken, updateNotitatus);
router.post("/changePassword", verifyUserAppToken, changePassword);
router.get("/getAllNotifications", verifyUserAppToken, getAllNotifications);
router.get("/getFaqs", getFaqs);

module.exports = router;
