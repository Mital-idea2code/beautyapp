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
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      service: result,
      baseUrl: baseUrl,
    };

    return createResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addService,
};
