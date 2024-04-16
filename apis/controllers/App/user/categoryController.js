const express = require("express");
const Category = require("../../../models/Category");
const Service = require("../../../models/Service");
const Favourite = require("../../../models/Favourite");
const { transformServices, getServicesWithBeauticians } = require("../../../helper/commonServices");
const {
  createResponse,
  successResponse,
  queryErrorRelatedResponse,
  deleteResponse,
} = require("../../../helper/sendResponse");
const mongoose = require("mongoose");
const moment = require("moment");

//Get All Active Category
// const getAllCategory = async (req, res, next) => {
//   try {
//     const cat = await Category.find({ status: true }).populate({
//       path: "services",
//       match: { status: true },
//       populate: {
//         path: "beautican_id",
//         match: { status: true },
//         populate: [
//           {
//             path: "services",
//             match: { status: true },
//             model: "services",
//           },
//           {
//             path: "reviews",
//             select: { review: 1, rate: 1, user_id: 1 },
//             populate: {
//               path: "user_id",
//               select: { name: 1, image: 1 },
//               model: "user",
//             },
//           },
//         ],
//       },
//     });

//     if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

//     const transformedCatData = [];

//     for (const catItem of cat) {
//       const newCatItem = {
//         _id: catItem._id,
//         name: catItem.name,
//         image: catItem.image,
//         services: [],
//       };

//       if (catItem.services) {
//         for (const service of catItem.services) {
//           if (service.beautican_id) {
//             let like = 0;
//             const openTime = parseInt(service.beautican_id.open_time);
//             const closeTime = parseInt(service.beautican_id.close_time);
//             const duration = parseInt(service.beautican_id.duration);

//             const startTime = moment(openTime).format("hh:mm A");
//             const endTime = moment(closeTime).format("hh:mm A");
//             const timeSlots = [];
//             let currentTime = moment(startTime, "hh:mm A");

//             while (currentTime.isBefore(moment(endTime, "hh:mm A"))) {
//               timeSlots.push(currentTime.format("hh:mm A"));
//               currentTime = currentTime.add(duration, "minutes");
//             }

//             const originalServices = service.beautican_id.services;
//             let transformedServices = [];

//             if (originalServices && originalServices.length > 0) {
//               transformedServices = originalServices.map((service) => ({
//                 _id: service._id,
//                 name: service.name,
//                 price: service.price,
//                 about: service.about,
//                 display_image: service.display_image,
//                 work_images: service.work_images,
//               }));
//             }

//             const originalReviews = service.beautican_id.reviews;
//             let transformedReviews = [];

//             if (originalReviews && originalReviews.length > 0) {
//               transformedReviews = originalReviews.map((review) => ({
//                 _id: review._id,
//                 name: review.user_id.name,
//                 image: review.user_id.image,
//                 review: review.review,
//                 rate: review.rate,
//               }));
//             }

//             // let totalReviews = 0;
//             // let totalRatings = 0;
//             // let averageRating = 0;

//             // if (transformedReviews && transformedReviews.length > 0) {
//             //   totalReviews = transformedReviews.length;
//             //   totalRatings = transformedReviews.reduce((sum, review) => sum + review.rate, 0);
//             //   averageRating = totalRatings / totalReviews;
//             //   averageRating = parseFloat(averageRating.toFixed(1));
//             // }

//             const fav = await Favourite.findOne({
//               user_id: req.user._id,
//               beautican_id: service.beautican_id._id,
//               service_id: service._id,
//             });

//             if (fav) {
//               like = 1;
//             }

//             const newService = {
//               _id: service._id,
//               beautican_data: {
//                 _id: service.beautican_id._id,
//                 name: service.beautican_id.name,
//                 image: service.beautican_id.image,
//                 banner: service.beautican_id.banner,
//                 email: service.beautican_id.email,
//                 address: service.beautican_id.address,
//                 lat: service.beautican_id.lat,
//                 lng: service.beautican_id.lng,
//                 city: service.beautican_id.city,
//                 mo_no: service.beautican_id.mo_no,
//                 days: service.beautican_id.days,
//                 all_services: transformedServices,
//                 all_reviews: transformedReviews,
//                 totalReviews: service.beautican_id.totalReviews,
//                 totalRatings: service.beautican_id.totalRatings,
//                 averageRating: service.beautican_id.averageRating,
//                 open_time: moment(parseInt(service.beautican_id.open_time)).format("hh:mm A"),
//                 close_time: moment(parseInt(service.beautican_id.close_time)).format("hh:mm A"),
//                 duration: service.beautican_id.duration,
//                 timeSlots: timeSlots,
//               },
//               name: service.name,
//               cat_id: service.cat_id,
//               price: service.price,
//               about: service.about,
//               display_image: service.display_image,
//               work_images: service.work_images,
//               like: like,
//             };

//             newCatItem.services.push(newService);
//           }
//         }
//       }

//       transformedCatData.push(newCatItem);
//     }

//     // After the loop, handle transformedCatData as needed

//     const baseUrl_category =
//       req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_CATEGORY_PATH;

//     const baseUrl_beauty_profile =
//       req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BEAUTICIAN_PATH;

//     const baseUrl_service =
//       req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

//     const baseUrl_user_profile =
//       req.protocol + "://" + req.get("host") + process.env.BASE_URL_API_FOLDER + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

//     const AllData = {
//       cat: transformedCatData,
//       baseUrl_category: baseUrl_category,
//       baseUrl_beauty_profile: baseUrl_beauty_profile,
//       baseUrl_service: baseUrl_service,
//       baseUrl_user_profile: baseUrl_user_profile,
//     };

//     successResponse(res, AllData);
//   } catch (err) {
//     next(err);
//   }
// };

//Get All Active Category
const getAllCategory = async (req, res, next) => {
  try {
    const cat = await Category.find({ status: true }, "name image");
    if (!cat) return queryErrorRelatedResponse(req, res, 404, "Category not found.");

    const first_cat = await Category.findOne({ status: true });

    const services = await getServicesWithBeauticians(first_cat._id);

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
      cat: cat,
      services: transformedServices,
      baseUrl_category: baseUrl_category,
      baseUrl_service: baseUrl_service,
    };

    successResponse(res, AllData);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCategory };
