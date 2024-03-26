const express = require("express");
const router = express.Router();
const {
  addfaqs,
  getAllFaqs,
  updateFaq,
  updateFaqStatus,
  deleteMultFaq,
  deletefaq,
} = require("../../controllers/Admin/faqsController");
const authenticAdmin = require("../../helper/verifyAdminToken");

router.post("/addfaqs", authenticAdmin, addfaqs);
router.get("/getAllFaqs", authenticAdmin, getAllFaqs);
router.put("/updateFaq/:id", authenticAdmin, updateFaq);
router.delete("/deletefaq/:id", authenticAdmin, deletefaq);
router.delete("/deleteMultFaq", authenticAdmin, deleteMultFaq);
router.put("/updateFaqStatus/:id", authenticAdmin, updateFaqStatus);

module.exports = router;
