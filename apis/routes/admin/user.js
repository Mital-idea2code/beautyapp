const express = require("express");
const router = express.Router();
const {
  addUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  deleteMultUser,
  getAllUser,
} = require("../../controllers/Admin/userController");
const authenticAdmin = require("../../helper/verifyAdminToken");
const { singleFileUpload } = require("../../helper/imageUpload");

router.post(
  "/addUser",
  authenticAdmin,
  singleFileUpload("public/images/profile", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  addUser
);
router.put(
  "/updateUser/:id",
  authenticAdmin,
  singleFileUpload("public/images/profile", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateUser
);
router.put("/updateUserStatus/:id", authenticAdmin, updateUserStatus);
router.delete("/deleteUser/:id", authenticAdmin, deleteUser);
router.delete("/deleteMultUser", authenticAdmin, deleteMultUser);
router.get("/getAllUser", authenticAdmin, getAllUser);

module.exports = router;
