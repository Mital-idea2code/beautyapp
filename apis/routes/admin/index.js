const router = require("express").Router();
const adminRouter = require("../admin/admin");
const genealSettingsRouter = require("../admin/generalSettings");
const homeBannerRouter = require("../admin/homeBanner");
const categoryRouter = require("../admin/category");
const proBannerRouter = require("../admin/promotinalBanner");
const faqsRouter = require("../admin/faqs");

// Use router in index
router.use("/admin", adminRouter);
router.use("/admin/generalSettings", genealSettingsRouter);
router.use("/admin/homeBanner", homeBannerRouter);
router.use("/admin/category", categoryRouter);
router.use("/admin/proBanner", proBannerRouter);
router.use("/admin/faqs", faqsRouter);

module.exports = router;
