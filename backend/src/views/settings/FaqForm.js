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
import setValueFormHelper from "../../components/setValueFormHelper";
import { handleInputChange } from "../../components/formUtils";
import { addfaqs, updateFaq } from "../../ApiServices";
import { toast } from "react-toastify";
import noImg from "../../assets/images/avatars/no_img.png";

const FaqForm = () => {
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
    control,
  } = useForm();
  const navigate = useNavigate();
  var [isLoading, setIsLoading] = useState(false);
  const [isupdate, setisupdate] = useState("");
  const [previewImage, setPreviewImage] = useState(noImg);
  var [defaultLoading, setdefaultLoading] = useState(true);

  useEffect(() => {
    if (state) {
      const { editdata } = state;
      setisupdate(editdata._id);
      const fieldNames = ["question", "answer", "role"];
      setValueFormHelper({ setValue, setPreviewImage, state, fieldNames });
    }
    setdefaultLoading(false);
  }, []);

  const onSubmit = (data) => {
    setIsLoading(false);

    isupdate === ""
      ? addfaqs(data)
          .then(() => {
            localStorage.setItem("redirectSuccess", "true");
            localStorage.setItem("redirectMessage", "Added successfully!");
            navigate("/settings/faqs");
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
      : updateFaq(data, isupdate)
          .then(() => {
            localStorage.setItem("redirectSuccess", "true");
            localStorage.setItem("redirectMessage", "Updated successfully!");
            navigate("/settings/faqs");
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
          <CBreadcrumbItem>Settings</CBreadcrumbItem>
          <CBreadcrumbItem>
            <Link to="/settings/faqs">FAQs</Link>
          </CBreadcrumbItem>
          <CBreadcrumbItem active>{isupdate === "" ? "Add" : "Update"} FAQs</CBreadcrumbItem>
        </CBreadcrumb>
      </CContainer>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <CCol md={12}>
                <CustomInput
                  name="question"
                  type="text"
                  label="Question"
                  {...register("question", { required: "Question is required" })}
                  error={!!errors.question}
                  helperText={errors.question && errors.question.message}
                  defaultValue={getValues("question")}
                  onChange={(e) => handleInputChange("question", e.target.value, { clearErrors, setValue })}
                />
              </CCol>

              <CCol md={12}>
                <CustomInput
                  name="answer"
                  type="text"
                  label="Answer"
                  {...register("answer", { required: "Answer is required" })}
                  error={!!errors.answer}
                  helperText={errors.answer && errors.answer.message}
                  defaultValue={getValues("answer")}
                  onChange={(e) => handleInputChange("answer", e.target.value, { clearErrors, setValue })}
                />
              </CCol>

              <CCol md={12}>
                <Controller
                  name="role"
                  control={control}
                  defaultValue="" // Set your default value here if needed
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <CustomSelectInput
                      label="Role"
                      options={[
                        { _id: "1", title: "User" },
                        { _id: "2", title: "Beautician" },
                      ]}
                      onChange={(value) => field.onChange(value)}
                      value={field.value}
                      error={!!errors.role}
                      helperText={errors.role && errors.role.message}
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

export default FaqForm;
