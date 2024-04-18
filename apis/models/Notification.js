const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema(
  {
    user_id: {
      type: String,
      required: [true, "User Id is required."],
    },
    title: {
      type: String,
      required: [true, "Title is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    role: {
      type: String,
      default: 1, // 1- USER, 2- BEAUTICIAN
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("notification", NotificationSchema);
