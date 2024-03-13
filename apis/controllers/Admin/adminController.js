const express = require("express");
const Admin = require("../../models/Admin");
const bcrypt = require("bcrypt");
const { createResponse, queryErrorRelatedResponse, successResponse } = require("../../helper/sendResponse");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
    if (!admin) return queryErrorRelatedResponse(req, res, 401, "Invalid Username!");

    const validatePassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validatePassword) return queryErrorRelatedResponse(req, res, 401, "Invalid Password!");

    const token = admin.generateAuthToken({ email: req.body.email });
    admin.remember_token = token;

    const refresh_token = admin.generateRefreshToken({ email: req.body.email });

    const output = await admin.save();
    const tokens = {
      token: token,
      refresh_token: refresh_token,
      admin: admin,
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
    if (!admin) return queryErrorRelatedResponse(req, res, 401, "Invalid Username!");

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
    if (!admin) return queryErrorRelatedResponse(req, res, 401, "Invalid Email Id!");
    let resetCode = crypto.randomBytes(32).toString("hex");

    const otp = Math.floor(1000 + Math.random() * 9000);
    const expireOtpTime = Date.now() + 900000; //Valid upto 15 min
    admin.otp = otp;
    admin.resetCode = resetCode;
    admin.expireOtpTime = expireOtpTime;
    await admin.save();

    sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      sub: "Fitness - Forgot Password",
      htmlFile: "./emailTemplate/forgotPass.html",
      extraData: {
        OTP: otp,
        reset_link: process.env.BACKEND_URL + `/fitness-app/backend/reset-password/${resetCode}/${admin._id}`,
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
    if (!checkotp) return queryErrorRelatedResponse(req, res, 401, "Invalid OTP!");

    if (req.body.new_password !== req.body.confirm_password) {
      return queryErrorRelatedResponse(req, res, 401, "Confirm Password does not match!");
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

    successResponse(res, result);
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
    if (!valid_pass) return queryErrorRelatedResponse(req, res, 401, "Invalid Old Password");

    if (new_password != confirm_password) {
      return queryErrorRelatedResponse(req, res, 404, "Confirm password does not match.");
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
