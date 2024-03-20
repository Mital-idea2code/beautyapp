const express = require("express");
const Appointment = require("../../../models/Appointment");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const mongoose = require("mongoose");
