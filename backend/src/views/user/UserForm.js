import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CRow,
  CFormLabel,
  CSpinner,
  CBreadcrumb,
  CBreadcrumbItem,
  CContainer,
  CFormInput,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import setValueFormHelper from "../../components/setValueFormHelper";
import { handleInputChange, handleFileInputChange } from "../../components/formUtils";
import { addUser, updateUser } from "../../ApiServices";
import { toast } from "react-toastify";
import noImg from "../../assets/images/avatars/no_img.png";

const UserForm = () => {
  const { state } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    setError,
    reset,
  } = useForm();
  const navigate = useNavigate();
  var [isLoading, setIsLoading] = useState(false);
  const [isupdate, setisupdate] = useState("");
  const [previewImage, setPreviewImage] = useState(noImg);
  var [defaultLoading, setdefaultLoading] = useState(true);

  useEffect(() => {
    if (state) {
      const { editdata, baseurl } = state;
      setisupdate(editdata._id);
      const fieldNames = ["name", "email", "mo_no", "address", "city"];
      const imageField = "image";
      setValueFormHelper({ setValue, setPreviewImage, state, fieldNames, imageField });
    }
    setdefaultLoading(false);
  }, []);

  const onSubmit = (data) => {
    setIsLoading(false);
    let formData = new FormData(); //formdata object
    Object.keys(data).forEach(function (key) {
      if (key === "image") {
        if (data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    isupdate === ""
      ? addUser(formData)
          .then(() => {
            localStorage.setItem("redirectSuccess", "true");
            localStorage.setItem("redirectMessage", "Added successfully!");
            navigate("/users");
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              Object.keys(err.response.data.message).forEach((key) => {
                // Set the error message for each field
                setError(key, {
                  type: "manual",
                  message: err.response.data.message[key],
                });
              });
              setIsLoading(false);
            } else {
              toast.error("Something Went Wrong!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
            setIsLoading(false);
          })
      : updateUser(formData, isupdate)
          .then(() => {
            localStorage.setItem("redirectSuccess", "true");
            localStorage.setItem("redirectMessage", "Updated successfully!");
            navigate("/users");
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              Object.keys(err.response.data.message).forEach((key) => {
                // Set the error message for each field
                setError(key, {
                  type: "manual",
                  message: err.response.data.message[key],
                });
              });
              setIsLoading(false);
            } else {
              toast.error("Something Went Wrong!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
            setIsLoading(false);
          });
  };

  return (
    <CRow>
      <CContainer fluid className="custom-header">
        <CBreadcrumb>
          <CBreadcrumbItem>
            <Link to="/dashboard">Home</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem>
            <Link to="/users">Users</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>{isupdate === "" ? "Add" : "Update"} User</CBreadcrumbItem>
        </CBreadcrumb>
      </CContainer>
      <CCol xs={12} md={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <CCol md={4}>
                <CustomInput
                  name="name"
                  type="text"
                  label="Name"
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name && errors.name.message}
                  defaultValue={getValues("name")}
                  onChange={(e) => handleInputChange("name", e.target.value, { clearErrors, setValue })}
                />
              </CCol>

              <CCol md={4}>
                <CustomInput
                  name="email"
                  type="email"
                  label="Email ID"
                  {...register("email", { required: "Email Id is required" })}
                  error={!!errors.email}
                  helperText={errors.email && errors.email.message}
                  defaultValue={getValues("email")}
                  onChange={(e) => handleInputChange("email", e.target.value, { clearErrors, setValue })}
                />
              </CCol>

              <CCol md={4}>
                <CustomInput
                  name="mo_no"
                  type="text"
                  label="Mobile Number"
                  {...register("mo_no", { required: "Mobile Number is required" })}
                  error={!!errors.mo_no}
                  helperText={errors.mo_no && errors.mo_no.message}
                  defaultValue={getValues("mo_no")}
                  onChange={(e) => handleInputChange("mo_no", e.target.value, { clearErrors, setValue })}
                />
              </CCol>

              <CCol md={6}>
                <CustomInput
                  name="address"
                  type="text"
                  label="Address"
                  {...register("address", { required: "Address is required" })}
                  error={!!errors.address}
                  helperText={errors.address && errors.address.message}
                  defaultValue={getValues("address")}
                  onChange={(e) => handleInputChange("address", e.target.value, { clearErrors, setValue })}
                />
              </CCol>

              <CCol md={2}>
                <CustomInput
                  name="city"
                  type="text"
                  label="City"
                  {...register("city", { required: "City is required" })}
                  error={!!errors.city}
                  helperText={errors.city && errors.city.message}
                  defaultValue={getValues("city")}
                  onChange={(e) => handleInputChange("city", e.target.value, { clearErrors, setValue })}
                />
              </CCol>

              <CCol md={4} className="d-fex">
                <CustomInput
                  name="image"
                  type="file"
                  label="Profile Image"
                  style={{ width: "100%" }}
                  {...register("image")}
                  error={!!errors.image}
                  helperText={errors.image && errors.image.message}
                  defaultValue={getValues("image")}
                  onChange={(e) => handleFileInputChange(e, "image", { clearErrors, setValue, setPreviewImage })}
                />
                {previewImage ? <img src={previewImage} className="img-preview" /> : ""}
              </CCol>

              <CCol xs={12}>
                {isLoading ? (
                  <CSpinner className="theme-spinner-color" />
                ) : (
                  <CButton color="primary" type="submit" className="theme-btn-background">
                    Submit
                  </CButton>
                )}
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UserForm;
