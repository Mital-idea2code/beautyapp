import React from "react";

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsF,
  CLink,
} from "@coreui/react";
import {
  cilArrowRight,
  cilBasket,
  cilBell,
  cilChartPie,
  cilMoon,
  cilLaptop,
  cilPeople,
  cilSettings,
  cilSpeech,
  cilSpeedometer,
  cilUser,
  cilUserFollow,
} from "@coreui/icons";
import { getStyle, hexToRgba } from "@coreui/utils";
import CIcon from "@coreui/icons-react";

import { Box, Typography, Avatar, Grid, Paper } from "@mui/material";
import avatar1 from "src/assets/images/avatars/1.jpg";
import avatar2 from "src/assets/images/avatars/2.jpg";
import avatar3 from "src/assets/images/avatars/3.jpg";
import avatar4 from "src/assets/images/avatars/4.jpg";
import avatar5 from "src/assets/images/avatars/5.jpg";
import avatar6 from "src/assets/images/avatars/6.jpg";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import { CChartBar, CChartDoughnut, CChartLine, CChartPie, CChartPolarArea, CChartRadar } from "@coreui/react-chartjs";
import { DocsCallout } from "src/components";
import user from "../../assets/User.svg";
import beautician from "../../assets/Beautition.svg";
import category from "../../assets/Category.svg";
import services from "../../assets/Service.svg";
// Dummy data for appointments
const appointments = {
  mostCompleted: {
    name: "John Doe",
    profilePic:
      "https://sm.askmen.com/t/askmen_in/article/f/facebook-p/facebook-profile-picture-affects-chances-of-gettin_fr3n.1200.jpg",
    email: "johndoe@example.com",
  },
  counts: { Upcoming: 8, Pending: 5, Accepted: 15, Completed: 20, Cancelled: 3 },
};

const Dashboard = () => {
  const random = () => Math.round(Math.random() * 100);
  return (
    <>
      <CRow>
        {" "}
        <CCol xs={12} md={9}>
          <Box mb={3}>
            <Paper variant="outlined" className="top-performer-banner">
              <Box p={3} display="flex" alignItems="center" justifyContent="space-between">
                <Grid container spacing={3} style={{ flexWrap: "wrap" }}>
                  <Grid item xs={12} sm={6} md={4} className="user-image-container">
                    <img
                      src={appointments.mostCompleted.profilePic}
                      alt={appointments.mostCompleted.name}
                      className="dashboard-user"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={8} className="user-info-container">
                    <Typography className="color-white f-30 ">
                      Meet <b>{appointments.mostCompleted.name}</b>, our top-performing beautician!
                    </Typography>
                    <Typography variant="body2" className="banner-text color-white f-15">
                      With an exceptional record of completing and accepting appointments,{" "}
                      {appointments.mostCompleted.name} sets the standard for excellence in beauty services. Experience
                      the expertise and dedication that make {appointments.mostCompleted.name} a standout performer.
                    </Typography>

                    <Grid container spacing={3} style={{ display: "flex", flexWrap: "wrap" }}>
                      {Object.entries(appointments.counts).map(([type, count]) => (
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
                {/* Additional content here */}
              </Box>
            </Paper>
          </Box>
        </CCol>
        <CCol xs={12} md={3}>
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
                    data: [20, 80, 10, 5],
                  },
                ],
              }}
            />
          </Box>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} sm={6} lg={3}>
          <CWidgetStatsF
            className="mb-3"
            icon={<img src={user} alt="User Icon" className="user-icon" />}
            title="Total Users"
            value="556"
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
            value="200"
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
            value="12"
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
            value="650"
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
      </CRow>
    </>
  );
};

export default Dashboard;
