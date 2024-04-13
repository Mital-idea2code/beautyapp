const express = require("express");
const router = express.Router();
const {
  pendingAppList,
  completedAppList,
  cancelledAppList,
  upcomingAppList,
  acceptedAppList,
  AppInfo,
  beauticianAppList,
} = require("../../controllers/Admin/appointmentController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.get("/upcomingAppList", authenticAdmin, upcomingAppList);
router.get("/pendingAppList", authenticAdmin, pendingAppList);
router.get("/completedAppList", authenticAdmin, completedAppList);
router.get("/cancelledAppList", authenticAdmin, cancelledAppList);
router.get("/acceptedAppList", authenticAdmin, acceptedAppList);
router.get("/AppInfo/:id", authenticAdmin, AppInfo);
router.get("/beauticianAppList/:id", authenticAdmin, beauticianAppList);

module.exports = router;
