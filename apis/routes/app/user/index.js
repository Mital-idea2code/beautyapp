const router = require("express").Router();
const authRouter = require("./auth");

// Use router in index
router.use("/app/user/auth", authRouter);

module.exports = router;
