import React, { useState, useEffect } from "react";
import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CRow, CFormLabel, CSpinner } from "@coreui/react";
import { useForm, Controller } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { handleInputChange, handleFileInputChange } from "../../components/formUtils";
import noImg from "../../assets/images/avatars/no_img.png";
import { useUserState, useUserDispatch, updateUser } from "../../context/UserContext";

const Profile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
  } = useForm();
  var [isLoading, setIsLoading] = useState(false);
  var [defaultLoading, setdefaultLoading] = useState(true);
  const { userRole, user } = useUserState();
  // console.log(user)
  const [previewImage, setPreviewImage] = useState(noImg);
  var dispatch = useUserDispatch();
  useEffect(() => {
    if (user) {
      setValue("name", user.username);
      setValue("email", user.useremail);
      setPreviewImage(user.userimage);
      setdefaultLoading(false);
    }
  }, []);

  const onSubmit = async (data) => {
    updateUser(dispatch, data, setIsLoading);
  };

  return (
    <CRow>
      <CCol xs={12} md={6}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Update Profile</strong>
          </CCardHeader>
          {defaultLoading ? (
            <p>Loading...</p>
          ) : (
            <CCardBody>
              <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(onSubmit)}>
                <CCol md={6}>
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

                <CCol md={6}>
                  <CustomInput
                    name="email"
                    type="text"
                    label="Email"
                    {...register("email", { required: "Email is required" })}
                    error={!!errors.email}
                    helperText={errors.email && errors.email.message}
                    defaultValue={getValues("email")}
                    readOnly={true}
                    disabled={true}
                    onChange={(e) => handleInputChange("email", e.target.value, { clearErrors, setValue })}
                  />
                </CCol>

                <CCol md={12} className="d-fex">
                  <CustomInput
                    name="image"
                    type="file"
                    label="image"
                    style={{ width: "100%" }}
                    {...register("image")}
                    defaultValue={getValues("image")}
                    onChange={(e) => handleFileInputChange(e, "image", { clearErrors, setValue, setPreviewImage })}
                  />
                  {previewImage ? <img src={previewImage} className="img-preview" /> : ""}
                </CCol>

                {/* <CCol md={6}>
                <CustomInput
                  name="mo_no"
                  type="text"
                  label="Mobile No"
                  {...register('mo_no', { required: 'Mobile No is required' })}
                  error={!!errors.mo_no}
                  helperText={errors.mo_no && errors.mo_no.message}
                  defaultValue={getValues('mo_no')}
                  onChange={(e) =>
                    handleInputChange('mo_no', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={6}>
                <CustomInput
                  name="mo_no"
                  type="text"
                  label="Whatsapp No"
                  {...register('mo_no', { required: 'Mobile No is required' })}
                  error={!!errors.mo_no}
                  helperText={errors.mo_no && errors.mo_no.message}
                  defaultValue={getValues('mo_no')}
                  onChange={(e) =>
                    handleInputChange('mo_no', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={6}>
                <CustomInput
                  name="experience"
                  type="text"
                  label="Experience (Years)"
                  {...register('experience', { required: 'Experience is required' })}
                  error={!!errors.experience}
                  helperText={errors.experience && errors.experience.message}
                  defaultValue={getValues('experience')}
                  onChange={(e) =>
                    handleInputChange('experience', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={6}>
                <CustomInput
                  name="specialist"
                  type="text"
                  label="Specialist"
                  {...register('specialist', { required: 'Specialist is required' })}
                  error={!!errors.specialist}
                  helperText={errors.specialist && errors.specialist.message}
                  defaultValue={getValues('specialist')}
                  onChange={(e) =>
                    handleInputChange('specialist', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={6}>
                <CustomInput
                  name="work_place"
                  type="text"
                  label="Work Place Name"
                  {...register('work_place', { required: 'Work Place Name is required' })}
                  error={!!errors.work_place}
                  helperText={errors.work_place && errors.work_place.message}
                  defaultValue={getValues('work_place')}
                  onChange={(e) =>
                    handleInputChange('work_place', e.target.value, { clearErrors, setValue })
                  }
                />
              </CCol>

              <CCol md={6}>
                <CustomInput
                  name="work_place_address"
                  type="text"
                  label="Work Place Address"
                  {...register('work_place_address', {
                    required: 'Work Place Address is required',
                  })}
                  error={!!errors.work_place_address}
                  helperText={errors.work_place_address && errors.work_place_address.message}
                  defaultValue={getValues('work_place_address')}
                  onChange={(e) =>
                    handleInputChange('work_place_address', e.target.value, {
                      clearErrors,
                      setValue,
                    })
                  }
                />
              </CCol> */}

                <CCol xs={12}>
                  {isLoading ? (
                    <CSpinner className="theme-spinner-color" />
                  ) : (
                    <CButton color="primary" type="submit" className="theme-btn-background">
                      Update
                    </CButton>
                  )}
                </CCol>
              </CForm>
            </CCardBody>
          )}
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Profile;
