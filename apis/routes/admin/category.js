const express = require("express");
const router = express.Router();
const {
  addCategory,
  updateCategory,
  updateCattatus,
  deleteCategory,
  deleteMultCategory,
  getAllCategory,
  getCategoryServices,
} = require("../../controllers/Admin/categoryController");
const authenticAdmin = require("../../helper/verifyAdminToken");
const { singleFileUpload } = require("../../helper/imageUpload");

router.post(
  "/addCategory",
  authenticAdmin,
  singleFileUpload("public/images/category", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addCategory
);
router.put(
  "/updateCategory/:id",
  authenticAdmin,
  singleFileUpload("public/images/category", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateCategory
);
router.put("/updateCattatus/:id", authenticAdmin, updateCattatus);
router.delete("/deleteCategory/:id", authenticAdmin, deleteCategory);
router.delete("/deleteMultCategory", authenticAdmin, deleteMultCategory);
router.get("/getAllCategory", authenticAdmin, getAllCategory);
router.get("/getCategoryServices/:id", authenticAdmin, getCategoryServices);

module.exports = router;
