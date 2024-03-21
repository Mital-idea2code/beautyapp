const express = require("express");
const Appointment = require("../../../models/Appointment");
const ReviewRating = require("../../../models/ReviewRating");
const Beautician = require("../../../models/Beautician");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const mongoose = require("mongoose");
const moment = require("moment");

//Add Appointment
const bookAppointment = async (req, res, next) => {
  try {
    const addedApp = req.body;

    req.body.app_time = moment(req.body.app_time, "h:mm A").valueOf(); //HH:mm

    const newApp = await new Appointment(addedApp);

    const result = await newApp.save();
    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Add Review Rating
const addReview = async (req, res, next) => {
  try {
    const beautician = await Beautician.findOne({ _id: req.body.beautican_id });
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Beautician not found.");

    const app = await Appointment.findOne({ _id: req.body.appointment_id, status: 1 });
    if (!app)
      return queryErrorRelatedResponse(req, res, 404, "You can't leave a review before completing the appointment.");

    const added = await ReviewRating.findOne({ appointment_id: req.body.appointment_id });
    if (added)
      return queryErrorRelatedResponse(
        req,
        res,
        404,
        "You've already provided feedback, you won't be able to do so again."
      );

    const addedReview = req.body;
    const newReview = await new ReviewRating(addedReview);

    const result = await newReview.save();

    // Add the new service to the category array
    beautician.reviews.push(result);
    // Save the category with the new services
    await beautician.save();

    return createResponse(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  bookAppointment,
  addReview,
};
