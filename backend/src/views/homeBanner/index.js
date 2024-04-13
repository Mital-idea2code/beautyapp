import { getAllBanner, updateBannerStatus } from "../../ApiServices";
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Icons from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { Grid, IconButton } from "@mui/material";
import swal from "sweetalert";
import Switch from "@mui/material/Switch";
import { useUserState } from "../../context/UserContext";
import PropTypes from "prop-types";
import { CBreadcrumb, CBreadcrumbItem, CContainer, CButton, CSpinner } from "@coreui/react";

const HomeBanner = () => {
  const [datatableData, setdatatableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [baseurl, setbaseurl] = useState([]);
  const { userRole } = useUserState();

  const list = async () => {
    setIsLoading(true);
    await getAllBanner()
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        setdatatableData(response.data.info.banner);
        setbaseurl(response.data.info.baseUrl);
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
      name: "image",
      label: "Home Banner",
      options: {
        customBodyRender: (image) =>
          image ? (
            <img
              src={baseurl + `${image}`}
              alt={image}
              style={{ height: "100px", width: "200px", textAlign: "center" }}
            />
          ) : (
            ""
          ),
      },
    },
    {
      name: "status",
      label: "STATUS",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const { status, _id } = datatableData[rowIndex];
          return (
            <Switch
              checked={status}
              onChange={() => {
                if (userRole == 1) {
                  const data = { id: _id, status: !status };
                  updateBannerStatus(data, _id)
                    .then((response) => {
                      if (response.status == 200) {
                        toast.success("status changed successfully!", {
                          key: data._id,
                        });
                        list();
                      } else {
                        toast.error("At least one banner must have the status set to enabled.", {
                          key: data._id,
                        });
                      }
                    })
                    .catch((err) => {
                      toast.error("something went wrong!", {
                        key: data._id,
                      });
                    });
                } else {
                  toast.error(
                    "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                  );
                }
              }}
            />
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
              <Icons.Edit
                className="editIcon"
                onClick={() => {
                  if (userRole == 1) {
                    const editdata = datatableData.find((data) => data._id === value);
                    navigate("/homebanner/manage", {
                      state: { editdata: editdata, baseurl: baseurl },
                    });
                  } else {
                    toast.error(
                      "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                    );
                  }
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
              <CBreadcrumbItem active>Home Banner</CBreadcrumbItem>
            </CBreadcrumb>
            <CButton
              className="theme-btn mt-minus-10"
              onClick={() => {
                if (userRole == 1) {
                  navigate("/homebanner/manage");
                } else {
                  toast.error(
                    "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                  );
                }
              }}
            >
              Add Home Banner
            </CButton>
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

export default HomeBanner;
