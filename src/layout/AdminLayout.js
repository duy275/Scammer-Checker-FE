import React from "react";
import Sidebar from "../components/sidebar/Sidebar"; // Sidebar admin
import { Outlet } from "react-router-dom"; // Dùng Outlet để render các trang con
import "../css/Admin.css";
const AdminLayout = () => {
  return (
    <div className="container-admin">
      <Sidebar />
      <div className="dashboard-wrap">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
