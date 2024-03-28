const router = require("express").Router();
const adminRouter = require("../admin/admin");
const genealSettingsRouter = require("../admin/generalSettings");
const homeBannerRouter = require("../admin/homeBanner");
const categoryRouter = require("../admin/category");
const proBannerRouter = require("../admin/promotionBanner");
const faqsRouter = require("../admin/faqs");
const userRouter = require("../admin/user");
const beauticianRouter = require("../admin/beautician");

// Use router in index
router.use("/admin", adminRouter);
router.use("/admin/generalSettings", genealSettingsRouter);
router.use("/admin/homeBanner", homeBannerRouter);
router.use("/admin/category", categoryRouter);
router.use("/admin/proBanner", proBannerRouter);
router.use("/admin/faqs", faqsRouter);
router.use("/admin/user", userRouter);
router.use("/admin/beautician", beauticianRouter);

module.exports = router;
