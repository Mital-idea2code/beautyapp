const express = require("express");
const router = express.Router();
const {
  getGeneralSettings,
  addGeneralSettings,
  updateGeneralSetting,
  updateUserTc,
  updateBeauticianTc,
  updateUserPP,
  updateBeauticianPP,
  updatSupportData,
} = require("../../controllers/Admin/generalSettingsController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.put("/updateGeneralSetting/:id", authenticAdmin, updateGeneralSetting);
router.get("/getGeneralSettings", authenticAdmin, getGeneralSettings);
router.post("/addGeneralSettings", authenticAdmin, addGeneralSettings);
router.put("/updateUserTc/:id", authenticAdmin, updateUserTc);
router.put("/updateBeauticianTc/:id", authenticAdmin, updateBeauticianTc);
router.put("/updateUserPP/:id", authenticAdmin, updateUserPP);
router.put("/updateBeauticianPP/:id", authenticAdmin, updateBeauticianPP);
router.put("/updatSupportData/:id", authenticAdmin, updatSupportData);

module.exports = router;
