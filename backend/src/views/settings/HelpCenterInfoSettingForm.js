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
import { handleInputChange } from "../../components/formUtils";
import { updatSupportData, getGeneralSettings } from "../../ApiServices";
import { toast } from "react-toastify";
import CIcon from "@coreui/icons-react";
import { cilHandPointRight } from "@coreui/icons";
import { useUserState } from "../../context/UserContext";

const FaqForm = () => {
  var [isLoading, setIsLoading] = useState(false);
  var [defaultLoading, setdefaultLoading] = useState(true);
  var [id, setid] = useState(true);
  const { userRole } = useUserState();

  const {
    register,
    getValues,
    setValue,
    setError,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  const DefaultData = async () => {
    await getGeneralSettings()
      .then((response) => {
        setValue("user_support_email", response.data.info.user_support_email);
        setValue("user_support_mono", response.data.info.user_support_mono);
        setValue("beautician_support_email", response.data.info.beautician_support_email);
        setValue("beautician_support_mono", response.data.info.beautician_support_mono);
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

  const onSubmit = (data) => {
    // if (userRole == 1) {
    // console.log(getValues());
    setIsLoading(true);
    updatSupportData(data, id)
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
    // } else {
    //   toast.error(
    //     'Sorry, you do not have permission to access this feature.Please contact your administrator for assistance.',
    //   )
    // }
  };

  return (
    <CRow>
      <CContainer fluid className="custom-header">
        <CBreadcrumb>
          <CBreadcrumbItem>
            <Link to="/dashboard">Home</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active> Settings</CBreadcrumbItem>
          <CBreadcrumbItem active>Help Center Info Settings</CBreadcrumbItem>
        </CBreadcrumb>
      </CContainer>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <CCol md={12} className="form-header ">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;USER SUPPORT INFO
                </div>
              </CCol>
              <CCol md={12}>
                <CustomInput
                  name="user_support_email"
                  type="email"
                  label="Email Id"
                  {...register("user_support_email", { required: "Email Id is required" })}
                  error={!!errors.user_support_email}
                  helperText={errors.user_support_email && errors.user_support_email.message}
                  defaultValue={getValues("user_support_email")}
                  onChange={(e) => handleInputChange("user_support_email", e.target.value, { clearErrors, setValue })}
                />
              </CCol>
              <CCol md={12}>
                <CustomInput
                  name="user_support_mono"
                  type="text"
                  label="Mobile Number"
                  {...register("user_support_mono", { required: "Mobile Number is required" })}
                  error={!!errors.user_support_mono}
                  helperText={errors.user_support_mono && errors.user_support_mono.message}
                  defaultValue={getValues("user_support_mono")}
                  onChange={(e) => handleInputChange("user_support_mono", e.target.value, { clearErrors, setValue })}
                />
              </CCol>

              <CCol md={12} className="form-header ">
                <div>
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;BEAUTICIAN SUPPORT INFO
                </div>
              </CCol>
              <CCol md={12}>
                <CustomInput
                  name="beautician_support_email"
                  type="email"
                  label="Email Id"
                  {...register("beautician_support_email", { required: "Email Id is required" })}
                  error={!!errors.beautician_support_email}
                  helperText={errors.beautician_support_email && errors.beautician_support_email.message}
                  defaultValue={getValues("beautician_support_email")}
                  onChange={(e) =>
                    handleInputChange("beautician_support_email", e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>
              <CCol md={12}>
                <CustomInput
                  name="beautician_support_mono"
                  type="text"
                  label="Mobile Number"
                  {...register("beautician_support_mono", { required: "Mobile Number is required" })}
                  error={!!errors.beautician_support_mono}
                  helperText={errors.beautician_support_mono && errors.beautician_support_mono.message}
                  defaultValue={getValues("beautician_support_mono")}
                  onChange={(e) =>
                    handleInputChange("beautician_support_mono", e.target.value, { clearErrors, setValue })
                  }
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

export default FaqForm;
