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
    const services = await Favourite.find({ user_id: req.user._id }).populate({
      path: "service_id",
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
    if (!services) return queryErrorRelatedResponse(req, res, 404, "Services not found.");

    console.log(services);

    // for (const catItem of cat) {
    //   const newCatItem = {
    //     _id: catItem._id,
    //     name: catItem.name,
    //     image: catItem.image,
    //     services: [],
    //   };

    let like = 0;
    const transformedCatData = [];

    if (services) {
      for (const service of services) {
        const openTime = parseInt(service.beautican_id.open_time);
        const closeTime = parseInt(service.beautican_id.close_time);
        const duration = parseInt(service.beautican_id.duration);

        const startTime = moment(openTime).format("hh:mm A");
        const endTime = moment(closeTime).format("hh:mm A");
        const timeSlots = [];
        let currentTime = moment(startTime, "hh:mm A");

        while (currentTime.isBefore(moment(endTime, "hh:mm A"))) {
          timeSlots.push(currentTime.format("hh:mm A"));
          currentTime = currentTime.add(duration, "minutes");
        }

        const originalServices = service.beautican_id.services;
        let transformedServices = [];

        if (originalServices && originalServices.length > 0) {
          transformedServices = originalServices.map((service) => ({
            _id: service._id,
            name: service.name,
            price: service.price,
            about: service.about,
            display_image: service.display_image,
            work_images: service.work_images,
          }));
        }

        const originalReviews = service.beautican_id.reviews;
        let transformedReviews = [];

        if (originalReviews && originalReviews.length > 0) {
          transformedReviews = originalReviews.map((review) => ({
            _id: review._id,
            name: review.user_id.name,
            image: review.user_id.image,
            review: review.review,
            rate: review.rate,
          }));
        }

        let totalReviews = 0;
        let totalRatings = 0;
        let averageRating = 0;

        if (transformedReviews && transformedReviews.length > 0) {
          totalReviews = transformedReviews.length;
          totalRatings = transformedReviews.reduce((sum, review) => sum + review.rate, 0);
          averageRating = totalRatings / totalReviews;
          averageRating = parseFloat(averageRating.toFixed(1));
        }

        const fav = await Favourite.findOne({
          user_id: req.user._id,
          beautican_id: service.beautican_id._id,
          service_id: service._id,
        });

        if (fav) {
          like = 1;
        }

        const newService = {
          _id: service._id,
          beautican_data: {
            _id: service.beautican_id._id,
            name: service.beautican_id.name,
            image: service.beautican_id.image,
            banner: service.beautican_id.banner,
            email: service.beautican_id.email,
            address: service.beautican_id.address,
            lat: service.beautican_id.lat,
            lng: service.beautican_id.lng,
            city: service.beautican_id.city,
            mo_no: service.beautican_id.mo_no,
            days: service.beautican_id.days,
            all_services: transformedServices,
            all_reviews: transformedReviews,
            totalReviews: totalReviews,
            totalRatings: totalRatings,
            averageRating: averageRating,
            open_time: moment(parseInt(service.beautican_id.open_time)).format("hh:mm A"),
            close_time: moment(parseInt(service.beautican_id.close_time)).format("hh:mm A"),
            duration: service.beautican_id.duration,
            timeSlots: timeSlots,
          },
          name: service.name,
          cat_id: service.cat_id,
          price: service.price,
          about: service.about,
          display_image: service.display_image,
          work_images: service.work_images,
          like: like,
        };

        transformedCatData.push(newService);
      }
    }

    //   transformedCatData.push(newCatItem);
    // }

    // if (services) {
    //   let like = 0;
    //   for (const service of services) {
    //     const openTime = parseInt(service.beautican_id.open_time);
    //     const closeTime = parseInt(service.beautican_id.close_time);
    //     const duration = parseInt(service.beautican_id.duration);

    //     const startTime = moment(openTime).format("hh:mm A");
    //     const endTime = moment(closeTime).format("hh:mm A");
    //     const timeSlots = [];
    //     let currentTime = moment(startTime, "hh:mm A");

    //     while (currentTime.isBefore(moment(endTime, "hh:mm A"))) {
    //       timeSlots.push(currentTime.format("hh:mm A"));
    //       currentTime = currentTime.add(duration, "minutes");
    //     }

    //     const originalServices = service.beautican_id.services;
    //     let transformedServices = [];

    //     if (originalServices && originalServices.length > 0) {
    //       transformedServices = originalServices.map((service) => ({
    //         _id: service._id,
    //         name: service.name,
    //         price: service.price,
    //         about: service.about,
    //         display_image: service.display_image,
    //         work_images: service.work_images,
    //       }));
    //     }

    //     const originalReviews = service.beautican_id.reviews;
    //     let transformedReviews = [];

    //     if (originalReviews && originalReviews.length > 0) {
    //       transformedReviews = originalReviews.map((review) => ({
    //         _id: review._id,
    //         name: review.user_id.name,
    //         image: review.user_id.image,
    //         review: review.review,
    //         rate: review.rate,
    //       }));
    //     }

    //     let totalReviews = 0;
    //     let totalRatings = 0;
    //     let averageRating = 0;

    //     if (transformedReviews && transformedReviews.length > 0) {
    //       totalReviews = transformedReviews.length;
    //       totalRatings = transformedReviews.reduce((sum, review) => sum + review.rate, 0);
    //       averageRating = totalRatings / totalReviews;
    //       averageRating = parseFloat(averageRating.toFixed(1));
    //     }

    //     const fav = await Favourite.findOne({
    //       user_id: req.user._id,
    //       beautican_id: service.beautican_id._id,
    //       service_id: service._id,
    //     });

    //     if (fav) {
    //       like = 1;
    //     }

    //     const newService = {
    //       _id: service._id,
    //       beautican_data: {
    //         _id: service.beautican_id._id,
    //         name: service.beautican_id.name,
    //         image: service.beautican_id.image,
    //         banner: service.beautican_id.banner,
    //         email: service.beautican_id.email,
    //         address: service.beautican_id.address,
    //         lat: service.beautican_id.lat,
    //         lng: service.beautican_id.lng,
    //         city: service.beautican_id.city,
    //         mo_no: service.beautican_id.mo_no,
    //         days: service.beautican_id.days,
    //         all_services: transformedServices,
    //         all_reviews: transformedReviews,
    //         totalReviews: totalReviews,
    //         totalRatings: totalRatings,
    //         averageRating: averageRating,
    //         open_time: moment(parseInt(service.beautican_id.open_time)).format("hh:mm A"),
    //         close_time: moment(parseInt(service.beautican_id.close_time)).format("hh:mm A"),
    //         duration: service.beautican_id.duration,
    //         timeSlots: timeSlots,
    //       },
    //       name: service.name,
    //       cat_id: service.cat_id,
    //       price: service.price,
    //       about: service.about,
    //       display_image: service.display_image,
    //       work_images: service.work_images,
    //       like: like,
    //     };

    //     newData.push(newService);
    //   }
    // }

    const baseUrl_category =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_CATEGORY_PATH;

    const baseUrl_beauty_profile =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_BEAUTICIAN_PATH;

    const baseUrl_service =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_SERVICE_PATH;

    const baseUrl_user_profile =
      req.protocol + "://" + req.get("host") + process.env.BASE_URL_PUBLIC_PATH + process.env.BASE_URL_PROFILE_PATH;

    const AllData = {
      services: transformedCatData,
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

module.exports = { favService, favServiceList };
