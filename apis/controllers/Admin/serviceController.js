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

//Update Service Status
const updateServiceStatus = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return queryErrorRelatedResponse(req, res, 404, "Service not found.");

    service.status = !service.status;
    const result = await service.save();
    return successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

//Get Services By Beautician ID
const getBeauticianServices = async (req, res, next) => {
  try {
    const services = await Service.find({ beautican_id: req.params.id }).populate("cat_id");
    if (!services) return queryErrorRelatedResponse(req, res, 404, "Services not found.");

    const transformedData = [];
    for (const item of services) {
      transformedData.push({
        _id: item._id,
        beautican_id: item.beautican_id,
        name: item.name,
        cat_name: item.cat_id.name, // Extract category name from cat_id
        price: item.price,
        about: item.about,
        display_image: item.display_image,
        work_images: item.work_images,
        status: item.status,
        createdAt: item.createdAt,
      });
    }

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      service: transformedData,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get All Service
const getAllService = async (req, res, next) => {
  try {
    const services = await Service.find().populate([
      {
        path: "beautican_id",
        model: "beautician",
        select: { name: 1, email: 1 },
      },
      {
        path: "cat_id",
        model: "category",
        select: { name: 1 },
      },
    ]);
    if (!services) return queryErrorRelatedResponse(req, res, 404, "Service not found.");

    const transformedData = [];
    for (const item of services) {
      transformedData.push({
        _id: item._id,
        beautican_id: item.beautican_id._id,
        beautican_name: item.beautican_id.name,
        beautican_email: item.beautican_id.email,
        name: item.name,
        cat_name: item.cat_id.name, // Extract category name from cat_id
        price: item.price,
        about: item.about,
        display_image: item.display_image,
        work_images: item.work_images,
        status: item.status,
        createdAt: item.createdAt,
      });
    }

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      service: transformedData,
      baseUrl: baseUrl,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBeauticianServices,
  getAllService,
  updateServiceStatus,
};
