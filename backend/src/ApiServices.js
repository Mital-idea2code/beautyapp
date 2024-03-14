import axios from "axios";

const mainUrl = process.env.NODE_ENV === "development" ? "http://localhost:5057" : "http://167.71.227.102:5057";

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

//Get All Specialist Category
export const getAllSpecialistCategory = () =>
  axios.get(`${mainUrl}/admin/specialistCategory/getAllSpecialistCategory`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Add Specialist Category
export const addSpecialistCategory = (data) =>
  axios.post(`${mainUrl}/admin/specialistCategory/addSpecialistCategory`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Specialist Category
export const updateSpecialistCategory = (data, id) =>
  axios.put(`${mainUrl}/admin/specialistCategory/updateSpecialistCategory/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Specialist Category Status
export const updateSpeCatStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/specialistCategory/updateSpeCatStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Specialist Category
export const deleteSpecialistCategory = (id) =>
  axios.delete(`${mainUrl}/admin/specialistCategory/deleteSpecialistCategory/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Multiple Specialist Category
export const deleteMultSpecialistCategory = (data) => {
  return axios.delete(`${mainUrl}/admin/specialistCategory/deleteMultSpecialistCategory`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: { Ids: data },
  });
};

//Get All Doctor
export const getAllDoctors = () =>
  axios.get(`${mainUrl}/admin/doctor/getAllDoctors`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Add Doctor
export const addDoctor = (data) =>
  axios.post(`${mainUrl}/admin/doctor/addDoctor`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Doctor
export const updateDoctor = (data, id) =>
  axios.put(`${mainUrl}/admin/doctor/updateDoctor/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Update Doctor Status
export const updateDoctorStatus = (data, id) =>
  axios.put(`${mainUrl}/admin/doctor/updateDoctorStatus/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Doctor
export const deleteDoctor = (id) =>
  axios.delete(`${mainUrl}/admin/doctor/deleteDoctor/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

//Delete Multiple Doctor
export const deleteMultDoctor = (data) => {
  return axios.delete(`${mainUrl}/admin/doctor/deleteMultDoctor`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    data: { Ids: data },
  });
};
