import React, { useState, useEffect } from "react";
import { CCard, CCardBody, CCardHeader, CCol, CRow, CListGroup, CListGroupItem, CImage, CBadge } from "@coreui/react";
import { FaPhone, FaWhatsapp, FaEnvelope, FaUser, FaMapMarked, FaBuilding, FaCalendar, FaClock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import star from "../../assets/images/logo/star.png";
import noImg from "../../assets/images/avatars/no_img.png";
import no_profile from "../../assets/images/avatars/no_profile.jpeg";

const Info = () => {
  var [defaultLoading, setdefaultLoading] = useState(true);
  var [Image, setImage] = useState(noImg);
  var [bannerImage, setBannerImage] = useState(noImg);
  var [wDays, setWDays] = useState(null);

  const { state } = useLocation();

  useEffect(() => {
    const user_Img = state.beauticianInfo.image ? `${state.baseurl}/${state.beauticianInfo.image}` : no_profile;
    const banner_Img = state.beauticianInfo.banner ? `${state.baseurl}/${state.beauticianInfo.banner}` : noImg;
    setImage(user_Img);
    setBannerImage(banner_Img);
    const workingDaysString = state.beauticianInfo.days;

    const workingDaysArray = state.beauticianInfo.days.map(Number);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const workingDaysNames = workingDaysArray.map((dayNumber) => daysOfWeek[dayNumber - 1]);
    setWDays(workingDaysNames.join(", "));

    setdefaultLoading(false);
  }, []);

  return (
    <CRow>
      <CCol lg={4}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex align-items-center bg-light">
            <CImage src={Image} alt="Profile" className="rounded-circle mr-3" height="100px" width="100px" />
            <div className="d-flex flex-column p-20">
              <h4 className="mb-0">{state.beauticianInfo.name}</h4>
              <p className="mb-0 color-grey">
                <span className="mr-1">{state.beauticianInfo.averageRating}</span>
                <img src={star} alt="Star" className="rating-star mt-minus-4" /> &nbsp;
                <span className="ml-1">({state.beauticianInfo.totalReviews} Reviews)</span>
              </p>
            </div>
          </CCardHeader>
          <CCardBody className="text-center">
            <CImage src={bannerImage} alt="Banner" className="img-fluid mb-3" />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg={8}>
        <CCard className="mb-4">
          <CCardHeader className="dr_header_bg">Contact Information</CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem>
                <strong>
                  <FaUser /> Full Name:
                </strong>{" "}
                {state.beauticianInfo.name}
              </CListGroupItem>
              <CListGroupItem>
                <strong>
                  <FaEnvelope /> Email:
                </strong>{" "}
                {state.beauticianInfo.email}
              </CListGroupItem>
              <CListGroupItem>
                <strong>
                  <FaMapMarked /> Address:
                </strong>{" "}
                {state.beauticianInfo.address}
              </CListGroupItem>
              <CListGroupItem>
                <strong>
                  <FaBuilding /> City:
                </strong>{" "}
                {state.beauticianInfo.city}
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>

        <CCard className="mb-4">
          <CCardHeader className="dr_header_bg">Availability Information</CCardHeader>
          <CCardBody>
            <CListGroup flush>
              <CListGroupItem>
                <strong>
                  <FaCalendar /> Days:
                </strong>{" "}
                {wDays}
              </CListGroupItem>
              <CListGroupItem>
                <strong>
                  <FaClock /> Open Time:
                </strong>{" "}
                {state.beauticianInfo.open_time}
              </CListGroupItem>
              <CListGroupItem>
                <strong>
                  <FaClock /> Close Time:
                </strong>{" "}
                {state.beauticianInfo.close_time}
              </CListGroupItem>
              <CListGroupItem>
                <strong>
                  <FaClock /> Duration:
                </strong>{" "}
                {state.beauticianInfo.duration} minutes
              </CListGroupItem>
            </CListGroup>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Info;
