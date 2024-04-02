const express = require("express");
const router = express.Router();
const {
  getBeauticianServices,
  getAllService,
  updateServiceStatus,
} = require("../../controllers/Admin/serviceController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.put("/updateServiceStatus/:id", authenticAdmin, updateServiceStatus);
router.get("/getBeauticianServices/:id", authenticAdmin, getBeauticianServices);
router.get("/getAllService", authenticAdmin, getAllService);

module.exports = router;
