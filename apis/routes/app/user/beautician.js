const express = require("express");
const router = express.Router();
const { getHomeBeauticians, getBeauticiansByid } = require("../../../controllers/App/user/beauticianController");
const verifyUserAppToken = require("../../../helper/verifyUserAppToken");

router.get("/getHomeBeauticians", verifyUserAppToken, getHomeBeauticians);
router.get("/getBeauticiansByid/:id", verifyUserAppToken, getBeauticiansByid);

module.exports = router;
