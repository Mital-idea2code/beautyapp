const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const AdminSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: [true, "Email Id already exist"],
    required: [true, "Email Id is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profile: {
    type: String,
  },
  role: {
    type: String,
    default: 1,
  },
  otp: {
    type: String,
    default: null,
  },
  expireOtpTime: {
    type: Date,
    default: null,
  },
  resetCode: {
    type: String,
  },
  remember_token: {
    type: String,
  },
  image: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

//Bcrypt password before save
AdminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hashSync(admin.password, 12);
  }
  next();
});

AdminSchema.methods.generateAuthToken = function (data) {
  const admin = this;
  const id = { _id: admin.id };

  // Here add all the user info data send on login time (Data may be full data of user or it may be
  // store as given info)
  data = { ...data, ...id, password: admin.password };
  const token = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

AdminSchema.methods.generateRefreshToken = function (data) {
  const admin = this;
  const id = { _id: admin.id };

  // Here add all the user info data send on login time (Data may be full data of user or it may be
  // store as given info)
  data = { ...data, ...id, password: admin.password };
  const token = jwt.sign(data, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

module.exports = mongoose.model("Admin", AdminSchema);
