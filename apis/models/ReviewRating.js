const mongoose = require("mongoose");

const ReviewRatingSchema = mongoose.Schema(
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
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      required: [true, "Appointment is required."],
    },
    review: {
      type: String,
      required: [true, "Review is required."],
    },
    rate: {
      type: Number,
      required: [true, "Rate is required."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("reviewRating", ReviewRatingSchema);
