const mongoose = require("mongoose");

const FavouriteSchema = mongoose.Schema(
  {
    beautican_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "beautician",
      required: [true, "Beautician ID is required."],
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User ID is required."],
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
      required: [true, "Service ID is required."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("favourite", FavouriteSchema);
