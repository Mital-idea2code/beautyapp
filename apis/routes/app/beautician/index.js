const router = require("express").Router();
const authRouter = require("./auth.js");
const serviceRouter = require("./service.js");

// Use router in index
router.use("/app/beautician/auth", authRouter);
router.use("/app/beautician/service", serviceRouter);

module.exports = router;
