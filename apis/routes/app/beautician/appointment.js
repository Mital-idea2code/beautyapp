const express = require("express");
const router = express.Router();
const verifyToken = require("../../../helper/verifyBeautyAppToken");
const { updateApptatus } = require("../../../controllers/App/beautician/appointmentController");

router.put("/updateApptatus/:id", verifyToken, updateApptatus);

module.exports = router;
