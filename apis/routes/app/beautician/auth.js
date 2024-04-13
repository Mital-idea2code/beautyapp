const express = require("express");
const router = express.Router();
const verifyToken = require("../../../helper/verifyBeautyAppToken");
const { multiDiffFileUpload } = require("../../../helper/imageUpload");
const {
  signupBeautician,
  signinBeautician,
  socialLogin,
  RefreshToken,
  checkEmailId,
  checkOtp,
  resetPassword,
  updateProfile,
  getProfileData,
} = require("../../../controllers/App/beautician/authController");

router.post("/signup", signupBeautician);
router.post("/signin", signinBeautician);
router.post("/socialLogin", socialLogin);
router.post("/refreshToken", RefreshToken);
router.post("/checkEmailId", checkEmailId);
router.post("/checkOtp", checkOtp);
router.post("/resetPassword", resetPassword);
router.post(
  "/updateProfile",
  verifyToken,
  multiDiffFileUpload("public/images/beautician", [
    { name: "banner", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
    { name: "image", maxCount: 1, allowedMimes: ["image/png", "image/jpeg", "image/jpg"] },
  ]),
  updateProfile
);
router.get("/getProfileData", verifyToken, getProfileData);

module.exports = router;
