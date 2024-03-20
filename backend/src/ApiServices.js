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
