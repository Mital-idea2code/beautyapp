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
import { useForm, Controller } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import CustomSelectInput from "../../components/CustomSelectInput";
import { handleFileInputChange } from "../../components/formUtils";
import { addpromotionBanner, updatepromotionBanner, getAllBeautician, getBeauticianServices } from "../../ApiServices";
import { toast } from "react-toastify";
import noImg from "../../assets/images/avatars/no_img.png";

const PromoBannerForm = () => {
  const { state } = useLocation();
  const [beautician, setBeautician] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
    setError,
    reset,
    control,
  } = useForm();
  const navigate = useNavigate();
  var [isLoading, setIsLoading] = useState(false);
  const [isupdate, setisupdate] = useState("");
  const [previewImage, setPreviewImage] = useState(noImg);
  var [defaultLoading, setdefaultLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllBeautician();
      setBeautician(response.data.info.beautician);

      if (state) {
        const { editdata, baseurl } = state;
        setisupdate(editdata._id);
        setValue("name", editdata.name);
        setValue("beautican_id", editdata.beautican_id);

        const get_data = await getBeauticianServices(editdata.beautican_id);
        if (get_data && get_data.data && get_data.data.info && get_data.data.info.service) {
          setServiceOptions(get_data.data.info.service);
        }

        setValue("service_id", editdata.service_id);
        setPreviewImage(baseurl + editdata.image);
      }

      setdefaultLoading(false);
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array since it runs once on mount

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
      ? addpromotionBanner(formData)
          .then(() => {
            localStorage.setItem("redirectSuccess", "true");
            localStorage.setItem("redirectMessage", "Added successfully!");
            navigate("/promoBanners");
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
      : updatepromotionBanner(formData, isupdate)
          .then(() => {
            localStorage.setItem("redirectSuccess", "true");
            localStorage.setItem("redirectMessage", "Updated successfully!");
            navigate("/promoBanners");
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
            <Link to="/promoBanners">Promotion Banner</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>{isupdate === "" ? "Add" : "Update"} Promotion Banner</CBreadcrumbItem>
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

              <CCol md={6}>
                <Controller
                  name="beautican_id"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Beautican is required" }}
                  render={({ field }) => (
                    <CustomSelectInput
                      label="Beautican"
                      options={beautician}
                      // onChange={(value) => field.onChange(value)}
                      onChange={async (value) => {
                        field.onChange(value);
                        const selectedBeautician = beautician.find((item) => item._id === value);
                        if (selectedBeautician) {
                          const all_data = await getBeauticianServices(selectedBeautician._id);
                          const services = all_data.data.info.service;
                          setServiceOptions(services); // Update service options
                          // Update service_id if there are no services available
                          if (services.length === 0) {
                            setValue("service_id", ""); // or any other default value
                          }
                        }
                      }}
                      value={field.value}
                      error={!!errors.beautican_id}
                      helperText={errors.beautican_id && errors.beautican_id.message}
                    />
                  )}
                />
              </CCol>

              <CCol md={6}>
                <Controller
                  name="service_id"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Service is required" }}
                  render={({ field }) => (
                    <CustomSelectInput
                      label="Service"
                      options={serviceOptions}
                      onChange={(value) => field.onChange(value)}
                      value={field.value}
                      error={!!errors.service_id}
                      helperText={errors.service_id && errors.service_id.message}
                    />
                  )}
                />
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

export default PromoBannerForm;
