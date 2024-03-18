const express = require("express");
const router = express.Router();
const { AddBanner, updateBanners } = require("../../controllers/Admin/homeBannerController");
const authenticAdmin = require("../../helper/verifyAdminToken");
const { multiDiffFileUpload } = require("../../helper/imageUpload");

router.post(
  "/AddBanner",
  authenticAdmin,
  multiDiffFileUpload("public/images/banner", [
    { name: "banner1", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "banner2", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "banner3", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
  ]),
  AddBanner
);

router.post(
  "/updateBanners",
  authenticAdmin,
  multiDiffFileUpload("public/images/banner", [
    { name: "banner1", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "banner2", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "banner3", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
  ]),
  updateBanners
);

module.exports = router;
