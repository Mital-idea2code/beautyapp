const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema(
  {
    appointment_id: {
      type: String,
      required: [true, "Apponitment ID is required."],
    },
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
    cat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: [true, "Category ID is required."],
    },
    service_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "services",
      required: [true, "Service ID is required."],
    },
    app_date: {
      type: Date,
      required: [true, "Date is required."],
    },
    app_time: {
      type: String,
      required: [true, "Time is required."],
    },
    amount: {
      type: String,
      required: [true, "Amount is required."],
    },
    status: {
      type: Number,
      default: 0, //0-Pending,1-Completed,2-Cancelled,3-Accepted
    },
    cancel_reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appointment", AppointmentSchema);
