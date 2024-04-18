const express = require("express");
const router = express.Router();
const {
  getGeneralSettings,
  updateNotitatus,
  changePassword,
  getFaqs,
  getSupportData,
  getAllCategory,
  likeMe,
  getAllNotifications,
} = require("../../../controllers/App/beautician/settingController");
const verifyToken = require("../../../helper/verifyBeautyAppToken");

router.get("/getGeneralSettings", getGeneralSettings);
router.get("/getSupportData", getSupportData);
router.post("/updateNotitatus", verifyToken, updateNotitatus);
router.post("/changePassword", verifyToken, changePassword);
router.get("/getFaqs", getFaqs);
router.get("/getAllCategory", getAllCategory);
router.get("/likeMe", verifyToken, likeMe);
router.get("/getAllNotifications", verifyToken, getAllNotifications);

module.exports = router;
