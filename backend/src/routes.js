import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Profile = React.lazy(() => import("./views/auth/Profile"));
const ChangePassword = React.lazy(() => import("./views/auth/ChangePassword"));

const SpecialistCategory = React.lazy(() => import("./views/specialistCategory"));
const SpecialistCategoryForm = React.lazy(() => import("./views/specialistCategory/SpecialistCategoryForm"));
const Doctor = React.lazy(() => import("./views/doctor"));
const DoctorForm = React.lazy(() => import("./views/doctor/DoctorForm"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/profile", name: "Profile", element: Profile },
  { path: "/changePassword", name: "Change Password", element: ChangePassword },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/specialist-category", name: "Specialist Category", element: SpecialistCategory },
  {
    path: "/specialist-category/manage",
    name: "Manage Specialist Category",
    element: SpecialistCategoryForm,
  },
  { path: "/doctor", name: "Doctors", element: Doctor },
  { path: "/doctor/manage", name: "Doctors", element: DoctorForm },
];

export default routes;
