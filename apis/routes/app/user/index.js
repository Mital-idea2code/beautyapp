const router = require("express").Router();
const authRouter = require("./auth");
const settingsRouter = require("./settings");
const categoryRouter = require("./category");
const beauticianRouter = require("./beautician");

// Use router in index
router.use("/app/user/auth", authRouter);
router.use("/app/user/settings", settingsRouter);
router.use("/app/user/category", categoryRouter);
router.use("/app/user/beautician", beauticianRouter);

module.exports = router;
