import { AppInfo } from "../../ApiServices";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { CCard, CCardBody, CCardImage, CCardTitle, CCardText, CCol, CRow, CSpinner } from "@coreui/react";
import { cilCalendar, cilDollar, cilHandPointRight, cilMoney, cilWatch } from "@coreui/icons";
import { Rating } from "@mui/material";
import CIcon from "@coreui/icons-react";
import { useUserState } from "../../context/UserContext";
import no_profile from "../../assets/images/avatars/no_profile.jpeg";
import noImg from "../../assets/images/avatars/no_img.png";

const Accepted = () => {
  const [isLoading, setIsLoading] = useState(false);
  var [defaultLoading, setdefaultLoading] = useState(true);
  const navigate = useNavigate();
  var [userImg, setUserImg] = useState(no_profile);
  var [beauImg, setBeauticianImg] = useState(no_profile);
  var [serviceImg, setServiceImg] = useState(noImg);
  const { userRole } = useUserState();
  const { state } = useLocation();
  const [appointment, setAppointment] = useState(null);

  const info = async () => {
    setIsLoading(true);
    await AppInfo(state.app_id)
      .then((response) => {
        setIsLoading(false);
        setAppointment(response.data.info.appointments);

        const user_Img = response.data.info.appointments.user_image
          ? `${response.data.info.baseUrl_user_profile}/${response.data.info.appointments.user_image}`
          : no_profile;
        setUserImg(user_Img);

        const beautician_Img = response.data.info.appointments.beautician_image
          ? `${response.data.info.baseUrl_beautician}/${response.data.info.appointments.beautician_image}`
          : no_profile;
        setBeauticianImg(beautician_Img);

        const service_Img = response.data.info.appointments.service_display_image
          ? `${response.data.info.baseUrl_service}/${response.data.info.appointments.service_display_image}`
          : no_profile;
        setServiceImg(service_Img);

        setdefaultLoading(false);
      })
      .catch((err) => {
        if (!err.response.data.isSuccess) {
          if (err.response.data.status === 401) {
            toast.error(err.response.data.message);
            setIsLoading(false);
          } else {
            console.log(err.response.data, "else");
          }
        }
      });
  };

  useEffect(() => {
    info();
  }, []);

  return (
    <CRow>
      <CCol xs={12} md={12}>
        <CCard className="mb-4">
          {defaultLoading ? (
            <CSpinner className="theme-spinner-color" />
          ) : (
            <CCardBody>
              <CRow>
                <CCol md={3} xs={12} className="mb-4">
                  <div className="app-header">APPOINTMENT ID : &nbsp;#{appointment.appointment_id} </div>
                </CCol>
                <CCol md={6} xs={12}></CCol>

                <CCol md={3} xs={12}>
                  {appointment.status === 0 ? (
                    <div className="app_pending_style">PENDING</div>
                  ) : appointment.status === 1 ? (
                    <div className="app_complete_style">COMPLETED</div>
                  ) : appointment.status === 2 ? (
                    <div className="app_cancel_style">CANCELLED</div>
                  ) : (
                    <div className="app_accepted_style">ACCEPTED</div>
                  )}
                </CCol>
              </CRow>

              <CRow>
                <CCol xs={12} md={4} className="mb-4">
                  <div className="info-header left-data">
                    <div className="text-container">
                      <CIcon icon={cilHandPointRight} />
                      &nbsp;&nbsp;SERVICE INFO
                    </div>
                  </div>
                  <div className="">
                    <CCard className="mb-3" style={{ maxWidth: "540px" }}>
                      <CRow className="g-0">
                        <CCol md={4}>
                          <CCardImage src={serviceImg} className="info-card-img" />
                        </CCol>
                        <CCol md={8}>
                          <CCardBody>
                            <CCardTitle>
                              <b>{appointment.service_name}</b>
                            </CCardTitle>
                            <CCardText className="mb-0">
                              <p className="mb-0">{appointment.category_name}</p>
                              <p>
                                <b>
                                  <CIcon icon={cilDollar} />
                                  {appointment.amount}
                                </b>
                              </p>
                            </CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                  </div>
                </CCol>
                <CCol xs={12} md={4} className="mb-4">
                  <div className="info-header left-data">
                    <div className="text-container">
                      <CIcon icon={cilHandPointRight} />
                      &nbsp;&nbsp;USER INFO
                    </div>
                  </div>

                  <div className="">
                    <CCard className="mb-3" style={{ maxWidth: "540px" }}>
                      <CRow className="g-0">
                        <CCol md={4}>
                          <CCardImage src={userImg} className="info-card-img" />
                        </CCol>
                        <CCol md={8}>
                          <CCardBody>
                            <CCardTitle>
                              <b>{appointment.user_name}</b>
                            </CCardTitle>
                            <CCardText className="mb-0">
                              <p className="mb-0">{appointment.user_email}</p>
                              <p>{appointment.user_mo_no}</p>
                            </CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                  </div>
                </CCol>

                <CCol xs={12} md={4} className="mb-4">
                  <div className="info-header left-data">
                    <div className="text-container">
                      <CIcon icon={cilHandPointRight} />
                      &nbsp;&nbsp;BEAUTICIAN INFO
                    </div>
                  </div>

                  <div className="">
                    <CCard className="mb-3" style={{ maxWidth: "540px" }}>
                      <CRow className="g-0">
                        <CCol md={4}>
                          <CCardImage src={beauImg} className="info-card-img" />
                        </CCol>
                        <CCol md={8}>
                          <CCardBody>
                            <CCardTitle>
                              <b>{appointment.beautician_name}</b>
                            </CCardTitle>
                            <CCardText className="mb-0">
                              <p className="mb-0">{appointment.beautician_email}</p>
                              <p>{appointment.beautician_address}</p>
                            </CCardText>
                          </CCardBody>
                        </CCol>
                      </CRow>
                    </CCard>
                  </div>
                </CCol>
              </CRow>

              <CCol md={12} className="mb-4">
                <div className="info-header">
                  <CIcon icon={cilHandPointRight} />
                  &nbsp;&nbsp;APPOINTMENT SCHEDULE INFO
                </div>
                <div className="p-12">
                  <CRow>
                    <CCol xs={12} md={4}>
                      <p className="mb-2 appdatediv">
                        {" "}
                        <span>
                          <CIcon icon={cilCalendar} /> &nbsp; Date :{" "}
                        </span>
                        <span>{appointment.app_date}</span>
                      </p>
                    </CCol>
                    <CCol xs={12} md={4}>
                      <p className="mb-2 appdatediv">
                        <span>
                          {" "}
                          <CIcon icon={cilWatch} /> &nbsp; Time:{" "}
                        </span>
                        <span>{appointment.app_time}</span>
                      </p>
                    </CCol>
                    <CCol xs={12} md={4}>
                      <p className="mb-2 appdatediv">
                        <span>
                          {" "}
                          <CIcon icon={cilMoney} /> &nbsp; Amount:{" "}
                        </span>
                        <span>
                          <CIcon icon={cilDollar} />
                          {appointment.amount}
                        </span>
                      </p>
                    </CCol>
                  </CRow>
                </div>
              </CCol>

              {appointment.status == 2 ? (
                <CCol md={12} className="mb-4">
                  <div className="info-header">
                    <CIcon icon={cilHandPointRight} />
                    &nbsp;&nbsp;CANCELLATION REASON
                  </div>
                  <div className="appdetail-div">
                    <CRow>
                      <CCol xs={12} md={12}>
                        <p className="mb-2">
                          {" "}
                          <span>{appointment.cancel_reason ? appointment.cancel_reason : "No Reason Available"}</span>
                        </p>
                      </CCol>
                    </CRow>
                  </div>
                </CCol>
              ) : (
                ""
              )}

              {appointment.status == 1 ? (
                <CCol md={12} className="mb-4">
                  <div className="info-header">
                    <CIcon icon={cilHandPointRight} />
                    &nbsp;&nbsp;REVIEW & RATING
                  </div>
                  <div className="appdetail-div">
                    <CRow>
                      <CCol xs={12} md={12}>
                        <p className="mb-2">
                          {" "}
                          <span>{appointment.review ? appointment.review : "No Review"}</span>
                        </p>
                        <p className="mb-2">
                          {" "}
                          <Rating value={appointment.rate} readOnly />
                        </p>
                      </CCol>
                    </CRow>
                  </div>
                </CCol>
              ) : (
                ""
              )}
            </CCardBody>
          )}
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Accepted;
