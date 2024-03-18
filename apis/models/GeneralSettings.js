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
});

module.exports = mongoose.model("generalSettings", GeneralSettingsSchema);
