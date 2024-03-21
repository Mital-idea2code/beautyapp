const router = require("express").Router();
const authRouter = require("./auth.js");
const serviceRouter = require("./service.js");
const appointmentRouter = require("./appointment");

// Use router in index
router.use("/app/beautician/auth", authRouter);
router.use("/app/beautician/service", serviceRouter);
router.use("/app/beautician/appointment", appointmentRouter);

module.exports = router;
