const express = require("express");
const Beautician = require("../../../models/Beautician");
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
const moment = require("moment");

//Beautician Signup
const signupBeautician = async (req, res, next) => {
  try {
    const beauti = await Beautician.findOne({ email: req.body.email });
    if (beauti) return queryErrorRelatedResponse(req, res, 401, "Email Id already exist!");

    if (req.body.password !== req.body.confirm_pass) {
      return queryErrorRelatedResponse(req, res, 401, "Confirm Password does not match!");
    }

    const accessToken = Beautician.generateAuthToken(req.body.email);

    const newBeautician = await new Beautician({
      email: req.body.email,
      password: req.body.password,
      fcm_token: req.body.fcm_token,
      remember_token: accessToken,
    });
    const addedBeautician = await newBeautician.save();

    const refresh_token = Beautician.generateRefreshToken(req.body.email);
    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;
    const beauticianWithBaseUrl = {
      _id: newBeautician._id,
      name: newBeautician.name,
      email: newBeautician.email,
      remember_token: newBeautician.remember_token,
      baseUrl: baseUrl,
      refresh_token: refresh_token,
    };

    //save Beautician and response
    createResponse(res, beauticianWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

//Beautician Signin
const signinBeautician = async (req, res, next) => {
  try {
    const beautician = await Beautician.findOne({ email: req.body.email });
    if (!beautician) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");

    const validatePassword = await bcrypt.compare(req.body.password, beautician.password);
    if (!validatePassword) return queryErrorRelatedResponse(req, res, 401, "Invalid Password!");

    if (beautician.status === false)
      return queryErrorRelatedResponse(req, res, 401, "Your account has been suspended!! Please contact to admin.");

    const accessToken = Beautician.generateAuthToken(beautician.email);
    const refresh_token = Beautician.generateRefreshToken(beautician.email);

    beautician.remember_token = accessToken;
    beautician.fcm_token = req.body.fcm_token;
    const output = await beautician.save();

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;
    // Assuming you have a `baseUrl` variable
    const beauticianWithBaseUrl = {
      _id: beautician._id,
      name: beautician.name,
      email: beautician.email,
      address: beautician.address,
      lat: beautician.lat,
      lng: beautician.lng,
      city: beautician.city,
      days: beautician.days,
      duration: beautician.duration,
      open_time: moment(parseInt(beautician.open_time)).format("hh:mm A"),
      close_time: moment(parseInt(beautician.close_time)).format("hh:mm A"),
      image: beautician.image,
      banner: beautician.banner,
      averageRating: beautician.averageRating,
      totalReviews: beautician.totalReviews,
      totalRatings: beautician.totalRatings,
      noti_status: beautician.noti_status,
      serviceFlag: beautician.services.length > 0 ? 1 : 0,
      baseUrl: baseUrl,
      remember_token: beautician.remember_token,
      refresh_token: refresh_token,
    };

    successResponse(res, beauticianWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

//Social Login

const socialLogin = async (req, res, next) => {
  try {
    const accessToken = Beautician.generateAuthToken(req.body.email);
    const refresh_token = Beautician.generateRefreshToken(req.body.email);
    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const beautician = await Beautician.findOne({ email: req.body.email });

    if (!beautician) {
      const newBeautician = await new Beautician({
        name: req.body.name,
        email: req.body.email,
        fcm_token: req.body.fcm_token,
        remember_token: accessToken,
      });
      const addedBeautician = await newBeautician.save();

      const beauticianWithBaseUrl = {
        _id: newBeautician._id,
        name: newBeautician.name,
        email: newBeautician.email,
        address: newBeautician.address,
        lat: newBeautician.lat,
        lng: newBeautician.lng,
        city: newBeautician.city,
        days: newBeautician.days,
        duration: newBeautician.duration,
        open_time: moment(parseInt(newBeautician.open_time)).format("hh:mm A"),
        close_time: moment(parseInt(newBeautician.close_time)).format("hh:mm A"),
        image: newBeautician.image,
        banner: newBeautician.banner,
        averageRating: newBeautician.averageRating,
        totalReviews: newBeautician.totalReviews,
        totalRatings: newBeautician.totalRatings,
        noti_status: newBeautician.noti_status,
        serviceFlag: newBeautician.services.length > 0 ? 1 : 0,
        baseUrl: baseUrl,
        remember_token: newBeautician.remember_token,
        refresh_token: refresh_token,
        loginStatus: 0,
      };
      createResponse(res, beauticianWithBaseUrl);
    } else {
      beautician.remember_token = accessToken;
      beautician.fcm_token = req.body.fcm_token;

      await beautician.save();

      const beauticianWithBaseUrl = {
        _id: beautician._id,
        name: beautician.name,
        email: beautician.email,
        address: beautician.address,
        lat: beautician.lat,
        lng: beautician.lng,
        city: beautician.city,
        days: beautician.days,
        duration: beautician.duration,
        open_time: moment(parseInt(beautician.open_time)).format("hh:mm A"),
        close_time: moment(parseInt(beautician.close_time)).format("hh:mm A"),
        image: beautician.image,
        banner: beautician.banner,
        averageRating: beautician.averageRating,
        totalReviews: beautician.totalReviews,
        totalRatings: beautician.totalRatings,
        noti_status: beautician.noti_status,
        serviceFlag: beautician.services.length > 0 ? 1 : 0,
        baseUrl: baseUrl,
        remember_token: beautician.remember_token,
        refresh_token: refresh_token,
        loginStatus: 1,
      };
      createResponse(res, beauticianWithBaseUrl);
    }
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

    const beautician = await Beautician.findOne({ email: decoded.email });
    if (!beautician) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");

    const token = Beautician.generateAuthToken(decoded.email);

    successResponse(res, token);
  } catch (err) {
    next(err);
  }
};

//Forgot Password - Check Email Id
const checkEmailId = async (req, res, next) => {
  try {
    const beautician = await Beautician.findOne({ email: req.body.email });
    if (!beautician) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");

    var otp = Math.floor(1000 + Math.random() * 9000);
    beautician.otp = otp;
    beautician.expireOtpTime = Date.now() + 300000; //Valid upto 5 min
    await beautician.save();

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

    successResponse(res, beautician);
  } catch (err) {
    next(err);
  }
};

//Forgot Password - Check OTP
const checkOtp = async (req, res, next) => {
  try {
    const beautician = await Beautician.findOne({ otp: req.body.otp, email: req.body.email });
    if (!beautician) return queryErrorRelatedResponse(req, res, 401, "Invalid OTP!");

    if (new Date(beautician.expireOtpTime).toTimeString() <= new Date(Date.now()).toTimeString()) {
      return queryErrorRelatedResponse(req, res, 401, "OTP is Expired!");
    }

    successResponse(res, beautician);
  } catch (err) {
    next(err);
  }
};

//Forgot Password - Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const beautician = await Beautician.findOne({ email: req.body.email });
    if (!beautician) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");

    if (req.body.new_pass !== req.body.confirm_pass) {
      return queryErrorRelatedResponse(req, res, 401, "Confirm Password does not match!");
    }

    beautician.otp = null;
    beautician.password = req.body.new_pass;
    await beautician.save();

    successResponse(res, "Your password has been change.");
  } catch (err) {
    next(err);
  }
};

//Beautician Profile Photo Update
const updateProfile = async (req, res, next) => {
  try {
    //Check Beautician exist or not
    const beautician = await Beautician.findById(req.beautician._id);
    if (!beautician) return queryErrorRelatedResponse(req, res, 401, "Invalid Beautician!!");

    req.body.open_time = moment(req.body.open_time, "h:mm A").valueOf(); //HH:mm
    req.body.close_time = moment(req.body.close_time, "h:mm A").valueOf();

    //If file already exist then it delete first
    if (req.files.image) {
      deleteFiles("beautician/" + beautician.image);
      req.body.image = req.files.image[0].filename;
    }

    //If file already exist then it delete first
    if (req.files.banner) {
      deleteFiles("beautician/" + beautician.banner);
      req.body.banner = req.files.banner[0].filename;
    }

    const isUpdate = await Beautician.findByIdAndUpdate(req.beautician._id, { $set: req.body });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");
    const updatedBeautician = await Beautician.findById(req.beautician._id);

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const beauticianWithBaseUrl = {
      ...updatedBeautician.toObject(),
      baseUrl: baseUrl,
    };

    successResponse(res, beauticianWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

//Get Beautician Profile Data
const getProfileData = async (req, res, next) => {
  try {
    //Check Beautician exist or not
    const beautician = await Beautician.findById(req.beautician._id);
    if (!beautician) return queryErrorRelatedResponse(req, res, 401, "Invalid Beautician!!");

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;
    // Assuming you have a `baseUrl` variable
    const beauticianWithBaseUrl = {
      _id: beautician._id,
      name: beautician.name,
      email: beautician.email,
      address: beautician.address,
      lat: beautician.lat,
      lng: beautician.lng,
      city: beautician.city,
      days: beautician.days,
      duration: beautician.duration,
      open_time: moment(parseInt(beautician.open_time)).format("hh:mm A"),
      close_time: moment(parseInt(beautician.close_time)).format("hh:mm A"),
      image: beautician.image,
      banner: beautician.banner,
      averageRating: beautician.averageRating,
      totalReviews: beautician.totalReviews,
      totalRatings: beautician.totalRatings,
      noti_status: beautician.noti_status,
      serviceFlag: beautician.services.length > 0 ? 1 : 0,
      baseUrl: baseUrl,
      remember_token: beautician.remember_token,
    };

    successResponse(res, beauticianWithBaseUrl);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signupBeautician,
  signinBeautician,
  socialLogin,
  RefreshToken,
  checkEmailId,
  checkOtp,
  resetPassword,
  updateProfile,
  getProfileData,
};
