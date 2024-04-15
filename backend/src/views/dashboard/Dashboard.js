import React, { useEffect, useState } from "react";
import { getDashboardCount, getTopBeauticianData, getTopUserData, topUpcomingAppList } from "../../ApiServices";
import { CCardHeader, CCol, CRow, CWidgetStatsF, CWidgetStatsC, CLink, CContainer } from "@coreui/react";
import { cilArrowRight } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Typography, Grid, Paper, Card, CardContent } from "@mui/material";
import { CChartDoughnut } from "@coreui/react-chartjs";
import user from "../../assets/icons/user.svg";
import beautician from "../../assets/icons/beautition.svg";
import category from "../../assets/icons/category.svg";
import services from "../../assets/icons/service.svg";
import pending from "../../assets/icons/pending.svg";
import accepted from "../../assets/icons/accepted.svg";
import completed from "../../assets/icons/completed.svg";
import cancelled from "../../assets/icons/cancelled.svg";
import no_profile from "../../assets/images/avatars/no_profile.jpeg";
import default_img from "../../assets/images/avatars/no_image.jpg";
import { CSpinner } from "@coreui/react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [allCount, setAllCount] = useState(null);
  const [topBeautician, setTopBeautician] = useState(null);
  const [topUser, setTopUser] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const [countLoading, setCountLoading] = useState(true);
  const [topBeautiLoading, setTopBeautiLoading] = useState(true);
  const [topUserLoading, setTopUserLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [serviceUrl, setServiceUrl] = useState(true);

  const getAllCount = async () => {
    try {
      const response = await getDashboardCount();
      const newAllCount = response.data.info;
      setAllCount(newAllCount);
      setCountLoading(false);
    } catch (err) {
      if (!err.response.data.isSuccess) {
        if (err.response.data.status === 401) {
          toast.error(err.response.data.message);
        } else {
          console.log(err.response.data, "else");
        }
      }
    }
  };

  const TopBeauticianData = async () => {
    try {
      const response = await getTopBeauticianData();
      const beauticianData = response.data.info;
      setTopBeautician(beauticianData);
      setTopBeautiLoading(false);
    } catch (err) {
      if (!err.response.data.isSuccess) {
        if (err.response.data.status === 401) {
          toast.error(err.response.data.message);
        } else {
          console.log(err.response.data, "else");
        }
      }
    }
  };

  const TopUserData = async () => {
    try {
      const response = await getTopUserData();
      const userData = response.data.info;
      setTopUser(userData);
      setTopUserLoading(false);
    } catch (err) {
      if (!err.response.data.isSuccess) {
        if (err.response.data.status === 401) {
          toast.error(err.response.data.message);
        } else {
          console.log(err.response.data, "else");
        }
      }
    }
  };

  const upcomingList = async () => {
    try {
      const response = await topUpcomingAppList();
      const appData = response.data.info.appointments;
      setUpcoming(appData);
      setServiceUrl(response.data.info.baseUrl_service);
      setUpcomingLoading(false);
    } catch (err) {
      if (!err.response.data.isSuccess) {
        if (err.response.data.status === 401) {
          toast.error(err.response.data.message);
        } else {
          console.log(err.response.data, "else");
        }
      }
    }
  };

  useEffect(() => {
    getAllCount();
    TopBeauticianData();
    TopUserData();
    upcomingList();
  }, []);

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
  return (
    <>
      <CRow>
        {" "}
        <CCol xs={12} md={9}>
          <Box mb={3}>
            {topBeautiLoading ? (
              <CSpinner className="theme-spinner-color" />
            ) : (
              <Paper variant="outlined" className="top-performer-banner">
                <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
                  {topBeautician ? (
                    <Grid container spacing={3} style={{ flexWrap: "wrap" }}>
                      {topBeautician && topBeautician.topCount > 0 ? (
                        <>
                          <Grid item xs={12} sm={6} md={4} className="user-image-container">
                            <img
                              src={
                                topBeautician.image ? `${topBeautician.baseUrl}/${topBeautician.image}` : default_img
                              }
                              alt={topBeautician.name}
                              className="dashboard-user"
                            />
                          </Grid>{" "}
                        </>
                      ) : (
                        <Typography variant="body2" className="color-white"></Typography>
                      )}
                      <Grid item xs={12} sm={6} md={8} className="user-info-container">
                        {topBeautician && topBeautician.topCount > 0 ? (
                          <>
                            <Typography className="color-white f-30 ">
                              Meet{" "}
                              <CLink
                                className="cursor-pointer"
                                onClick={() =>
                                  navigate("/beauticians/appointments", {
                                    state: { beautician_id: topBeautician._id, beautician_name: topBeautician.name },
                                  })
                                }
                              >
                                <b className="color-white">{topBeautician.name}</b>
                              </CLink>
                              , our top-performing beautician!
                            </Typography>
                            <Typography variant="body2" className="banner-text color-white f-15">
                              With an exceptional record of completing and accepting appointments, {topBeautician.name}{" "}
                              sets the standard for excellence in beauty services. Experience the expertise and
                              dedication that make {topBeautician.name} a standout performer.
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2" className="color-white"></Typography>
                        )}
                        <Grid container spacing={3} style={{ display: "flex", flexWrap: "wrap" }}>
                          {Object.entries(topBeautician.counts).map(([type, count]) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={2}
                              key={type}
                              style={{ width: "100%" }}
                              className="inline-grid-item"
                            >
                              <Paper variant="outlined" className="count-item">
                                <Box p={2}>
                                  <Typography variant="subtitle1" className="count-type">
                                    {type}
                                  </Typography>
                                  <Typography variant="subtitle2" className="count-number top-counts">
                                    {count}
                                  </Typography>
                                </Box>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography variant="body2" className="color-white">
                      No Data Found
                    </Typography>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </CCol>
        <CCol xs={12} md={3}>
          {countLoading ? (
            <CSpinner className="theme-spinner-color" />
          ) : (
            <Box mb={3} className="dchart-style">
              <CCardHeader className="text-center">
                <b>Total Appointments</b>
              </CCardHeader>
              <CChartDoughnut
                data={{
                  labels: ["Pending", "Accepted", "Completed", "Cancelled"],
                  datasets: [
                    {
                      backgroundColor: ["#f9b115", "cornflowerblue", "#41B883", "#DD1B16"],
                      data: [
                        allCount.pendingCount,
                        allCount.acceptedCount,
                        allCount.completedCount,
                        allCount.cancelledCount,
                      ],
                    },
                  ],
                }}
              />
            </Box>
          )}
        </CCol>
      </CRow>
      {countLoading ? (
        <CSpinner className="theme-spinner-color" />
      ) : (
        <CRow>
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              icon={<img src={user} alt="User Icon" className="user-icon" />}
              title="Total Users"
              value={allCount.userCount}
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="users"
                  rel="noopener norefferer"
                  target="_blank"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
            />
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              icon={<img src={beautician} alt="User Icon" className="user-icon" />}
              title="Total Beauticians"
              value={allCount.beauticianCount}
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="beauticians"
                  rel="noopener norefferer"
                  target="_blank"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
            />
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              icon={<img src={category} alt="User Icon" className="user-icon" />}
              title="Total Category"
              value={allCount.CategoryCount}
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="category"
                  rel="noopener norefferer"
                  target="_blank"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
            />
          </CCol>
          <CCol xs={12} sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              icon={<img src={services} alt="User Icon" className="user-icon  p-0" />}
              title="Total Services"
              value={allCount.ServiceCount}
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="services"
                  rel="noopener norefferer"
                  target="_blank"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
            />
          </CCol>
        </CRow>
      )}

      <CRow>
        {" "}
        <CCol xs={12} md={4}>
          <Grid container spacing={4} className="mb-5">
            <Grid item xs={12}>
              <CContainer fluid className="upcoming-header">
                <b>Upcoming Appointments</b>
                <CLink
                  className="color-white cursor-pointer"
                  onClick={() => {
                    navigate("/appointments/upcoming");
                  }}
                >
                  See All
                </CLink>
              </CContainer>{" "}
              {upcomingLoading ? (
                <CSpinner className="theme-spinner-color" />
              ) : upcoming && upcoming.length > 0 ? (
                upcoming.map((appointment) => (
                  <Card key={appointment._id} className="mb-10 card-shadow">
                    <CCardHeader>
                      <div className="headerContent">
                        <Typography className="title theme-color" gutterBottom>
                          Appointment ID: #{appointment.appointment_id}
                        </Typography>
                        <Typography className="dateTime theme-color">
                          {appointment.app_date}, {appointment.app_time}
                        </Typography>
                      </div>
                    </CCardHeader>
                    <CardContent className="cardContent">
                      <div className="leftContent">
                        <img
                          src={`${serviceUrl}/${appointment.service_display_image}`}
                          alt={appointment.service_name}
                          className="profileImg"
                        />
                      </div>
                      <div className="rightContent">
                        <Typography variant="h5" component="h2">
                          {appointment.user_name}
                        </Typography>
                        <Typography className="pos" color="textSecondary">
                          Beautician: {appointment.beautician_name}
                        </Typography>
                        <div className="contentWrapper">
                          <div className="leftContent1">
                            <Typography variant="body2" component="p">
                              {appointment.service_name}
                              <br />
                              <b>${appointment.amount}</b>
                              <br />
                            </Typography>
                          </div>
                          <div className="rightContent1">
                            <Typography
                              variant="body2"
                              component="p"
                              className={appointment.status === 0 ? "pending_app" : "accepted_app"}
                            >
                              {appointment.status === 0 ? "Pending" : "Accepted"}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" className="theme-color text-center">
                  No Data Found
                </Typography>
              )}
            </Grid>
          </Grid>
        </CCol>
        <CCol xs={12} md={4} className="mt-22">
          {countLoading ? (
            <CSpinner className="theme-spinner-color" />
          ) : (
            <CRow>
              <CCol sm={6} md={6}>
                <CWidgetStatsC
                  icon={<img src={pending} alt="Pending Appointments" className="user-icon" />}
                  value={allCount.pendingCount}
                  title="Total Pending Appointments"
                  className="mb-4 f-14 card-shadow"
                />
              </CCol>
              <CCol sm={6} md={6}>
                <CWidgetStatsC
                  icon={<img src={accepted} alt="Accepted Appointments" className="user-icon" />}
                  value={allCount.acceptedCount}
                  title="Total Accepted Appointments"
                  className="mb-4 f-14 card-shadow"
                />
              </CCol>
              <CCol sm={6} md={6}>
                <CWidgetStatsC
                  icon={<img src={completed} alt="Completed Appointments" className="user-icon" />}
                  value={allCount.completedCount}
                  title="Total Completed Appointments"
                  className="mb-4 f-14 card-shadow"
                />
              </CCol>
              <CCol sm={6} md={6}>
                <CWidgetStatsC
                  icon={<img src={cancelled} alt="Cancelled Appointments" className="user-icon" />}
                  value={allCount.cancelledCount}
                  title="Total Cancelled Appointments"
                  className="mb-4 f-14 card-shadow"
                />
              </CCol>
            </CRow>
          )}
        </CCol>
        <CCol xs={12} md={4}>
          {topUserLoading ? (
            <CSpinner className="theme-spinner-color" />
          ) : (
            <Card className="mb-10 mt-2 card-shadow">
              <CardContent className="text-center">
                <img src={topUser.image ? `${topUser.baseUrl}/${topUser.image}` : no_profile} className="top-user" />
                <Typography variant="body1" component="div" className="mb-15">
                  {topUser.email}
                </Typography>
                {topUser && topUser.topCount > 0 ? (
                  <>
                    <Typography variant="h5" component="div" className="mb-15">
                      Meet{" "}
                      <CLink
                        className="cursor-pointer"
                        onClick={() =>
                          navigate("/user/appointments", {
                            state: { user_id: topUser._id, user_name: topUser.name },
                          })
                        }
                      >
                        <b className="theme-color">{topUser.name}</b>
                      </CLink>
                      , Our Most Engaged User!
                    </Typography>
                    <Typography variant="body1">
                      {topUser.name} has clinched the top spot by diligently scheduling and completing the most
                      appointments on Glam Spot!
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" className="theme-color text-center">
                    No Data Found
                  </Typography>
                )}
                <br />
              </CardContent>
            </Card>
          )}
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
