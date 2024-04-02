const express = require("express");
const Category = require("../../models/Category");
const Service = require("../../models/Service");
const Appointment = require("../../models/Appointment");
const deleteFiles = require("../../helper/deleteFiles");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../helper/sendResponse");
const mongoose = require("mongoose");

//Add Category
const addCategory = async (req, res, next) => {
  try {
    const addedCat = req.body;
    if (req.file) {
      addedCat.image = req.file.filename;
    }
    const newCat = await new Category(addedCat);

    const result = await newCat.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Category
const updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    const updatedData = req.body;
    updatedData.image = cat.image;
    if (req.file) {
      deleteFiles("category/" + cat.image);
      updatedData.image = req.file.filename;
    }

    const isUpdate = await Category.findByIdAndUpdate(req.params.id, { $set: updatedData });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await Category.findById(req.params.id);
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Update Category Status
const updateCattatus = async (req, res, next) => {
  try {
    // Convert string is into Object id
    const id = new mongoose.Types.ObjectId(req.params.id);
    const cat = await Category.findById(id);
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    cat.status = !cat.status;
    const result = await cat.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Delete Single Category
const deleteCategory = async (req, res, next) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const cat = await Category.findById(id);
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");
    deleteFiles("category/" + cat.image);
    await Category.deleteOne({ _id: id });
    await Service.deleteOne({ cat_id: id });
    await Appointment.deleteOne({ cat_id: id });

    deleteResponse(res, "Category deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Delete Multiple Category
const deleteMultCategory = async (req, res, next) => {
  try {
    const { Ids } = req.body;
    Ids.map(async (item) => {
      const cat = await Category.findById(item);
      if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");
      deleteFiles("category/" + cat.image);

      await Category.deleteOne({ _id: item });
      await Service.deleteOne({ cat_id: item });
      await Appointment.deleteOne({ cat_id: item });
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Get All Category
const getAllCategory = async (req, res, next) => {
  try {
    const cat = await Category.find();
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    const baseUrl =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_CATEGORY_PATH;

    const AllData = {
      cat: cat,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addCategory,
  updateCategory,
  updateCattatus,
  deleteCategory,
  deleteMultCategory,
  getAllCategory,
};
