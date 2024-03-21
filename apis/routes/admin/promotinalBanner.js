const express = require("express");
const router = express.Router();
const {
  addPromotionalBanner,
  updatePromotionalBanner,
  updateProBannerStatus,
  deletePromotionalBanner,
  deleteMultPromotionalBanner,
  getAllPromotionalBanner,
} = require("../../controllers/Admin/promotinalBannerController");
const authenticAdmin = require("../../helper/verifyAdminToken");
const { singleFileUpload } = require("../../helper/imageUpload");

router.post(
  "/addPromotionalBanner",
  authenticAdmin,
  singleFileUpload("public/images/banner", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addPromotionalBanner
);
router.put(
  "/updatePromotionalBanner/:id",
  authenticAdmin,
  singleFileUpload("public/images/banner", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updatePromotionalBanner
);
router.put("/updateProBannerStatus/:id", authenticAdmin, updateProBannerStatus);
router.delete("/deletePromotionalBanner/:id", authenticAdmin, deletePromotionalBanner);
router.delete("/deleteMultPromotionalBanner", authenticAdmin, deleteMultPromotionalBanner);
router.get("/getAllPromotionalBanner", authenticAdmin, getAllPromotionalBanner);

module.exports = router;
