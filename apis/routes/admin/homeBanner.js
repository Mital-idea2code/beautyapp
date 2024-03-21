const express = require("express");
const router = express.Router();
const {
  AddBanner,
  updateBanners,
  updateBannerStatus,
  getAllBanner,
} = require("../../controllers/Admin/homeBannerController");
const authenticAdmin = require("../../helper/verifyAdminToken");
const { singleFileUpload } = require("../../helper/imageUpload");

router.post(
  "/AddBanner",
  authenticAdmin,
  singleFileUpload("public/images/banner", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  AddBanner
);
router.put(
  "/updateBanners/:id",
  authenticAdmin,
  singleFileUpload("public/images/banner", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateBanners
);
router.put("/updateBannerStatus/:id", authenticAdmin, updateBannerStatus);
router.get("/getAllBanner", authenticAdmin, getAllBanner);

module.exports = router;
