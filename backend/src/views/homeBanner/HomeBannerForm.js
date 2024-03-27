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
import { handleInputChange, handleFileInputChange } from "../../components/formUtils";
import { AddBanner, updateBanners } from "../../ApiServices";
import { toast } from "react-toastify";
import noImg from "../../assets/images/avatars/no_img.png";

const HomeBannerForm = () => {
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
      setValue("name", editdata.name);
      setPreviewImage(baseurl + editdata.image);
    }
    setdefaultLoading(false);
  }, []);

  const onSubmit = (data) => {
    setIsLoading(false);
    let formData = new FormData(); //formdata object
    Object.keys(data).forEach(function (key) {
      if (key === "image") {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    isupdate === ""
      ? AddBanner(formData)
          .then(() => {
            localStorage.setItem("redirectSuccess", "true");
            localStorage.setItem("redirectMessage", "Added successfully!");
            navigate("/homebanners");
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              toast.error(err.response.data.message);
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
      : updateBanners(formData, isupdate)
          .then(() => {
            localStorage.setItem("redirectSuccess", "true");
            localStorage.setItem("redirectMessage", "Updated successfully!");
            navigate("/homebanners");
          })
          .catch((err) => {
            if (!err.response.data.isSuccess) {
              toast.error(err.response.data.message);
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
            <Link to="/homebanners">Home Banner</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>{isupdate === "" ? "Add" : "Update"} Home Banner</CBreadcrumbItem>
        </CBreadcrumb>
      </CContainer>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <CCol md={12} className="d-fex">
                <CustomInput
                  name="image"
                  type="file"
                  label="Banner"
                  style={{ width: "100%" }}
                  {...register("image", { required: isupdate ? false : "Image is required" })}
                  error={!!errors.image}
                  helperText={errors.image && errors.image.message}
                  defaultValue={getValues("image")}
                  onChange={(e) => handleFileInputChange(e, "image", { clearErrors, setValue, setPreviewImage })}
                />
                {previewImage ? <img src={previewImage} className="banner-img-preview" /> : ""}
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

export default HomeBannerForm;
