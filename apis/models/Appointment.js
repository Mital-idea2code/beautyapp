const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema(
  {
    beautican_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "beautician",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    cat_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    // calData: [
    //     {
    //       unit: String,
    //       cal: Number,
    //       qty: Number,
    //       protein: Number,
    //       fat: Number,
    //       carb: Number,
    //       fiber: Number,
    //     },
    //   ],
    service_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services",
      },
    ],
    date: {
      type: String,
      required: [true, "Date is required."],
    },
    time: {
      type: String,
      required: [true, "Time is required."],
    },
    amount: {
      type: String,
      required: [true, "Amount is required."],
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

module.exports = mongoose.model("appointment", AppointmentSchema);
