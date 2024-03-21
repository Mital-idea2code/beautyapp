const mongoose = require("mongoose");

const ServiceSchema = mongoose.Schema(
  {
    beautican_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "beautician",
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    cat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    price: {
      type: String,
      required: [true, "Price is required."],
    },
    about: {
      type: String,
      required: [true, "About is required."],
    },
    display_image: {
      type: String,
    },
    work_images: {
      type: Array,
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

module.exports = mongoose.model("services", ServiceSchema);
