const express = require("express");
const router = express.Router();
const verifyUserAppToken = require("../../../helper/verifyUserAppToken");
const {
  bookAppointment,
  addReview,
  filterReviews,
  getUpcomingApp,
  getCompletedApp,
  getCancelledApp,
  getPendingApp,
} = require("../../../controllers/App/user/appointmentController");

router.post("/bookAppointment", verifyUserAppToken, bookAppointment);
router.post("/addReview", verifyUserAppToken, addReview);
router.post("/filterReviews", verifyUserAppToken, filterReviews);
router.get("/getUpcomingApp", verifyUserAppToken, getUpcomingApp);
router.get("/getCompletedApp", verifyUserAppToken, getCompletedApp);
router.get("/getCancelledApp", verifyUserAppToken, getCancelledApp);
router.get("/getPendingApp", verifyUserAppToken, getPendingApp);

module.exports = router;
