const express = require("express");
const router = express.Router();
const {
  addpromotionBanner,
  updatepromotionBanner,
  updateProBannerStatus,
  deletepromotionBanner,
  deleteMultpromotionBanner,
  getAllpromotionBanner,
} = require("../../controllers/Admin/promotionBannerController");
const authenticAdmin = require("../../helper/verifyAdminToken");
const { singleFileUpload } = require("../../helper/imageUpload");

router.post(
  "/addpromotionBanner",
  authenticAdmin,
  singleFileUpload("public/images/banner", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addpromotionBanner
);
router.put(
  "/updatepromotionBanner/:id",
  authenticAdmin,
  singleFileUpload("public/images/banner", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updatepromotionBanner
);
router.put("/updateProBannerStatus/:id", authenticAdmin, updateProBannerStatus);
router.delete("/deletepromotionBanner/:id", authenticAdmin, deletepromotionBanner);
router.delete("/deleteMultpromotionBanner", authenticAdmin, deleteMultpromotionBanner);
router.get("/getAllpromotionBanner", authenticAdmin, getAllpromotionBanner);

module.exports = router;
