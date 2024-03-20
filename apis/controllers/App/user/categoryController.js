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
    // const cat = await Category.find({ status: true }).populate({
    //   path: "services",
    //   match: { status: true },
    //   populate: {
    //     path: "beautican_id",
    //     match: { status: true },
    //     model: "beautician", // Replace with your actual Unit model name
    //   },
    // });

    const cat = await Category.find({ status: true }).populate({
      path: "services",
      match: { status: true },
      populate: {
        path: "beautican_id",
        match: { status: true },
        populate: {
          path: "services",
          match: { status: true },
          model: "services", // Replace with your actual Unit model name
        },
      },
    });

    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    const baseUrl_category =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_CATEGORY_PATH;

    const baseUrl_profile =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BEAUTICIAN_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      cat: cat,
      baseUrl_category: baseUrl_category,
      baseUrl_profile: baseUrl_profile,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCategory };
