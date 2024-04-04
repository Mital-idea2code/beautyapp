import { getAllCategory, deleteCategory, deleteMultCategory, updateCattatus } from "../../ApiServices";
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Icons from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import { Grid, CircularProgress, IconButton } from "@mui/material";
import swal from "sweetalert";
import Switch from "@mui/material/Switch";
import { useUserState } from "../../context/UserContext";
import PropTypes from "prop-types";
import { CBreadcrumb, CBreadcrumbItem, CContainer, CButton } from "@coreui/react";

const Category = () => {
  const [datatableData, setdatatableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [baseurl, setbaseurl] = useState([]);
  const { userRole } = useUserState();

  const list = async () => {
    setIsLoading(true);
    await getAllCategory()
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        setdatatableData(response.data.info.cat);
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
              src={baseurl + `${image}`}
              alt={image}
              style={{ height: "50px", width: "50px", borderRadius: "50%", textAlign: "center" }}
            />
          ) : (
            ""
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
                  updateCattatus(data, _id)
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
              <Icons.Edit
                className="editIcon"
                onClick={() => {
                  if (userRole == 1) {
                    const editdata = datatableData.find((data) => data._id === value);
                    navigate("/category/manage", {
                      state: { editdata: editdata, baseurl: baseurl },
                    });
                  } else {
                    toast.error(
                      "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                    );
                  }
                }}
              />
              <CButton
                variant="outline"
                className="action-btn mr-5 service-btn"
                onClick={() => {
                  if (userRole == 1) {
                    navigate("/category/services", {
                      state: { cat_id: rowData._id, cat_name: rowData.name },
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

              {/* <Icons.Delete
                  className="deleteIcon" 
                onClick={async () => {
                  if (userRole == 1) {
                    const confirm = await swal({
                      title: "Are you sure?",
                      text: "Are you sure that you want to delete this Categort?",
                      icon: "warning",
                      buttons: ["No, cancel it!", "Yes, I am sure!"],
                      dangerMode: true,
                    });
                    if (confirm) {
                      deleteCategory(value)
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
        text: "Are you sure that you want to delete this Categort?",
        icon: "warning",
        buttons: ["No, cancel it!", "Yes, I am sure!"],
        dangerMode: true,
      });

      if (confirm) {
        deleteMultCategory(ids)
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

  const options = {
    selectableRows: false, // Disable checkbox selection
  };

  // const options = {
  //   customToolbarSelect: (selectedRows, data) => (
  //     <SelectedRowsToolbar selectedRows={selectedRows} data={data} columns={columns} datatableTitle="test" />
  //   ),
  // };

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
              <CBreadcrumbItem active>Category</CBreadcrumbItem>
            </CBreadcrumb>
            <CButton
              className="theme-btn mt-minus-10"
              onClick={() => {
                if (userRole == 1) {
                  navigate("/category/manage");
                } else {
                  toast.error(
                    "Sorry, you do not have permission to access this feature.Please contact your administrator for assistance."
                  );
                }
              }}
            >
              Add Category
            </CButton>
          </CContainer>
          {isLoading ? (
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <CircularProgress size={26} fullWidth />
            </Grid>
          ) : (
            <MUIDataTable data={datatableData} columns={columns} options={options} />
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Category;
