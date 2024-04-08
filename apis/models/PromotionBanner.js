const mongoose = require("mongoose");

const PromotionBannerSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    beautican_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "beautician",
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("promotionBanner", PromotionBannerSchema);
