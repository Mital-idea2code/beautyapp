const router = require("express").Router();
const authRouter = require("./auth");
const settingsRouter = require("./settings");
const categoryRouter = require("./category");
// const beauticianRouter = require("./beautician");
const appointmentRouter = require("./appointment");
const serviceRouter = require("./service");

// Use router in index
router.use("/app/user/auth", authRouter);
router.use("/app/user/settings", settingsRouter);
router.use("/app/user/category", categoryRouter);
// router.use("/app/user/beautician", beauticianRouter);
router.use("/app/user/appointment", appointmentRouter);
router.use("/app/user/service", serviceRouter);

module.exports = router;
