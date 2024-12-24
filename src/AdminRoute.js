import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AdminRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  let isAdmin = false;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      isAdmin = decodedToken.username === "admin";
    } catch (error) {
      console.error("Token không hợp lệ", error);
    }
  }

  return isAdmin ? element : <Navigate to="/" />;
};

export default AdminRoute;
