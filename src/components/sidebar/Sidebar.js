import React from "react";
import logo from "../../image/logo.png";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
const Sidebar = () => {
  return (
    <>
      <div>
        <section className="sidebar">
          <div className="header__logo-custom">
            <img src={logo} alt="logo" className="header__logo-img" />
            <span className="header__logo-name">Scam?</span>
          </div>
          <ul className="sidebar-list">
            <li className="sidebar__item">
              <NavLink to="/admin/scammer" className="sidebar-link">
                <span className="sidebar__link-icon">
                  <i className="fa-solid fa-users-slash"></i>
                </span>
                Danh sách Scammer
              </NavLink>
            </li>
            <li className="sidebar__item">
              <NavLink to="/admin/rejected" className="sidebar-link">
                <span className="sidebar__link-icon">
                  <i className="fa-solid fa-users-slash"></i>
                </span>
                Danh sách đã từ chối
              </NavLink>
            </li>
            <li className="sidebar__item">
              <NavLink to="/admin/user" className="sidebar-link">
                <span className="sidebar__link-icon">
                  <i className="fa-solid fa-users"></i>
                </span>
                Danh sách User
              </NavLink>
            </li>
            <li className="sidebar__item">
              <NavLink to="/admin/pending" className="sidebar-link">
                <span className="sidebar__link-icon">
                  <i className="fa-solid fa-hourglass-half"></i>
                </span>
                Đợi duyệt
              </NavLink>
            </li>
            <li className="sidebar__item">
              <NavLink to="/admin/warning" className="sidebar-link">
                <span className="sidebar__link-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </span>
                Nội dung cảnh báo
              </NavLink>
            </li>
            <li className="sidebar__item">
              <NavLink to="/" className="sidebar-link">
                <span className="sidebar__link-icon">
                  <i className="fa-solid fa-globe"></i>
                </span>
                Vào Website
              </NavLink>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Sidebar;
