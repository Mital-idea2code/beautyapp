const express = require("express");
const User = require("../../../models/User");
const GeneralSettings = require("../../../models/GeneralSettings");
const { sendMail } = require("../../../helper/emailSender");
const {
  createResponse,
  queryErrorRelatedResponse,
  successResponse,
  successResponseOfFiles,
} = require("../../../helper/sendResponse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const deleteFiles = require("../../../helper/deleteFiles");

//User Signup
const signupUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) return queryErrorRelatedResponse(req, res, 401, "Email Id already exist!");

    if (req.body.password !== req.body.confirm_pass) {
      return queryErrorRelatedResponse(req, res, 401, "Confirm Password does not match!");
    }

    const accessToken = User.generateAuthToken(req.body.email);

    const newUser = await new User({
      email: req.body.email,
      password: req.body.password,
      fcm_token: req.body.fcm_token,
      remember_token: accessToken,
    });
    const addedUser = await newUser.save();

    const refresh_token = User.generateRefreshToken(req.body.email);
    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;
    const userWithBaseUrl = {
      ...newUser.toObject(),
      baseUrl: baseUrl,
      refresh_token: refresh_token,
    };

    //save User and response
    createResponse(res, userWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

//User Signin
const signinUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");

    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if (!validatePassword) return queryErrorRelatedResponse(req, res, 401, "Invalid Password!");

    if (user.status === false)
      return queryErrorRelatedResponse(req, res, 401, "Your account has been suspended!! Please contact to admin.");

    const accessToken = User.generateAuthToken(user.email);
    const refresh_token = User.generateRefreshToken(user.email);

    user.remember_token = accessToken;
    user.fcm_token = req.body.fcm_token;
    const output = await user.save();

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;
    // Assuming you have a `baseUrl` variable
    const userWithBaseUrl = {
      ...user.toObject(),
      baseUrl: baseUrl,
      refresh_token: refresh_token,
    };

    successResponse(res, userWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

//Social Login
const socialLogin = async (req, res, next) => {
  try {
    const accessToken = User.generateAuthToken(req.body.email);
    const refresh_token = User.generateRefreshToken(req.body.email);
    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const newUser = await new User({
        name: req.body.name,
        email: req.body.email,
        fcm_token: req.body.fcm_token,
        remember_token: accessToken,
      });
      const addedUser = await newUser.save();

      const userWithBaseUrl = {
        ...newUser.toObject(),
        baseUrl: baseUrl,
        refresh_token: refresh_token,
        loginStatus: 0,
      };
      createResponse(res, userWithBaseUrl);
    } else {
      if (user.status === false)
        return queryErrorRelatedResponse(req, res, 401, "Your account has been suspended!! Please contact to admin.");

      user.remember_token = accessToken;
      user.fcm_token = req.body.fcm_token;

      await user.save();

      const userWithBaseUrl = {
        ...user.toObject(),
        baseUrl: baseUrl,
        refresh_token: refresh_token,
        loginStatus: 1,
      };
      createResponse(res, userWithBaseUrl);
    }

    //save User and response
  } catch (err) {
    next(err);
  }
};

//Get RefreshToken
const RefreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(402).send("Access Denied. No refresh token provided.");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findOne({ email: decoded.email });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");

    const token = User.generateAuthToken(decoded.email);

    successResponse(res, token);
  } catch (err) {
    next(err);
  }
};

//Forgot Password - Check Email Id
const checkEmailId = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");

    var otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    user.expireOtpTime = Date.now() + 300000; //Valid upto 5 min
    await user.save();

    const emailData = await GeneralSettings.findOne();
    if (!emailData) return queryErrorRelatedResponse(req, res, 404, "Data not found.");

    sendMail({
      AuthEmail: emailData.email,
      AuthPass: emailData.password,
      from: emailData.email,
      to: req.body.email,
      sub: "Glam Spot - Forgot Password",
      htmlFile: "./emailTemplate/forgotPassApp.html",
      extraData: {
        OTP: otp,
      },
    });

    successResponse(res, user);
  } catch (err) {
    next(err);
  }
};

//Forgot Password - Check OTP
const checkOtp = async (req, res, next) => {
  try {
    const user = await User.findOne({ otp: req.body.otp, email: req.body.email });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid OTP!");

    if (new Date(user.expireOtpTime).toTimeString() <= new Date(Date.now()).toTimeString()) {
      return queryErrorRelatedResponse(req, res, 401, "OTP is Expired!");
    }

    successResponse(res, user);
  } catch (err) {
    next(err);
  }
};

//Forgot Password - Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");

    if (req.body.new_pass !== req.body.confirm_pass) {
      return queryErrorRelatedResponse(req, res, 401, "Confirm Password does not match!");
    }

    user.otp = null;
    user.password = req.body.new_pass;
    await user.save();

    successResponse(res, "Your password has been change.");
  } catch (err) {
    next(err);
  }
};

//User Profile Photo Update
const updateProfile = async (req, res, next) => {
  try {
    //Check user exist or not
    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User!!");

    //If file already exist then it delete first
    if (req.file) {
      const filed = deleteFiles("profile/" + user.image);
      req.body.image = req.file.filename;
    }

    const isUpdate = await User.findByIdAndUpdate(req.user._id, { $set: req.body });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");
    const updatedUser = await User.findById(req.user._id);

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const userWithBaseUrl = {
      ...updatedUser.toObject(),
      baseUrl: baseUrl,
    };

    successResponse(res, userWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

//Get User Profile
const getUserProfile = async (req, res, next) => {
  try {
    //Check user exist or not
    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User!!");

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const userWithBaseUrl = {
      user: user,
      baseUrl: baseUrl,
    };

    successResponse(res, userWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signupUser,
  signinUser,
  socialLogin,
  RefreshToken,
  checkEmailId,
  checkOtp,
  resetPassword,
  updateProfile,
  getUserProfile,
};
