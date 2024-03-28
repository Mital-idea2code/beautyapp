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
import { handleInputChange } from "../../components/formUtils";
import { updateUserPP, updateBeauticianPP, getGeneralSettings } from "../../ApiServices";
import { toast } from "react-toastify";
import CIcon from "@coreui/icons-react";
import { cilHandPointRight } from "@coreui/icons";
import { useUserState } from "../../context/UserContext";
import ReactQuill from "react-quill";
import "../../../node_modules/react-quill/dist/quill.snow.css";

const FaqForm = () => {
  var [isLoading, setIsLoading] = useState(false);
  var [isLoadingBeautician, setIsLoadingBeautician] = useState(false);
  var [defaultLoading, setdefaultLoading] = useState(true);
  var [id, setid] = useState(true);
  const { userRole } = useUserState();

  const {
    register,
    getValues,
    setValue,
    setError,
    handleSubmit,
    control,
    formState: { errors },
    clearErrors,
  } = useForm();

  const DefaultData = async () => {
    await getGeneralSettings()
      .then((response) => {
        setValue("user_pp", response.data.info.user_pp);
        setValue("beautician_pp", response.data.info.beautician_pp);
        setid(response.data.info._id);
        setdefaultLoading(false);
      })
      .catch(() => {
        setdefaultLoading(false);
      });
  };
  useEffect(() => {
    DefaultData();
  }, [setValue, getValues]);

  const onSubmitUser = (data) => {
    // if (userRole == 1) {
    // console.log(getValues());
    setIsLoading(true);
    updateUserPP(data, id)
      .then((response) => {
        if (response.data.isSuccess && response.data.status === 200) {
          setIsLoading(false);
          toast.success("Updated successfully!");
        } else {
          if ((response.data.status === 202 || 400) && !response.data.isSuccess) {
            Object.keys(response.data.message).forEach((key) => {
              // Set the error message for each field
              setError(key, {
                type: "manual",
                message: response.data.message[key],
              });
            });
            setIsLoading(false);
          }
        }
      })
      .catch((err) => {
        if ((err.response.data.status === 401 || 400) && !err.response.data.isSuccess)
          Object.keys(err.response.data.message).forEach((key) => {
            // Set the error message for each field
            setError(key, {
              type: "manual",
              message: err.response.data.message[key],
            });
          });
        setIsLoading(false);
      });
  };

  const onSubmitBeautician = (data) => {
    // if (userRole == 1) {
    // console.log(getValues());
    setIsLoadingBeautician(true);
    updateBeauticianPP(data, id)
      .then((response) => {
        if (response.data.isSuccess && response.data.status === 200) {
          setIsLoadingBeautician(false);
          toast.success("Updated successfully!");
        } else {
          if ((response.data.status === 202 || 400) && !response.data.isSuccess) {
            Object.keys(response.data.message).forEach((key) => {
              // Set the error message for each field
              setError(key, {
                type: "manual",
                message: response.data.message[key],
              });
            });
            setIsLoadingBeautician(false);
          }
        }
      })
      .catch((err) => {
        if ((err.response.data.status === 401 || 400) && !err.response.data.isSuccess)
          Object.keys(err.response.data.message).forEach((key) => {
            // Set the error message for each field
            setError(key, {
              type: "manual",
              message: err.response.data.message[key],
            });
          });
        setIsLoadingBeautician(false);
      });
  };
  return (
    <CRow>
      <CContainer fluid className="custom-header">
        <CBreadcrumb>
          <CBreadcrumbItem>
            <Link to="/dashboard">Home</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active> Settings</CBreadcrumbItem>
          <CBreadcrumbItem active>Privacy Policy</CBreadcrumbItem>
        </CBreadcrumb>
      </CContainer>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmitUser)}>
              <CCol md={12} className="form-header ">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;USER PRIVACY POLICY
                </div>
              </CCol>
              <CCol md={12}>
                <Controller
                  name="user_pp"
                  control={control}
                  defaultValue={getValues("user_pp")}
                  render={({ field }) => (
                    <ReactQuill
                      value={field.value || ""}
                      onChange={field.onChange}
                      style={{ height: "400px", border: "none" }}
                    />
                  )}
                />
              </CCol>

              <CCol xs={12} className="mt-5">
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
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmitBeautician)}>
              <CCol md={12} className="form-header ">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;BEAUTICIAN PRIVACY POLICY
                </div>
              </CCol>
              <CCol md={12}>
                <Controller
                  name="beautician_pp"
                  control={control}
                  defaultValue={getValues("beautician_pp")}
                  render={({ field }) => (
                    <ReactQuill
                      value={field.value || ""}
                      onChange={field.onChange}
                      style={{ height: "400px", border: "none" }}
                    />
                  )}
                />
              </CCol>

              <CCol xs={12} className="mt-5">
                {isLoadingBeautician ? (
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

export default FaqForm;
