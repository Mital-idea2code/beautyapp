const mongoose = require("mongoose");

const ServiceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Image is required."],
    },
    cat_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    price: {
      type: String,
      required: [true, "Image is required."],
    },
    about: {
      type: Text,
      required: [true, "Image is required."],
    },
    display_image: {
      type: String,
      required: [true, "Image is required."],
    },
    work_image: {
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
