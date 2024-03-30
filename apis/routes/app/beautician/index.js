const router = require("express").Router();
const authRouter = require("./auth.js");
const serviceRouter = require("./service.js");
const appointmentRouter = require("./appointment");
const settingRouter = require("./settings.js");

// Use router in index
router.use("/app/beautician/auth", authRouter);
router.use("/app/beautician/service", serviceRouter);
router.use("/app/beautician/appointment", appointmentRouter);
router.use("/app/beautician/settings", settingRouter);

module.exports = router;
