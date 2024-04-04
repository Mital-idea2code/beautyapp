const Favourite = require("../models/Favourite");
const Service = require("../models/Service");
const moment = require("moment");

const getServicesWithBeauticians = async (catId) => {
  const services = await Service.find(
    { status: true, cat_id: catId },
    "name beautican_id cat_id price display_image"
  ).populate({
    path: "beautican_id",
    match: { status: true },
    select: { name: 1, address: 1, averageRating: 1 },
  });
  return services;
};

const transformServices = async (services, req) => {
  const transformedServices = [];

  for (const service of services) {
    // Check if beautican_id is not null
    if (service.beautican_id !== null) {
      const fav = await Favourite.findOne({
        user_id: req.user._id,
        beautican_id: service.beautican_id._id,
        service_id: service._id,
      });

      transformedServices.push({
        _id: service._id,
        beautican_id: service.beautican_id ? service.beautican_id._id : null,
        beautican_name: service.beautican_id ? service.beautican_id.name : null,
        beautican_address: service.beautican_id ? service.beautican_id.address : null,
        averageRating: service.beautican_id ? service.beautican_id.averageRating : null,
        name: service.name,
        cat_id: service.cat_id,
        price: service.price,
        display_image: service.display_image,
        like: fav ? 1 : 0,
      });
    }
  }

  // Sort transformedServices array in descending order based on averageRating
  transformedServices.sort((a, b) => b.averageRating - a.averageRating);

  return transformedServices;
};

const transformServiceInfo = (serviceInfo, req, fav) => {
  const service = serviceInfo;

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

  const beauticianData = {
    _id: service.beautican_id._id,
    name: service.beautican_id.name,
    email: service.beautican_id.email,
    address: service.beautican_id.address,
    lat: service.beautican_id.lat,
    lng: service.beautican_id.lng,
    city: service.beautican_id.city,
    mo_no: service.beautican_id.mo_no,
    days: service.beautican_id.days,
    services: transformedServices,
    reviews: transformedReviews,
    banner: service.beautican_id.banner,
    image: service.beautican_id.image,
    averageRating: service.beautican_id.averageRating,
    totalReviews: service.beautican_id.totalReviews,
    totalRatings: service.beautican_id.totalRatings,
    open_time: moment(parseInt(service.beautican_id.open_time)).format("hh:mm A"),
    close_time: moment(parseInt(service.beautican_id.close_time)).format("hh:mm A"),
    duration: service.beautican_id.duration,
    timeSlots: timeSlots,
  };

  const transformedService = {
    _id: service._id,
    beautician_data: beauticianData,
    name: service.name,
    cat_id: service.cat_id,
    price: service.price,
    about: service.about,
    display_image: service.display_image,
    work_images: service.work_images,
    like: fav ? 1 : 0,
  };

  return transformedService;
};

const transformAppointmentData = (appointments) => {
  const transformedInfo = [];

  for (const item of appointments) {
    const user = item.user_id;
    const service = item.service_id;
    const category = item.cat_id;

    const transformedItem = {
      _id: item._id,
      user_name: user.name,
      user_address: user.address,
      user_email: user.email,
      user_mo_no: user.mo_no,
      user_image: user.image,
      category_name: category.name,
      service_name: service.name,
      service_about: service.about,
      service_display_image: service.display_image,
      app_date: moment(item.app_date).format("MMMM DD, YYYY"),
      app_time: moment(parseInt(item.app_time)).format("hh:mm A"),
      amount: item.amount,
      status: item.status,
      cancel_reason: item.cancel_reason,
      createdAt: item.createdAt,
    };

    transformedInfo.push(transformedItem);
  }

  return transformedInfo;
};

const transformAdminAppointmentData = (appointments) => {
  const transformedInfo = [];

  for (const item of appointments) {
    const user = item.user_id;
    const beautician = item.beautican_id;
    const service = item.service_id;
    const category = item.cat_id;

    const transformedItem = {
      _id: item._id,
      user_name: user.name,
      user_address: user.address,
      user_email: user.email,
      user_mo_no: user.mo_no,
      user_image: user.image,
      beautician_name: beautician.name,
      beautician_address: beautician.address,
      beautician_email: beautician.email,
      category_name: category.name,
      service_name: service.name,
      service_about: service.about,
      service_display_image: service.display_image,
      app_date: moment(item.app_date).format("MMMM DD, YYYY"),
      app_time: moment(parseInt(item.app_time)).format("hh:mm A"),
      amount: item.amount,
      status: item.status,
      cancel_reason: item.cancel_reason,
      createdAt: item.createdAt,
    };

    transformedInfo.push(transformedItem);
  }

  return transformedInfo;
};

module.exports = {
  getServicesWithBeauticians,
  transformServices,
  transformServiceInfo,
  transformAppointmentData,
  transformAdminAppointmentData,
};
