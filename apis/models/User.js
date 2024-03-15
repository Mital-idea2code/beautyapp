const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email Id is required."],
      unique: [true, "Email Id already exist."],
      trim: true,
    },
    password: {
      type: String,
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    mo_no: {
      type: String,
      default: "",
    },
    otp: {
      type: String,
      maxlength: [6, "OTP should be maximum six characters long."],
      default: "",
    },
    expireOtpTime: {
      type: Date,
      default: null,
    },
    remember_token: {
      type: String,
    },
    image: {
      type: String,
    },
    fcm_token: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
    created: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true, // Add this option to enable timestamps
  }
);

// Bcrypt password before save
UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

UserSchema.statics.generateAuthToken = function (email) {
  const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

UserSchema.statics.generateRefreshToken = function (email) {
  const token = jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

module.exports = mongoose.model("user", UserSchema);
