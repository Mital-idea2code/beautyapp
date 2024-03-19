const express = require("express");
const Category = require("../../../models/Category");

const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const mongoose = require("mongoose");

//Get All Active Category
const getAllCategory = async (req, res, next) => {
  try {
    const cat = await Category.find({ status: true }).populate({
      path: "services",
      match: { status: true },
      populate: {
        path: "beautican_id",
        match: { status: true },
        model: "beautician", // Replace with your actual Unit model name
      },
    });

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

module.exports = { getAllCategory };
