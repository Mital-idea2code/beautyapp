const router = require("express").Router();
const adminRouter = require("../admin/admin");

// Use router in index
router.use("/admin", adminRouter);

module.exports = router;
