import { userAppList } from "../../ApiServices";
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Icons from "@mui/icons-material";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Grid, IconButton } from "@mui/material";
import swal from "sweetalert";
import Switch from "@mui/material/Switch";
import { useUserState } from "../../context/UserContext";
import PropTypes from "prop-types";
import { CBreadcrumb, CBreadcrumbItem, CContainer, CButton } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilDollar } from "@coreui/icons";
import { CSpinner } from "@coreui/react";

const Appointments = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [datatableData, setdatatableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [baseurl, setbaseurl] = useState([]);
  const { userRole } = useUserState();

  const { state } = useLocation();
  const user_id = state.user_id;
  const user_name = state.user_name;

  const list = async () => {
    setIsLoading(true);
    await userAppList(user_id)
      .then((response) => {
        setIsLoading(false);
        setdatatableData(response.data.info.appointments);
        setbaseurl(response.data.info.baseUrl_user_profile);
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
    const redirectSuccess = localStorage.getItem("redirectSuccess");

    if (redirectSuccess === "true") {
      // The value was found in local storage, perform actions as needed
      toast.success(localStorage.getItem("redirectMessage"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Remove the value from local storage
      localStorage.removeItem("redirectSuccess");
    }
    list();
  }, []);
  const columns = [
    {
      name: "appointment_id",
      label: "Appointment ID",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (appointment_id) => {
          return <p className="appid-div">#{appointment_id}</p>;
        },
      },
    },
    {
      name: "user_name",
      label: "USER",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "beautician_name",
      label: "BEAUTICIAN",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "category_name",
      label: "CATEGORY",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "service_name",
      label: "SERVICE",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "app_date",
      label: "Appointment Date",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "app_time",
      label: "Appointment Time",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "amount",
      label: "Amount",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (price) => {
          return (
            <p>
              <CIcon icon={cilDollar} />
              {price}
            </p>
          );
        },
      },
    },
    {
      name: "status",
      label: "STATUS",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const { status } = datatableData[rowIndex];
          return (
            <div>
              {status === 0 && (
                <p className="pending_app">
                  <b>PENDING</b>
                </p>
              )}
              {status === 1 && (
                <p className="completed_app">
                  <b>COMPLETED</b>
                </p>
              )}
              {status === 2 && (
                <p className="cancelled_app">
                  <b>CANCELLED</b>
                </p>
              )}
              {status === 3 && (
                <p className="accepted_app">
                  <b>ACCEPTED</b>
                </p>
              )}
            </div>
          );
        },
      },
    },
    {
      name: "_id",
      label: "ACTION",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (value) => {
          return (
            <div>
              {" "}
              <Icons.RemoveRedEye
                className="viewIcon"
                onClick={() => {
                  const appointmentData = datatableData.find((data) => data.id === value);
                  navigate("/appointments/info", {
                    state: { app_id: value },
                  });
                }}
              />
            </div>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: false, // Disable checkbox selection
  };

  return (
    <div>
      <Grid container spacing={4} className="mb-5">
        <Grid item xs={12}>
          <ToastContainer />
          <CContainer fluid className="custom-header">
            <CBreadcrumb>
              <CBreadcrumbItem>
                <Link to="/dashboard">Home</Link>
              </CBreadcrumbItem>
              <CBreadcrumbItem>
                <Link to="/users">Users</Link>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>{user_name}'s Appointments</CBreadcrumbItem>
            </CBreadcrumb>
          </CContainer>
          {isLoading ? (
            <CSpinner className="theme-spinner-color" />
          ) : (
            <MUIDataTable data={datatableData} columns={columns} options={options} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};
export default Appointments;
