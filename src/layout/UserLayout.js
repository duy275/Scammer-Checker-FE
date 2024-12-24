import React from "react";
import WebHeader from "../components/header/WebHeader"; // Header cho user
import { Outlet } from "react-router-dom"; // Dùng Outlet để render các trang con

const UserLayout = () => {
  return (
    <div>
      <WebHeader />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
