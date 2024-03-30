const express = require("express");
const router = express.Router();
const {
  getGeneralSettings,
  getBanners,
  updateNotitatus,
  changePassword,
  getFaqs,
  getSupportData,
} = require("../../../controllers/App/user/settingController");
const verifyUserAppToken = require("../../../helper/verifyUserAppToken");

router.get("/getGeneralSettings", getGeneralSettings);
router.get("/getSupportData", getSupportData);
router.get("/getBanners", verifyUserAppToken, getBanners);
router.post("/updateNotitatus", verifyUserAppToken, updateNotitatus);
router.post("/changePassword", verifyUserAppToken, changePassword);
router.get("/getFaqs", getFaqs);

module.exports = router;
