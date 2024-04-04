const express = require("express");
const router = express.Router();
const {
  pendingAppList,
  completedAppList,
  cancelledAppList,
  upcomingAppList,
} = require("../../controllers/Admin/appointmentController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.post("/upcomingAppList", authenticAdmin, upcomingAppList);
router.get("/pendingAppList", authenticAdmin, pendingAppList);
router.get("/completedAppList", authenticAdmin, completedAppList);
router.get("/cancelledAppList", authenticAdmin, cancelledAppList);

module.exports = router;
