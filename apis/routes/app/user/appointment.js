const express = require("express");
const router = express.Router();
const verifyUserAppToken = require("../../../helper/verifyUserAppToken");
const { bookAppointment, addReview } = require("../../../controllers/App/user/appointmentController");

router.post("/bookAppointment", verifyUserAppToken, bookAppointment);
router.post("/addReview", verifyUserAppToken, addReview);

module.exports = router;
