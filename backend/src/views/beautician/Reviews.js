import { getAllReviews, deleteReview } from "../../ApiServices";
import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Grid, IconButton } from "@mui/material";
import { useUserState } from "../../context/UserContext";
import { CBreadcrumb, CBreadcrumbItem, CContainer, CButton } from "@coreui/react";
import no_profile from "../../assets/images/avatars/no_profile.jpeg";
import star from "../../assets/images/logo/star.png";
import * as Icons from "@mui/icons-material";
import { CSpinner } from "@coreui/react";

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
    await getAllReviews(beautician_id)
      .then((response) => {
        setIsLoading(false);
        setdatatableData(response.data.info.reviews);
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
      name: "user_image",
      label: "Image",
      options: {
        customBodyRender: (user_image) =>
          user_image ? (
            <img
              onClick={() => handleImageClick(baseurl + user_image)}
              src={baseurl + `${user_image}`}
              alt={user_image}
              style={{ height: "50px", width: "50px", borderRadius: "50%", textAlign: "center" }}
            />
          ) : (
            <img src={no_profile} alt={image} style={{ height: "50px", width: "50px", borderRadius: "50%" }} />
          ),
      },
    },
    {
      name: "user_name",
      label: "Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "rate",
      label: "Rate",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <p className="pb-0">
                {value}&nbsp;
                <img src={star} />
              </p>
            </div>
          );
        },
      },
    },
    {
      name: "review",
      label: "Reviews",
      options: {
        filter: true,
        sort: true,
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
              <Icons.Delete
                className="deleteIcon"
                onClick={async () => {
                  if (userRole == 1) {
                    const confirm = await swal({
                      title: "Are you sure?",
                      text: "Are you sure that you want to delete this Review?",
                      icon: "warning",
                      buttons: ["No, cancel it!", "Yes, I am sure!"],
                      dangerMode: true,
                    });
                    if (confirm) {
                      deleteReview(value)
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
                <Link to="/beauticians">Beauticians</Link>
              </CBreadcrumbItem>
              <CBreadcrumbItem active>{beautician_name}'s Reviews</CBreadcrumbItem>
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
export default Services;
