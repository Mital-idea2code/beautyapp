const express = require("express");
const router = express.Router();
const { getAllCategory } = require("../../../controllers/App/user/categoryController");
const verifyUserAppToken = require("../../../helper/verifyUserAppToken");

router.get("/getAllCategory", verifyUserAppToken, getAllCategory);

module.exports = router;
