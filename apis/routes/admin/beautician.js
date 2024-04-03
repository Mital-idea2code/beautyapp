const express = require("express");
const router = express.Router();
const {
  addBeautician,
  updateBeautician,
  updateBeauticianStatus,
  deleteBeautician,
  deleteMultBeautician,
  getAllBeautician,
  getAllReviews,
  deleteReview,
} = require("../../controllers/Admin/beauticianController");
const authenticAdmin = require("../../helper/verifyAdminToken");
const { multiDiffFileUpload } = require("../../helper/imageUpload");

router.post(
  "/addBeautician",
  authenticAdmin,
  multiDiffFileUpload("public/images/beautician", [
    { name: "banner", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "image", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
  ]),
  addBeautician
);

router.put(
  "/updateBeautician/:id",
  authenticAdmin,
  multiDiffFileUpload("public/images/beautician", [
    { name: "banner", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "image", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
  ]),
  updateBeautician
);

router.put("/updateBeauticianStatus/:id", authenticAdmin, updateBeauticianStatus);
router.delete("/deleteBeautician/:id", authenticAdmin, deleteBeautician);
router.delete("/deleteMultBeautician", authenticAdmin, deleteMultBeautician);
router.get("/getAllBeautician", authenticAdmin, getAllBeautician);
router.get("/getAllReviews/:id", authenticAdmin, getAllReviews);
router.delete("/deleteReview/:id", authenticAdmin, deleteReview);

module.exports = router;
