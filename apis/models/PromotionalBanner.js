const mongoose = require("mongoose");

const PromotinalBannerSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "Image is required."],
    },
    beautican_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "beautician",
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

module.exports = mongoose.model("promotionalBanner", PromotinalBannerSchema);
