const express = require("express");
const router = express.Router();
const verifyToken = require("../../../helper/verifyBeautyAppToken");
const { multiDiffFileUpload } = require("../../../helper/imageUpload");
const {
  addService,
  serviceList,
  updateServiceStatus,
  updateService,
  deleteWorkImage,
} = require("../../../controllers/App/beautician/serviceController");

router.post(
  "/addService",
  verifyToken,
  multiDiffFileUpload("public/images/service", [
    { name: "display_image", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "work_images", maxCount: 100, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
  ]),
  addService
);
router.get("/serviceList", verifyToken, serviceList);
router.put("/updateServiceStatus/:id", verifyToken, updateServiceStatus);

router.put(
  "/updateService/:id",
  verifyToken,
  multiDiffFileUpload("public/images/service", [
    { name: "display_image", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "work_images", maxCount: 100, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
  ]),
  updateService
);
router.put("/deleteWorkImage/:id", verifyToken, deleteWorkImage);

module.exports = router;
