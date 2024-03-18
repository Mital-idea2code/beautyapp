const mongoose = require("mongoose");

const HomeBannerSchema = mongoose.Schema({
  banner1: {
    type: String,
    required: [true, "Banner is required."],
    default: "",
  },
  banner2: {
    type: String,
    required: [true, "Banner is required."],
    default: "",
  },
  banner3: {
    type: String,
    required: [true, "Banner is required."],
    default: "",
  },
});

module.exports = mongoose.model("homebanner", HomeBannerSchema);
