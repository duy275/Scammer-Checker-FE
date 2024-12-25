import React from "react";
import { Navigate } from "react-router-dom";
import { message } from "antd";
import { NavLink } from "react-router-dom";
import Vector from "./image/Vector.png";
import warning from "./image/warning.png";
import "./css/PrivateRoute.css";

const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    message.warning("Bạn cần đăng nhập để gửi tố cáo");
    return (
      <>
        <section className="breadcrumb">
          <NavLink to="/" className="breadcrumb__link">
            Trang chủ
          </NavLink>
          <img src={Vector} alt="Vector icon" />
          <NavLink to="/report" className="breadcrumb__link">
            Gửi tố cáo
          </NavLink>
        </section>
        <div className="warning-container">
          <div className="warning-item">
            <img src={warning} className="warning-icon__img" />
          </div>
          <h2 className="warning-item">Yêu cầu người dùng đăng nhập</h2>
        </div>
      </>
    );
  }

  return element;
};

export default PrivateRoute;
