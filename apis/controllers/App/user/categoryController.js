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
        populate: [
          {
            path: "services",
            match: { status: true },
            model: "services",
          },
          {
            path: "reviews",
            select: { review: 1, rate: 1, user_id: 1 },
            populate: {
              path: "user_id",
              select: { name: 1, image: 1 },
              model: "user",
            },
          },
        ],
      },
    });

    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    const baseUrl_category =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_CATEGORY_PATH;

    const baseUrl_beauty_profile =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BEAUTICIAN_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

    const baseUrl_user_profile =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

    const AllData = {
      cat: cat,
      baseUrl_category: baseUrl_category,
      baseUrl_beauty_profile: baseUrl_beauty_profile,
      baseUrl_service: baseUrl_service,
      baseUrl_user_profile: baseUrl_user_profile,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCategory };
