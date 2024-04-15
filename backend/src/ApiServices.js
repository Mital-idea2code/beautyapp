import axios from "axios";

const mainUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:5057" : "https://idea2codeinfotech.com/glamspot/apis";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 402 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${mainUrl}/admin/refreshToken`, { refreshToken });
        const token = response.data.info;
        // console.log(response.data.info);
        localStorage.setItem("token", token);
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        // console.log(originalRequest);
        return axios(originalRequest);
      } catch (error) {
        // Handle refresh token error or redirect to login
      }
    }

    if (error.response.status === 405) {
      localStorage.removeItem("token");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);
//Admin Login
export const adminLogin = (data) => axios.post(`${mainUrl}/admin/login`, data);

//Admin Register
export const adminRegister = (data) => axios.post(`${mainUrl}/admin/register`, data);

//Forgot Password - Check Email Id
export const checkmailid = (data) => axios.post(`${mainUrl}/admin/checkmailid`, data);

//Forgot Password - Reset Password
export const resetPassword = (data) => axios.post(`${mainUrl}/admin/resetPassword`, data);

//Update Admin Profile
export const UpdateProfile = (data) =>
  axios.post(`${mainUrl}/admin/UpdateProfile`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Change Password
export const changePassword = (data) =>
  axios.post(`${mainUrl}/admin/changePassword`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get All User
export const getAllUser = () =>
  axios.get(`${mainUrl}/admin/user/getAllUser`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Add User
export const addUser = (data) =>
  axios.post(`${mainUrl}/admin/user/addUser`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update User
export const updateUser = (data, id) =>
  axios.put(`${mainUrl}/admin/user/updateUser/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update User Status
export const updateUserStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/user/updateUserStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete User
export const deleteUser = (id) =>
  axios.delete(`${mainUrl}/admin/user/deleteUser/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Multiple User
export const deleteMultUser = (data) => {
  return axios.delete(`${mainUrl}/admin/user/deleteMultUser`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: { Ids: data },
  });
};

//Get All Beautician
export const getAllBeautician = () =>
  axios.get(`${mainUrl}/admin/beautician/getAllBeautician`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Add Beautician
export const addBeautician = (data) =>
  axios.post(`${mainUrl}/admin/beautician/addBeautician`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Beautician
export const updateBeautician = (data, id) =>
  axios.put(`${mainUrl}/admin/beautician/updateBeautician/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Beautician Status
export const updateBeauticianStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/beautician/updateBeauticianStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Beautician
export const deleteBeautician = (id) =>
  axios.delete(`${mainUrl}/admin/beautician/deleteBeautician/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Multiple Beautician
export const deleteMultBeautician = (data) => {
  return axios.delete(`${mainUrl}/admin/beautician/deleteMultBeautician`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: { Ids: data },
  });
};

//Get All Category
export const getAllCategory = () =>
  axios.get(`${mainUrl}/admin/category/getAllCategory`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Add Category
export const addCategory = (data) =>
  axios.post(`${mainUrl}/admin/category/addCategory`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Category
export const updateCategory = (data, id) =>
  axios.put(`${mainUrl}/admin/category/updateCategory/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Category Status
export const updateCattatus = (data, id) =>
  axios.put(`${mainUrl}/admin/category/updateCattatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Category
export const deleteCategory = (id) =>
  axios.delete(`${mainUrl}/admin/category/deleteCategory/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Multiple Category
export const deleteMultCategory = (data) => {
  return axios.delete(`${mainUrl}/admin/category/deleteMultCategory`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: { Ids: data },
  });
};

//Get Category Services
export const getCategoryServices = (id) =>
  axios.get(`${mainUrl}/admin/category/getCategoryServices/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get All home Banner
export const getAllBanner = () =>
  axios.get(`${mainUrl}/admin/homeBanner/getAllBanner`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Add Home Banner
export const AddBanner = (data) =>
  axios.post(`${mainUrl}/admin/homeBanner/AddBanner`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Home Banner
export const updateBanners = (data, id) =>
  axios.put(`${mainUrl}/admin/homeBanner/updateBanners/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Home Banner Status
export const updateBannerStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/homeBanner/updateBannerStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get All Category
export const getAllpromotionBanner = () =>
  axios.get(`${mainUrl}/admin/proBanner/getAllpromotionBanner`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Add proBanner
export const addpromotionBanner = (data) =>
  axios.post(`${mainUrl}/admin/proBanner/addpromotionBanner`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update proBanner
export const updatepromotionBanner = (data, id) =>
  axios.put(`${mainUrl}/admin/proBanner/updatepromotionBanner/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update proBanner Status
export const updateProBannerStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/proBanner/updateProBannerStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete proBanner
export const deletepromotionBanner = (id) =>
  axios.delete(`${mainUrl}/admin/proBanner/deletepromotionBanner/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Multiple proBanner
export const deleteMultpromotionBanner = (data) => {
  return axios.delete(`${mainUrl}/admin/proBanner/deleteMultpromotionBanner`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: { Ids: data },
  });
};

//Add Faq
export const addfaqs = (data) =>
  axios.post(`${mainUrl}/admin/faqs/addfaqs`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get Faq
export const getAllFaqs = () =>
  axios.get(`${mainUrl}/admin/faqs/getAllFaqs`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Faq
export const updateFaq = (data, id) =>
  axios.put(`${mainUrl}/admin/faqs/updateFaq/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Faq Status
export const updateFaqStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/faqs/updateFaqStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Faq
export const deletefaq = (id) =>
  axios.delete(`${mainUrl}/admin/faqs/deletefaq/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Multiple Faq
export const deleteMultFaq = (data) => {
  return axios.delete(`${mainUrl}/admin/faqs/deleteMultFaq`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: { Ids: data },
  });
};

//Get General Settings
export const getGeneralSettings = () =>
  axios.get(`${mainUrl}/admin/generalSettings/getGeneralSettings`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update General Settings
export const updateGeneralSetting = (data, id) =>
  axios.put(`${mainUrl}/admin/generalSettings/updateGeneralSetting/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Support Data
export const updatSupportData = (data, id) =>
  axios.put(`${mainUrl}/admin/generalSettings/updatSupportData/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update User T&C
export const updateUserTc = (data, id) =>
  axios.put(`${mainUrl}/admin/generalSettings/updateUserTc/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Beautician T&C
export const updateBeauticianTc = (data, id) =>
  axios.put(`${mainUrl}/admin/generalSettings/updateBeauticianTc/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update User Privacy Policy
export const updateUserPP = (data, id) =>
  axios.put(`${mainUrl}/admin/generalSettings/updateUserPP/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Beautician Privacy Policy
export const updateBeauticianPP = (data, id) =>
  axios.put(`${mainUrl}/admin/generalSettings/updateBeauticianPP/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Service Status
export const updateServiceStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/service/updateServiceStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get All Services
export const getAllService = () =>
  axios.get(`${mainUrl}/admin/service/getAllService`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get beautician Service
export const getBeauticianServices = (id) =>
  axios.get(`${mainUrl}/admin/service/getBeauticianServices/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get beautician Reviews
export const getAllReviews = (id) =>
  axios.get(`${mainUrl}/admin/beautician/getAllReviews/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Reviews
export const deleteReview = (id) =>
  axios.delete(`${mainUrl}/admin/beautician/deleteReview/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get All Upcoming Appointments
export const upcomingAppList = () =>
  axios.get(`${mainUrl}/admin/appointment/upcomingAppList`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get All Pending Appointments
export const pendingAppList = () =>
  axios.get(`${mainUrl}/admin/appointment/pendingAppList`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get All Completed Appointments
export const completedAppList = () =>
  axios.get(`${mainUrl}/admin/appointment/completedAppList`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get All Cancelled Appointments
export const cancelledAppList = () =>
  axios.get(`${mainUrl}/admin/appointment/cancelledAppList`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get All Accepted Appointments
export const acceptedAppList = () =>
  axios.get(`${mainUrl}/admin/appointment/acceptedAppList`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get Appointment Info
export const AppInfo = (id) =>
  axios.get(`${mainUrl}/admin/appointment/AppInfo/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get Beautician Appointment List
export const beauticianAppList = (id) =>
  axios.get(`${mainUrl}/admin/appointment/beauticianAppList/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get User Appointment List
export const userAppList = (id) =>
  axios.get(`${mainUrl}/admin/appointment/userAppList/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get Dashboard Count
export const getDashboardCount = () =>
  axios.get(`${mainUrl}/admin/dashboard/getDashboardCount`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get Top Beautician Data
export const getTopBeauticianData = () =>
  axios.get(`${mainUrl}/admin/dashboard/getTopBeauticianData`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get Top User Data
export const getTopUserData = () =>
  axios.get(`${mainUrl}/admin/dashboard/getTopUserData`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Get Top 2 Upcoming Appointments
export const topUpcomingAppList = () =>
  axios.get(`${mainUrl}/admin/dashboard/topUpcomingAppList`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
