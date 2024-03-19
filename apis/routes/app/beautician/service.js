const express = require("express");
const router = express.Router();
const verifyToken = require("../../../helper/verifyUserBeautyToken");
const { multiDiffFileUpload } = require("../../../helper/imageUpload");
const { addService } = require("../../../controllers/App/beautician/serviceController");

router.post(
  "/addService",
  verifyToken,
  multiDiffFileUpload("public/images/service", [
    { name: "display_image", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "work_images", maxCount: 100, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
  ]),
  addService
);
module.exports = router;
