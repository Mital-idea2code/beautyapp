const express = require("express");
const Beautician = require("../../../models/Beautician");
const User = require("../../../models/User");
const Favourite = require("../../../models/Favourite");
const Service = require("../../../models/Service");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const mongoose = require("mongoose");
const moment = require("moment");
const {
  transformServices,
  getServicesWithBeauticians,
  transformServiceInfo,
} = require("../../../helper/commonServices");
//Like/Dislike Beautician services
const favService = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return queryErrorRelatedResponse(req, res, 401, "Invalid User!");

    const beauti = await Beautician.findById(req.body.beautican_id);
    if (!beauti) return queryErrorRelatedResponse(req, res, 401, "Invalid Beautician!");

    const service = await Service.findById(req.body.service_id);
    if (!service) return queryErrorRelatedResponse(req, res, 401, "Invalid Service!");

    const favorite = await Favourite.findOne({
      user_id: req.user._id,
      beautican_id: req.body.beautican_id,
      service_id: req.body.service_id,
    });
    if (favorite) {
      await favorite.deleteOne({
        user_id: req.user._id,
        beautican_id: req.body.beautican_id,
        service_id: req.body.service_id,
      });
      successResponse(res, 0);
    } else {
      const newData = await new Favourite({
        user_id: req.user._id,
        beautican_id: req.body.beautican_id,
        service_id: req.body.service_id,
      });
      const result = await newData.save();
      successResponse(res, 1);
    }
  } catch (err) {
    next(err);
  }
};

//Favourite Beautician service list
const favServiceList = async (req, res, next) => {
  try {
    const services = await Favourite.find({ user_id: req.user._id }).populate([
      {
        path: "service_id",
        match: { status: true },
        select: ["name", "price", "display_image", "cat_id"],
      },
      {
        path: "beautican_id",
        match: { status: true },
        select: ["name", "address", "averageRating"],
      },
    ]);
    if (!services) return queryErrorRelatedResponse(req, res, 404, "Services not found.");

    const transformedServices = [];

    for (const service of services) {
      // Check if beautican_id is not null
      if (service.beautican_id !== null) {
        const fav = await Favourite.findOne({
          user_id: req.user._id,
          beautican_id: service.beautican_id._id,
          service_id: service.service_id._id,
        });

        transformedServices.push({
          _id: service.service_id._id,
          beautican_id: service.beautican_id ? service.beautican_id._id : null,
          beautican_name: service.beautican_id ? service.beautican_id.name : null,
          beautican_address: service.beautican_id ? service.beautican_id.address : null,
          averageRating: service.beautican_id ? service.beautican_id.averageRating : null,
          name: service.service_id.name,
          cat_id: service.service_id.cat_id,
          price: service.service_id.price,
          display_image: service.service_id.display_image,
          like: fav ? 1 : 0,
        });
      }
    }

    // Sort transformedServices array in descending order based on averageRating
    transformedServices.sort((a, b) => b.averageRating - a.averageRating);

    // const transformedServices = await transformServices(services.service_id, req);
    // const transformedCatData = [];

    // if (services) {
    //   for (const service of services) {
    //     let like = 0;

    //     if (service.service_id.beautican_id) {
    //       const openTime = parseInt(service.service_id.beautican_id.open_time);
    //       const closeTime = parseInt(service.service_id.beautican_id.close_time);
    //       const duration = parseInt(service.service_id.beautican_id.duration);

    //       const startTime = moment(openTime).format("hh:mm A");
    //       const endTime = moment(closeTime).format("hh:mm A");
    //       const timeSlots = [];
    //       let currentTime = moment(startTime, "hh:mm A");

    //       while (currentTime.isBefore(moment(endTime, "hh:mm A"))) {
    //         timeSlots.push(currentTime.format("hh:mm A"));
    //         currentTime = currentTime.add(duration, "minutes");
    //       }

    //       const originalServices = service.service_id.beautican_id.services;
    //       let transformedServices = [];

    //       if (originalServices && originalServices.length > 0) {
    //         transformedServices = originalServices.map((service) => ({
    //           _id: service._id,
    //           name: service.name,
    //           price: service.price,
    //           about: service.about,
    //           display_image: service.display_image,
    //           work_images: service.work_images,
    //         }));
    //       }

    //       const originalReviews = service.service_id.beautican_id.reviews;
    //       let transformedReviews = [];

    //       if (originalReviews && originalReviews.length > 0) {
    //         transformedReviews = originalReviews.map((review) => ({
    //           _id: review._id,
    //           name: review.user_id.name,
    //           image: review.user_id.image,
    //           review: review.review,
    //           rate: review.rate,
    //         }));
    //       }

    //       let totalReviews = 0;
    //       let totalRatings = 0;
    //       let averageRating = 0;

    //       if (transformedReviews && transformedReviews.length > 0) {
    //         totalReviews = transformedReviews.length;
    //         totalRatings = transformedReviews.reduce((sum, review) => sum + review.rate, 0);
    //         averageRating = totalRatings / totalReviews;
    //         averageRating = parseFloat(averageRating.toFixed(1));
    //       }

    //       const fav = await Favourite.findOne({
    //         user_id: req.user._id,
    //         beautican_id: service.service_id.beautican_id._id,
    //         service_id: service.service_id._id,
    //       });

    //       if (fav) {
    //         like = 1;
    //       }

    //       const newService = {
    //         _id: service.service_id._id,
    //         beautican_data: {
    //           _id: service.service_id.beautican_id._id,
    //           name: service.service_id.beautican_id.name,
    //           image: service.service_id.beautican_id.image,
    //           banner: service.service_id.beautican_id.banner,
    //           email: service.service_id.beautican_id.email,
    //           address: service.service_id.beautican_id.address,
    //           lat: service.service_id.beautican_id.lat,
    //           lng: service.service_id.beautican_id.lng,
    //           city: service.service_id.beautican_id.city,
    //           mo_no: service.service_id.beautican_id.mo_no,
    //           days: service.service_id.beautican_id.days,
    //           all_services: transformedServices,
    //           all_reviews: transformedReviews,
    //           totalReviews: totalReviews,
    //           totalRatings: totalRatings,
    //           averageRating: averageRating,
    //           open_time: moment(parseInt(service.service_id.beautican_id.open_time)).format("hh:mm A"),
    //           close_time: moment(parseInt(service.service_id.beautican_id.close_time)).format("hh:mm A"),
    //           duration: service.service_id.beautican_id.duration,
    //           timeSlots: timeSlots,
    //         },
    //         name: service.service_id.name,
    //         cat_id: service.service_id.cat_id,
    //         price: service.service_id.price,
    //         about: service.service_id.about,
    //         display_image: service.service_id.display_image,
    //         work_images: service.service_id.work_images,
    //         like: like,
    //       };

    //       transformedCatData.push(newService);
    //     }
    //   }
    // }

    const baseUrl_category =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_CATEGORY_PATH;

    const baseUrl_beauty_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const baseUrl_user_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const AllData = {
      services: transformedServices,
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

//Get All Active Services
const getServicesByCatid = async (req, res, next) => {
  try {
    const services = await getServicesWithBeauticians(req.params.id);

    const transformedServices = await transformServices(services, req);

    const baseUrl_category =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_CATEGORY_PATH;

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      services: transformedServices,
      baseUrl_category: baseUrl_category,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

//Get Services Info By id
const getServiceInfoByid = async (req, res, next) => {
  try {
    const serviceInfo = await Service.findOne(
      { status: true, _id: req.params.id },
      "name beautican_id cat_id price about display_image work_images "
    ).populate({
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
    });
    if (!serviceInfo) return queryErrorRelatedResponse(req, res, 401, "Invalid Service!");

    const fav = await Favourite.findOne({
      user_id: req.user._id,
      beautican_id: serviceInfo.beautican_id._id,
      service_id: serviceInfo._id,
    });

    const transformedService = transformServiceInfo(serviceInfo, req, fav);

    const baseUrl_category =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_CATEGORY_PATH;

    const baseUrl_beauty_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_BEAUTICIAN_PATH;

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const baseUrl_user_profile =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_PROFILE_PATH;

    const AllData = {
      serviceinfo: transformedService,
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

//Serch Services Data
const searchServices = async (req, res, next) => {
  try {
    const regexSearch = new RegExp(req.params.search, "i"); // Create a case-insensitive regex
    const searchQuery = req.params.search;

    const services = await Service.aggregate([
      // Match services with status true
      { $match: { status: true } },
      // Lookup to join with beautician collection and filter based on beautician status
      {
        $lookup: {
          from: "beauticians",
          localField: "beautican_id",
          foreignField: "_id",
          as: "beautican_id",
        },
      },
      // Unwind the beautician array
      { $unwind: "$beautican_id" },
      // Match beauticians with status true
      { $match: { "beautican_id.status": true } },
      // Project only the fields you want to return
      {
        $project: {
          _id: 1,
          name: 1,
          cat_id: 1,
          price: 1,
          about: 1,
          display_image: 1,
          work_images: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1,
          beautican_id: {
            _id: 1,
            name: 1,
            address: 1,
            averageRating: 1,
          },
        },
      },
      // Match based on your search criteria
      {
        $match: {
          $or: [
            { "beautican_id.name": { $regex: searchQuery, $options: "i" } }, // Match beautician name
            { "beautican_id.address": { $regex: searchQuery, $options: "i" } }, // Match beautician address
            { name: { $regex: searchQuery, $options: "i" } }, // Match service name
            { price: { $regex: searchQuery, $options: "i" } }, // Match service price
          ],
        },
      },
    ]);

    const transformedServices = await transformServices(services, req);

    const baseUrl_category =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_CATEGORY_PATH;

    const baseUrl_service =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_API_FOLDER +
      process.env.BASE_URL_PUBLIC_PATH +
      process.env.BASE_URL_SERVICE_PATH;

    const AllData = {
      services: transformedServices,
      baseUrl_category: baseUrl_category,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = { favService, favServiceList, getServicesByCatid, getServiceInfoByid, searchServices };
