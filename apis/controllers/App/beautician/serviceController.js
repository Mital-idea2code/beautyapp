const express = require("express");
const Service = require("../../../models/Service");
const Category = require("../../../models/Category");
const Beautician = require("../../../models/Beautician");
const { sendMail } = require("../../../helper/emailSender");
const {
  createResponse,
  queryErrorRelatedResponse,
  successResponse,
  successResponseOfFiles,
} = require("../../../helper/sendResponse");
const deleteFiles = require("../../../helper/deleteFiles");

//Add Service
const addService = async (req, res, next) => {
  try {
    const beautician = await Beautician.findById(req.body.beautican_id);
    if (!beautician) return queryErrorRelatedResponse(req, res, 404, "Essentials not found.");

    const cat = await Category.findById(req.body.cat_id);
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    const addedService = req.body;

    if (req.files.display_image) {
      addedService.display_image = req.files.display_image[0].filename;
    }

    if (req.files.work_images) {
      addedService.work_images = req.files.work_images.map((file) => file.filename);
    }

    const newService = await new Service(addedService);

    const result = await newService.save();

    // Add the new service to the beautician array
    beautician.services.push(result);
    beautician.category.push(req.body.cat_id);
    // Save the beautician with the new service
    await beautician.save();

    // Add the new service to the category array
    cat.services.push(result);
    // Save the category with the new services
    await cat.save();

    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      service: result,
      baseUrl: baseUrl,
    };

    return createResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Service List
const serviceList = async (req, res, next) => {
  try {
    const services = await Service.find({ beautican_id: req.beautician._id });
    if (!services) return queryErrorRelatedResponse(req, res, 404, "Services not found.");

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      services: services,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Update Service Status
const updateServiceStatus = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return queryErrorRelatedResponse(req, res, 404, "Service not found.");

    service.status = !service.status;
    const result = await service.save();

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      services: result,
      baseUrl_service: baseUrl_service,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Update Service
const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return queryErrorRelatedResponse(req, res, 404, "Service not found.");

    const updatedData = req.body;

    if (req.files.display_image) {
      deleteFiles("service/" + service.display_image);
      updatedData.display_image = req.files.display_image[0].filename;
    }

    if (req.files.work_images) {
      deleteFiles("service/" + service.work_images);
      updatedData.work_images = service.work_images.concat(req.files.work_images.map((file) => file.filename));
    }

    const isUpdate = await Service.findByIdAndUpdate(req.params.id, { $set: updatedData });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await Service.findById(req.params.id);

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      services: result,
      baseUrl_service: baseUrl_service,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Delete Service Work Image
const deleteWorkImage = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return queryErrorRelatedResponse(req, res, 404, "Service not found.");

    const updatedData = req.body;

    // Handle deletion of a specific image from the array and folder
    if (req.body.work_image && typeof req.body.work_image === "string") {
      deleteFiles("service/" + req.body.work_image);
      updatedData.work_images = service.work_images.filter((image) => image !== req.body.work_image);
    }

    const isUpdate = await Service.findByIdAndUpdate(req.params.id, { $set: updatedData });
    if (!isUpdate) return queryErrorRelatedResponse(req, res, 401, "Something Went wrong!!");

    const result = await Service.findById(req.params.id);

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      services: result,
      baseUrl_service: baseUrl_service,
    };

    return successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addService,
  serviceList,
  updateServiceStatus,
  updateService,
  deleteWorkImage,
};
