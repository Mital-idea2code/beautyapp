import React from "react";

const Dashboard = React.lazy(() => import("./views/dashboard/Dashboard"));
const Profile = React.lazy(() => import("./views/auth/Profile"));
const ChangePassword = React.lazy(() => import("./views/auth/ChangePassword"));

const category = React.lazy(() => import("./views/category"));
const categoryForm = React.lazy(() => import("./views/category/categoryForm"));

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/profile", name: "Profile", element: Profile },
  { path: "/changePassword", name: "Change Password", element: ChangePassword },
  { path: "/dashboard", name: "Dashboard", element: Dashboard },
  { path: "/category", name: "Specialist Category", element: category },
  {
    path: "/category/manage",
    name: "Manage Category",
    element: categoryForm,
  },
];

export default routes;
