import { getBeauticianServices, updateServiceStatus } from "../../ApiServices";
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Icons from "@mui/icons-material";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Grid, CircularProgress, IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useUserState } from "../../context/UserContext";
import { CBreadcrumb, CBreadcrumbItem, CContainer, CButton } from "@coreui/react";
import GalleryDialog from "./GalleryDialog";

const Services = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const [datatableData, setdatatableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [baseurl, setbaseurl] = useState([]);
  const { userRole } = useUserState();

  const { state } = useLocation();
  const beautician_id = state.beautician_id;
  const beautician_name = state.beautician_name;

  const handleGalleryButtonClick = (images) => {
    setSelectedImages(images);
    setDialogOpen(true);
  };

  const list = async () => {
    setIsLoading(true);
    await getBeauticianServices(beautician_id)
      .then((response) => {
        setIsLoading(false);
        setdatatableData(response.data.info.service);
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

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, "_blank");
  };
  const columns = [
    {
      name: "display_image",
      label: "Image",
      options: {
        customBodyRender: (display_image) =>
          display_image ? (
            <img
              onClick={() => handleImageClick(baseurl + display_image)}
              src={baseurl + `${display_image}`}
              alt={display_image}
              style={{ height: "50px", width: "50px", borderRadius: "50%", textAlign: "center" }}
            />
          ) : (
            ""
          ),
      },
    },
    {
      name: "cat_name",
      label: "Category",
      options: {
        filter: true,
        sort: true,
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
      name: "price",
      label: "Price",
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
                  updateServiceStatus(data, _id)
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
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          const rowData = datatableData.find((data) => data._id === value);
          const gallary_img = rowData.work_images;
          console.log(gallary_img);
          return (
            <>
              {/* Your existing code here */}

              {/* Gallery Images Button */}
              <CButton
                color="primary"
                variant="outline"
                className="action-btn mr-5"
                onClick={() => handleGalleryButtonClick(gallary_img)}
              >
                Gallery Images
              </CButton>

              {/* Gallery Dialog */}
              <GalleryDialog
                open={dialogOpen}
                handleClose={() => setDialogOpen(false)}
                images={selectedImages}
                baseurl={baseurl}
              />
            </>
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
                <Link to="/beauticians">Beauticians</Link>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>{beautician_name}'s Services</CBreadcrumbItem>
            </CBreadcrumb>
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
export default Services;
