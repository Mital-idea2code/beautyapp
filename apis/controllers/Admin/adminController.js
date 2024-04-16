const express = require("express");
const Admin = require("../../models/Admin");
const bcrypt = require("bcrypt");
const { createResponse, queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const deleteFiles = require("../../helper/deleteFiles");
const GeneralSettings = require("../../models/GeneralSettings");
var nodemailer = require("nodemailer");
var fs = require("fs");
var handlebars = require("handlebars");
const { sendMail } = require("../../helper/emailSender");

//Admin Register
const RegisterAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role,
    });
    //save Admin and response
    createResponse(res, newAdmin);
  } catch (err) {
    next(err);
  }
};

//Admin Login
const LoginAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return queryErrorRelatedResponse(req, res, 401, { email: "Invalid Username!" });

    const validatePassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validatePassword) return queryErrorRelatedResponse(req, res, 401, { password: "Invalid Password!" });

    const token = admin.generateAuthToken({ email: req.body.email });
    admin.remember_token = token;

    const refresh_token = admin.generateRefreshToken({ email: req.body.email });

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const output = await admin.save();
    const tokens = {
      token: token,
      refresh_token: refresh_token,
      admin: admin,
      baseUrl: baseUrl,
    };
    successResponse(res, tokens);
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

    const admin = await Admin.findOne({ email: decoded.email });
    if (!admin) return queryErrorRelatedResponse(req, res, 401, { email: "Invalid Username!" });

    const token = admin.generateAuthToken({ email: decoded.email });
    successResponse(res, token);
  } catch (err) {
    next(err);
  }
};

//Check EmailID for Forgot Password
const CheckEmailId = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return queryErrorRelatedResponse(req, res, 401, { email: "Invalid Email Id!" });
    let resetCode = crypto.randomBytes(32).toString("hex");

    const otp = Math.floor(1000 + Math.random() * 9000);
    const expireOtpTime = Date.now() + 900000; //Valid upto 15 min
    admin.otp = otp;
    admin.resetCode = resetCode;
    admin.expireOtpTime = expireOtpTime;
    await admin.save();

    const emailData = await GeneralSettings.findOne();
    if (!emailData) return queryErrorRelatedResponse(req, res, 404, "Data not found.");

    sendMail({
      AuthEmail: emailData.email,
      AuthPass: emailData.password,
      from: emailData.email,
      to: req.body.email,
      sub: "Glam Spot - Forgot Password",
      htmlFile: "./emailTemplate/forgotPass.html",
      extraData: {
        OTP: otp,
        reset_link:
          req.protocol + "://" + req.get("host") + `/glamspot/backend/reset-password/${resetCode}/${admin._id}`,
        logo_url: process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_LOGO_PATH + "white-logo.svg",
      },
    });

    successResponse(res, "Check your mail. We have sent a password recover instructions to your email.");
  } catch (err) {
    next(err);
  }
};

// Reset Password
const ResetPassword = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ _id: req.body.id, resetCode: req.body.resetCode });
    if (!admin) return queryErrorRelatedResponse(req, res, 401, "Invalid Request!");

    if (new Date(admin.expireOtpTime).toTimeString() <= new Date(Date.now()).toTimeString()) {
      return queryErrorRelatedResponse(req, res, 401, "Reset Password link is expired!");
    }

    const checkotp = await Admin.findOne({ otp: req.body.otp, _id: req.body.id });
    if (!checkotp) return queryErrorRelatedResponse(req, res, 401, { otp: "Invalid OTP!" });

    if (req.body.new_password !== req.body.confirm_password) {
      return queryErrorRelatedResponse(req, res, 401, { confirm_password: "Confirm Password does not match!" });
    }

    admin.otp = null;
    admin.expireOtpTime = null;
    admin.resetCode = null;
    admin.password = req.body.new_password;
    await admin.save();

    successResponse(res, "Your password has been changed.");
  } catch (err) {
    next(err);
  }
};

//Get Admin Details for admin Profile
const adminDetails = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return queryErrorRelatedResponse(res, 202, "admin not found.");
    successResponse(res, admin);
  } catch (err) {
    next(err);
  }
};

//Update Admin Profile
const UpdateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return queryErrorRelatedResponse(res, 202, "admin not found.");

    if (req.file) {
      deleteFiles(admin.image);
      admin.image = req.file.filename;
    }

    admin.name = name;
    const result = await admin.save();

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const latestRes = {
      admin: result,
      baseUrl: baseUrl,
    };

    successResponse(res, latestRes);
  } catch (err) {
    next(err);
  }
};

//Admin Change Password
const ChangePassword = async (req, res, next) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;

    const admin = await Admin.findById(req.admin._id);
    if (!admin) return queryErrorRelatedResponse(req, res, 404, "Admin not found.");

    const valid_pass = await bcrypt.compare(old_password, admin.password);
    if (!valid_pass) return queryErrorRelatedResponse(req, res, 401, { old_password: "Invalid Old Password" });

    if (new_password != confirm_password) {
      return queryErrorRelatedResponse(req, res, 401, { confirm_password: "Confirm Password does not match!" });
    }

    admin.password = new_password;
    await admin.save();
    successResponse(res, "Password changed successfully!");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  RegisterAdmin,
  LoginAdmin,
  RefreshToken,
  CheckEmailId,
  ResetPassword,
  adminDetails,
  UpdateProfile,
  ChangePassword,
};
