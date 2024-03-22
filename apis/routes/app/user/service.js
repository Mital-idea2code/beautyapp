const express = require("express");
const router = express.Router();
const { favService, favServiceList } = require("../../../controllers/App/user/serviceController");
const verifyUserAppToken = require("../../../helper/verifyUserAppToken");

router.post("/favService", verifyUserAppToken, favService);
router.get("/favServiceList", verifyUserAppToken, favServiceList);

module.exports = router;
