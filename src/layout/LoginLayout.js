import React from "react";
import { Outlet } from "react-router-dom"; // Dùng Outlet để render các trang con

const LoginLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default LoginLayout;
