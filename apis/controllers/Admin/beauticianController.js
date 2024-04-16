const express = require("express");
const Beautician = require("../../models/Beautician");
const Appointment = require("../../models/Appointment");
const ReviewRating = require("../../models/ReviewRating");
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

    updatedData.open_time = moment(req.body.open_time, "h:mm A").valueOf(); //HH:mm
    updatedData.close_time = moment(req.body.close_time, "h:mm A").valueOf();

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
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");
    deleteFiles("beautician/" + beautician.image);
    deleteFiles("beautician/" + beautician.banner);
    await Beautician.deleteOne({ _id: req.params.id });
    await Appointment.deleteMany({ beautican_id: req.params.id });
    await ReviewRating.deleteMany({ beautican_id: req.params.id });
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
      if (beautician) {
        deleteFiles("beautician/" + beautician.image);
        deleteFiles("beautician/" + beautician.banner);

        await Beautician.deleteOne({ _id: item });
        await Appointment.deleteMany({ beautican_id: item });
        await ReviewRating.deleteMany({ beautican_id: item });
      }
    });
    deleteResponse(res, "All selected records deleted successfully.");
  } catch (err) {
    next(err);
  }
};

//Get All Beautician
const getAllBeautician = async (req, res, next) => {
  try {
    const beauticians = await Beautician.find();
    if (!beauticians) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;
    const finaldata = [];
    // Iterate through each beautician object
    for (const beautician of beauticians) {
      // Convert open_time to a human-readable format
      beautician.open_time = beautician.open_time ? moment(parseInt(beautician.open_time)).format("h:mm A") : "";

      // Convert close_time to a human-readable format
      beautician.close_time = beautician.close_time ? moment(parseInt(beautician.close_time)).format("h:mm A") : "";

      const originalReviews = await ReviewRating.find({ beautican_id: beautician._id });

      beautician.totalReviews = 0;
      beautician.totalRatings = 0;
      beautician.averageRating = 0;

      if (originalReviews && originalReviews.length > 0) {
        beautician.totalReviews = originalReviews.length;
        beautician.totalRatings = originalReviews.reduce((sum, review) => sum + review.rate, 0);
        averageRating = beautician.totalRatings / beautician.totalReviews;
        beautician.averageRating = parseFloat(averageRating.toFixed(1));
      }

      const appointmentCount = await Appointment.countDocuments({ beautican_id: beautician._id });

      // Add the appointmentCount and averageRating (if calculated) to the current beautician object and push it to finaldata
      finaldata.push({
        ...beautician.toObject(), // Convert to plain object to avoid Mongoose metadata
        appointmentCount,
      });
    }

    const AllData = {
      beautician: finaldata,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get All Reviews
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewRating.find({ beautican_id: req.params.id }, "appointment_id review rate").populate(
      "user_id"
    );
    if (!reviews) return queryErrorRelatedResponse(req, res, 404, "Reviews not found.");

    let convertedData = [];

    for (let i = 0; i < reviews.length; i++) {
      let item = reviews[i];
      let convertedItem = {
        _id: item._id,
        user_id: item.user_id._id,
        user_name: item.user_id.name,
        user_image: item.user_id.image,
        appointment_id: item.appointment_id,
        review: item.review,
        rate: item.rate,
      };
      convertedData.push(convertedItem);
    }

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const AllData = {
      reviews: convertedData,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Delete Single Review
const deleteReview = async (req, res, next) => {
  try {
    const reviews = await ReviewRating.findById(req.params.id);
    if (!reviews) return queryErrorRelatedResponse(req, res, 404, "Review not found.");

    const beautician = await Beautician.findOne({ _id: reviews.beautican_id });
    await ReviewRating.deleteOne({ _id: req.params.id });

    let totalReviews = 0;
    let totalRatings = 0;
    let averageRating = 0;
    const allRatings = await ReviewRating.find({ beautican_id: beautician._id });
    if (allRatings && allRatings.length > 0) {
      totalReviews = allRatings.length;
      totalRatings = allRatings.reduce((sum, review) => sum + review.rate, 0);
      averageRating = totalRatings / totalReviews;
      averageRating = parseFloat(averageRating.toFixed(1));
    }

    // Remove the deleted review ID from beautician's reviews array (if it exists)
    beautician.reviews = beautician.reviews.filter((review) => review._id.toString() !== req.params.id);

    // Add the new service to the category array
    // beautician.reviews.push(allRatings);
    beautician.totalReviews = totalReviews;
    beautician.totalRatings = totalRatings;
    beautician.averageRating = averageRating;

    // Save the category with the new services
    await beautician.save();

    deleteResponse(res, "Beautician deleted successfully.");
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
  getAllReviews,
  deleteReview,
};
