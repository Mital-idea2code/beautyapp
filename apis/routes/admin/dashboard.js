const express = require("express");
const router = express.Router();
const {
  getDashboardCount,
  getTopBeauticianData,
  getTopUserData,
  topUpcomingAppList,
} = require("../../controllers/Admin/dashboardController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.get("/getDashboardCount", authenticAdmin, getDashboardCount);
router.get("/getTopBeauticianData", authenticAdmin, getTopBeauticianData);
router.get("/getTopUserData", authenticAdmin, getTopUserData);
router.get("/topUpcomingAppList", authenticAdmin, topUpcomingAppList);

module.exports = router;
