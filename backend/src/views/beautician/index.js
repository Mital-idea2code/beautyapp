import { getAllBeautician, deleteBeautician, deleteMultBeautician, updateBeauticianStatus } from "../../ApiServices";
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
import { CBreadcrumb, CBreadcrumbItem, CContainer, CButton } from "@coreui/react";
import star from "../../assets/images/logo/star.png";
import no_profile from "../../assets/images/avatars/no_profile.jpeg";
import { CSpinner } from "@coreui/react";

const Beautician = () => {
  const [datatableData, setdatatableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [baseurl, setbaseurl] = useState([]);
  const { userRole } = useUserState();

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };

  const list = async () => {
    setIsLoading(true);
    await getAllBeautician()
      .then((response) => {
        setIsLoading(false);
        setdatatableData(response.data.info.beautician);
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
      label: "Image",
      options: {
        customBodyRender: (image) =>
          image ? (
            <img
              onClick={() => handleImageClick(baseurl + image)}
              src={baseurl + `${image}`}
              alt={image}
              style={{ height: "50px", width: "50px", borderRadius: "50%", textAlign: "center" }}
            />
          ) : (
            <img src={no_profile} alt={image} style={{ height: "50px", width: "50px", borderRadius: "50%" }} />
          ),
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "email",
      label: "Email ID",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "city",
      label: "City",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "_id",
      label: "TIMING",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value) => {
          const rowData = datatableData.find((data) => data._id === value);
          if (!rowData) {
            return null; // Handle case where rowData is undefined
          }
          return (
            <div>
              <p className="mb-0">
                {rowData.open_time} {rowData.open_time ? "to" : ""} {rowData.close_time}
              </p>
            </div>
          );
        },
      },
    },
    {
      name: "_id",
      label: "Rating",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const rowData = datatableData.find((data) => data._id === value);
          if (!rowData) {
            return null; // Handle case where rowData is undefined
          }

          return (
            <div>
              <p className="mb-0 text-center">
                {rowData.averageRating}&nbsp;
                <img src={star} />
                <br /> ({rowData.totalReviews} Reviews)
              </p>
            </div>
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
          const { status, _id } = datatableData[rowIndex];
          return (
            <Switch
              checked={status}
              onChange={() => {
                if (userRole == 1) {
                  const data = { id: _id, status: !status };
                  updateBeauticianStatus(data, _id)
                    .then(() => {
                      toast.success("status changed successfully!", {
                        key: data._id,
                      });
                      list();
                    })
                    .catch(() => {
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
          const rowData = datatableData.find((data) => data._id === value);
          return (
            <div>
              <CButton
                variant="outline"
                className="action-btn mr-5 info-btn mt-2"
                onClick={() => {
                  if (userRole == 1) {
                    navigate("/beauticians/info", {
                      state: { beauticianInfo: rowData, baseurl: baseurl },
                    });
                  } else {
                    toast.error(
                      "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                    );
                  }
                }}
              >
                Info
              </CButton>

              {/* <Icons.Delete
                  className="deleteIcon" 
                onClick={async () => {
                  if (userRole == 1) {
                    const confirm = await swal({
                      title: "Are you sure?",
                      text: "Are you sure that you want to delete this Beautician?",
                      icon: "warning",
                      buttons: ["No, cancel it!", "Yes, I am sure!"],
                      dangerMode: true,
                    });
                    if (confirm) {
                      deleteBeautician(value)
                        .then(() => {
                          toast.success("deleted successfully!", {
                            key: value,
                          });
                          list();
                        })
                        .catch(() => {
                          toast.error("something went wrong!", {
                            key: value,
                          });
                        });
                    }
                  } else {
                    toast.error(
                      "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                    );
                  }
                }}
              /> */}

              <CButton
                variant="outline"
                className="action-btn mr-5 service-btn  mt-2"
                onClick={() => {
                  if (userRole == 1) {
                    navigate("/beauticians/services", {
                      state: { beautician_id: rowData._id, beautician_name: rowData.name },
                    });
                  } else {
                    toast.error(
                      "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                    );
                  }
                }}
              >
                Services ({rowData.services.length})
              </CButton>

              <CButton
                variant="outline"
                className="action-btn review-btn mr-5 mt-2"
                onClick={() => {
                  if (userRole == 1) {
                    navigate("/beauticians/reviews", {
                      state: { beautician_id: rowData._id, beautician_name: rowData.name },
                    });
                  } else {
                    toast.error(
                      "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                    );
                  }
                }}
              >
                Reviews ({rowData.totalReviews})
              </CButton>
              <CButton
                variant="outline"
                className="action-btn app-btn mr-5  mt-2"
                onClick={() => {
                  if (userRole == 1) {
                    navigate("/beauticians/appointments", {
                      state: { beautician_id: rowData._id, beautician_name: rowData.name },
                    });
                  } else {
                    toast.error(
                      "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                    );
                  }
                }}
              >
                Appointments ({rowData.appointmentCount})
              </CButton>
            </div>
          );
        },
      },
    },
  ];

  const deleteMultiple = async (index) => {
    if (userRole == 1) {
      const ids = index.data.map(
        (index1) => datatableData.find((data, index2) => index2 === index1.dataIndex && data._id)._id
      );
      const confirm = await swal({
        title: "Are you sure?",
        text: "Are you sure that you want to delete this Beauticians?",
        icon: "warning",
        buttons: ["No, cancel it!", "Yes, I am sure!"],
        dangerMode: true,
      });

      if (confirm) {
        deleteMultBeautician(ids)
          .then(() => {
            list();
            toast.success("Deleted successfully!", {
              key: ids,
            });
          })
          .catch(() => {
            toast.error("Something went wrong!", {
              key: ids,
            });
          });
      }
    } else {
      toast.error(
        "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
      );
    }
  };

  const SelectedRowsToolbar = ({ selectedRows, data }) => {
    return (
      <div>
        <IconButton onClick={() => deleteMultiple(selectedRows, data)}>
          <Icons.Delete />
        </IconButton>
      </div>
    );
  };

  // const options = {
  //   customToolbarSelect: (selectedRows, data) => (
  //     <SelectedRowsToolbar selectedRows={selectedRows} data={data} columns={columns} datatableTitle="test" />
  //   ),
  // };
  const options = {
    selectableRows: false, // Disable checkbox selection
  };

  SelectedRowsToolbar.propTypes = {
    selectedRows: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
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
              <CBreadcrumbItem active>Beauticians</CBreadcrumbItem>
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

export default Beautician;
