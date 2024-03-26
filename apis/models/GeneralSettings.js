const mongoose = require("mongoose");

const GeneralSettingsSchema = mongoose.Schema({
  email: {
    type: String,
    default: "test@gmail.com",
  },
  password: {
    type: String,
    default: "test@123",
  },
  user_tc: {
    type: String,
    required: [true, "Description is required."],
    default: "User Terms & Conditions",
  },
  beautician_tc: {
    type: String,
    required: [true, "Description is required."],
    default: "Beautician Terms & Conditions",
  },
  user_pp: {
    type: String,
    required: [true, "Description is required."],
    default: "User Privacy Policy",
  },
  beautician_pp: {
    type: String,
    required: [true, "Description is required."],
    default: "Beautician Privacy Policy",
  },
  user_support_email: {
    type: String,
    default: "test@gmail.com",
  },
  user_support_mono: {
    type: String,
    default: "+91 99999 99999",
  },
  beautician_support_email: {
    type: String,
    default: "test@gmail.com",
  },
  beautician_support_mono: {
    type: String,
    default: "+91 99999 99999",
  },
});

module.exports = mongoose.model("generalSettings", GeneralSettingsSchema);
