import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Profile = React.lazy(() => import("./views/auth/Profile"));
const ChangePassword = React.lazy(() => import("./views/auth/ChangePassword"));

const user = React.lazy(() => import("./views/user"));
const userForm = React.lazy(() => import("./views/user/UserForm"));

const beautician = React.lazy(() => import("./views/beautician"));
const beauticianForm = React.lazy(() => import("./views/beautician/BeauticianForm"));
const beauticianServices = React.lazy(() => import("./views/beautician/Services"));

const category = React.lazy(() => import("./views/category"));
const categoryForm = React.lazy(() => import("./views/category/CategoryForm"));

const service = React.lazy(() => import("./views/service"));
const serviceForm = React.lazy(() => import("./views/service/ServiceForm"));

const homeBanner = React.lazy(() => import("./views/homeBanner"));
const homeBannerForm = React.lazy(() => import("./views/homeBanner/HomeBannerForm"));

const promoBanner = React.lazy(() => import("./views/promoBanner"));
const promoBannerForm = React.lazy(() => import("./views/promoBanner/PromoBannerForm"));

const faq = React.lazy(() => import("./views/settings/Faq"));
const faqForm = React.lazy(() => import("./views/settings/FaqForm"));

const generalSettingForm = React.lazy(() => import("./views/settings/GeneralSettingForm"));
const HelpCenterInfoSettingForm = React.lazy(() => import("./views/settings/HelpCenterInfoSettingForm"));
const tcForm = React.lazy(() => import("./views/settings/TcForm"));
const privacyPolicyForm = React.lazy(() => import("./views/settings/PrivacyPolicyForm"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/profile", name: "Profile", element: Profile },
  { path: "/changePassword", name: "Change Password", element: ChangePassword },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/users", name: "Users", element: user },
  {
    path: "/user/manage",
    name: "Manage User",
    element: userForm,
  },
  { path: "/beauticians", name: "Beauticians", element: beautician },
  {
    path: "/beautician/manage",
    name: "Manage Beautician",
    element: beauticianForm,
  },
  { path: "/beauticians/services", name: "Beautician Services", element: beauticianServices },
  { path: "/category", name: "Category", element: category },
  {
    path: "/category/manage",
    name: "Manage Category",
    element: categoryForm,
  },
  { path: "/services", name: "Services", element: service },
  {
    path: "/service/manage",
    name: "Manage Service",
    element: serviceForm,
  },
  { path: "/homebanners", name: "Home Banners", element: homeBanner },
  {
    path: "/homebanner/manage",
    name: "Manage Home Banner",
    element: homeBannerForm,
  },
  { path: "/promoBanners", name: "Promotion Banners", element: promoBanner },
  {
    path: "/promoBanner/manage",
    name: "Manage Promotion Banner",
    element: promoBannerForm,
  },
  { path: "/settings/faqs", name: "FAQs", element: faq },
  {
    path: "/settings/faqs/manage",
    name: "Manage FAQ",
    element: faqForm,
  },
  { path: "/settings/general_settings", name: "General Settings", element: generalSettingForm },
  { path: "/settings/help_center_settings", name: "Help Center Info Setiings", element: HelpCenterInfoSettingForm },
  { path: "/settings/terms_conditions", name: "Terms & Conditions", element: tcForm },
  { path: "/settings/privacy_policy", name: "Privacy Policy", element: privacyPolicyForm },
];

export default routes;
