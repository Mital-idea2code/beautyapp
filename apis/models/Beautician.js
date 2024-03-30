const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const BeauticianSchema = mongoose.Schema(
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
    lat: {
      type: String,
      default: "",
    },
    lng: {
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
    days: {
      type: Array,
      default: "",
    },
    open_time: {
      type: String,
    },
    close_time: {
      type: String,
    },
    duration: {
      type: String,
      default: "30",
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services",
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reviewRating",
      },
    ],
    totalReviews: {
      type: String,
      default: 0,
    },
    totalRatings: {
      type: String,
      default: 0,
    },
    averageRating: {
      type: String,
      default: 0,
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
    banner: {
      type: String,
    },
    fcm_token: {
      type: String,
      default: "",
    },
    noti_status: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: false,
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
BeauticianSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 12);
  }
  next();
});

BeauticianSchema.statics.generateAuthToken = function (email) {
  const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

BeauticianSchema.statics.generateRefreshToken = function (email) {
  const token = jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET);
  return token;
};

module.exports = mongoose.model("beautician", BeauticianSchema);
