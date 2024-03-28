const express = require("express");
const Beautician = require("../../models/Beautician");
const deleteFiles = require("../../helper/deleteFiles");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const mongoose = require("mongoose");
const moment = require("moment");

//Add Beautician
const addBeautician = async (req, res, next) => {
  try {
    const beautician = await Beautician.findOne({ email: req.body.email });
    if (beautician) return queryErrorRelatedResponse(req, res, 401, { email: "Email Id already exist!" });

    const addedBeautician = req.body;

    req.body.open_time = moment(req.body.open_time, "h:mm A").valueOf(); //HH:mm
    req.body.close_time = moment(req.body.close_time, "h:mm A").valueOf();

    //If file already exist then it delete first
    if (req.files.image) {
      req.body.image = req.files.image[0].filename;
    }

    //If file already exist then it delete first
    if (req.files.banner) {
      req.body.banner = req.files.banner[0].filename;
    }

    const newBeautician = await new Beautician(addedBeautician);

    const result = await newBeautician.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Beautician
const updateBeautician = async (req, res, next) => {
  try {
    const beautician = await Beautician.findById(req.params.id);
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    const updatedData = req.body;
    updatedData.image = beautician.image;
    updatedData.banner = beautician.banner;
    //If file already exist then it delete first
    if (req.files.image) {
      deleteFiles("beautician/" + beautician.image);
      updatedData.image = req.files.image[0].filename;
    }

    //If file already exist then it delete first
    if (req.files.banner) {
      deleteFiles("beautician/" + beautician.banner);
      updatedData.banner = req.files.banner[0].filename;
    }

    const isUpdate = await Beautician.findByIdAndUpdate(req.params.id, { $set: updatedData });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await Beautician.findById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Beautician Status
const updateBeauticianStatus = async (req, res, next) => {
  try {
    const beautician = await Beautician.findById(req.params.id);
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    beautician.status = !beautician.status;
    const result = await beautician.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Delete Single Beautician
const deleteBeautician = async (req, res, next) => {
  try {
    const beautician = await Beautician.findById(req.params.id);
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "User not found.");
    deleteFiles("beautician/" + beautician.image);
    deleteFiles("beautician/" + beautician.banner);
    await Beautician.deleteOne({ _id: id });
    deleteResponse(res, "Beautician deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple Beautician
const deleteMultBeautician = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      const beautician = await Beautician.findById(item);
      if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");
      deleteFiles("beautician/" + beautician.image);
      deleteFiles("beautician/" + beautician.banner);

      await Beautician.deleteOne({ _id: item });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Get All Beautician
const getAllBeautician = async (req, res, next) => {
  try {
    const beautician = await Beautician.find();
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BEAUTICIAN_PATH;

    const AllData = {
      beautician: beautician,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addBeautician,
  updateBeautician,
  updateBeauticianStatus,
  deleteBeautician,
  deleteMultBeautician,
  getAllBeautician,
};
