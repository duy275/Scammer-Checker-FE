import React from "react";
import { useState, useEffect } from "react";
import logo from "../../image/logo.png";
import Reporter from "../../image/Reporter-Avt.png";
import logout from "../../image/logout.png";
import { NavLink } from "react-router";
import { Navigate, useNavigate } from "react-router-dom";
import { useRef } from "react";

import "./WebHeader.css";

const WebHeader = () => {
  const token = localStorage.getItem("token");

  const [scrollY, setScrollY] = useState(0);
  const warningRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (warningRef.current && !warningRef.current.contains(event.target)) {
        setShowLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Lắng nghe sự kiện scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const setBodyPadding = () => {
      if (scrollY > 105) {
        document.body.style.paddingTop = "105px";
      } else {
        document.body.style.paddingTop = "0";
      }
    };
    setBodyPadding();
  }, [scrollY]);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };
  return (
    <>
      <header className={`header ${scrollY > 105 ? "fixed" : ""}`}>
        <NavLink to="/" className="header__logo">
          <img src={logo} alt="logo" className="header__logo-img" />
          <span className="header__logo-name">Scam?</span>
        </NavLink>
        <ul className="header__nav-list">
          <li className="header__nav-item">
            <NavLink to="/" className="header__nav-link">
              Trang Chủ
            </NavLink>
          </li>
          <li className="header__nav-item">
            <NavLink to="/scammer" className="header__nav-link">
              Scammer
            </NavLink>
          </li>
          <li className="header__nav-item">
            <NavLink to="/introduce" className="header__nav-link">
              Giới Thiệu
            </NavLink>
          </li>
        </ul>
        <div className="header__btn-login" ref={warningRef}>
          <NavLink to="/report" className="header__btn">
            Gửi tố cáo
          </NavLink>
          <div className="login__container">
            <img src={Reporter} className="avatar" onClick={toggleLogin}></img>
            {token ? (
              <div className={`login-list ${showLogin ? "active" : ""}`}>
                <NavLink to="/profile" className="login-item">
                  Thông tin tài khoản
                </NavLink>
                <div className="login-item" onClick={handleLogout}>
                  Đăng xuất
                  <img src={logout} alt="logout" className="logout-img" />
                </div>
              </div>
            ) : (
              <div className={`login-list ${showLogin ? "active" : ""}`}>
                <NavLink to="/login" className="login-item">
                  Đăng nhập
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default WebHeader;
