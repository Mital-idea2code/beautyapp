const express = require("express");
const Appointment = require("../../../models/Appointment");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const mongoose = require("mongoose");

//Update Appointment Status
const updateApptatus = async (req, res, next) => {
  try {
    const id = req.params.id;
    const app = await Appointment.findById(id);
    if (!app) return queryErrorRelatedResponse(req, res, 404, "Appointment not found.");

    app.status = req.body.status;
    app.cancel_reason = req.body.cancel_reason;

    const result = await app.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateApptatus,
};
