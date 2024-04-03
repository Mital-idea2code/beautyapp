const express = require("express");
const router = express.Router();
const verifyToken = require("../../../helper/verifyBeautyAppToken");
const {
  updateApptatus,
  getHomeCount,
  datewiseAppList,
  pendingAppList,
  completedAppList,
  cancelledAppList,
  upcomingAppList,
  filterReviews,
} = require("../../../controllers/App/beautician/appointmentController");

router.put("/updateApptatus/:id", verifyToken, updateApptatus);
router.get("/getHomeCount", verifyToken, getHomeCount);
router.post("/upcomingAppList", verifyToken, upcomingAppList);
router.post("/pendingAppList", verifyToken, pendingAppList);
router.post("/completedAppList", verifyToken, completedAppList);
router.post("/cancelledAppList", verifyToken, cancelledAppList);
router.post("/datewiseAppList", verifyToken, datewiseAppList);
router.get("/filterReviews/:id", verifyToken, filterReviews);

module.exports = router;
