const express = require("express");
const User = require("../../models/User");
const deleteFiles = require("../../helper/deleteFiles");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const mongoose = require("mongoose");

//Add User
const addUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) return queryErrorRelatedResponse(req, res, 401, { email: "Email Id already exist!" });

    const addedUser = req.body;
    if (req.file) {
      addedUser.image = req.file.filename;
    }
    const newUser = await new User(addedUser);

    const result = await newUser.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update User
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "User not found.");

    const updatedData = req.body;
    updatedData.image = user.image;
    if (req.file) {
      deleteFiles("profile/" + user.image);
      updatedData.image = req.file.filename;
    }

    const isUpdate = await User.findByIdAndUpdate(req.params.id, { $set: updatedData });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await User.findById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update User Status
const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "User not found.");

    user.status = !user.status;
    const result = await user.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Delete Single User
const deleteUser = async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const user = await User.findById(id);
    if (!user) return queryErrorRelatedResponse(req, res, 404, "User not found.");
    deleteFiles("profile/" + user.image);
    await User.deleteOne({ _id: id });
    deleteResponse(res, "User deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple User
const deleteMultUser = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      const user = await User.findById(item);
      if (!user) return queryErrorRelatedResponse(req, res, 404, "User not found.");
      deleteFiles("profile/" + user.image);

      await User.deleteOne({ _id: item });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Get All User
const getAllUser = async (req, res, next) => {
  try {
    const user = await User.find(
      {},
      "name email password address city mo_no image status noti_status createdAt updatedAt"
    );
    if (!user) return queryErrorRelatedResponse(req, res, 404, "User not found.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

    const AllData = {
      user: user,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  deleteMultUser,
  getAllUser,
};
