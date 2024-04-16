const express = require("express");
const router = express.Router();
const verifyToken = require("../../../helper/verifyUserAppToken");
const { singleFileUpload } = require("../../../helper/imageUpload");
const {
  signupUser,
  signinUser,
  socialLogin,
  RefreshToken,
  checkEmailId,
  checkOtp,
  resetPassword,
  updateProfile,
  changePassword,
  getUserProfile,
} = require("../../../controllers/App/user/authController");

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.post("/socialLogin", socialLogin);
router.post("/refreshToken", RefreshToken);
router.post("/checkEmailId", checkEmailId);
router.post("/checkOtp", checkOtp);
router.post("/resetPassword", resetPassword);
router.post(
  "/updateProfile",
  verifyToken,
  singleFileUpload("public/images/profile", ["image/png", "image/jpeg", "image/jpg"], 1024 * 1024, "image"),
  updateProfile
);
router.get("/getUserProfile", verifyToken, getUserProfile);

module.exports = router;
