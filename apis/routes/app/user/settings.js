const express = require("express");
const router = express.Router();
const { getGeneralSettings, getBanners } = require("../../../controllers/App/user/settingController");
const verifyUserAppToken = require("../../../helper/verifyUserAppToken");

router.get("/getGeneralSettings", getGeneralSettings);
router.get("/getBanners", verifyUserAppToken, getBanners);

module.exports = router;
