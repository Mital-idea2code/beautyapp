const express = require("express");
const router = express.Router();
const {
  favService,
  favServiceList,
  getServicesByCatid,
  getServiceInfoByid,
  searchServices,
} = require("../../../controllers/App/user/serviceController");
const verifyUserAppToken = require("../../../helper/verifyUserAppToken");

router.post("/favService", verifyUserAppToken, favService);
router.get("/favServiceList", verifyUserAppToken, favServiceList);
router.get("/getServicesByCatid/:id", verifyUserAppToken, getServicesByCatid);
router.get("/getServiceInfoByid/:id", verifyUserAppToken, getServiceInfoByid);
router.get("/searchServices/:search", verifyUserAppToken, searchServices);

module.exports = router;
