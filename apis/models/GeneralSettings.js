const mongoose = require("mongoose");

const GeneralSettings = mongoose.Schema({
  email: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
});

module.exports = GeneralSettings;
