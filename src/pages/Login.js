import React, { useState } from "react";
import "../css/Login.css";
import { NavLink, useNavigate } from "react-router-dom"; // Sử dụng useNavigate thay vì useHistory
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { message } from "antd";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://scammerchecker.onrender.com/login",
        {
          username,
          password,
        }
      );

      const token = response.data.token;
      const decodedToken = jwtDecode(token);

      console.log(response);
      console.log(decodedToken.id);
      console.log(decodedToken);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", decodedToken.id);

      message.success("Đăng nhập thành công!");

      setTimeout(() => {
        if (username === "admin") {
          navigate("/admin/scammer");
        } else {
          navigate("/");
        }
      }, 1000);
    } catch (err) {
      message.error("Thông tin đăng nhập không chính xác!");
    }
  };

  return (
    <div>
      <section className="login">
        <div className="login-container">
          <h1 className="login-heading">Đăng nhập tài khoản</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form__group">
              <label className="login-form__title">Tên đăng nhập</label>
              <input
                type="text"
                className="login-form__input"
                placeholder="Nhập tên đăng nhập của bạn"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Cập nhật giá trị của username
              />
            </div>
            <div className="login-form__group">
              <div className="login-form__title">
                <label className="login-form__title-password">Mật khẩu</label>
                <label className="login-form__title-password">
                  Quên mật khẩu?
                </label>
              </div>
              <input
                type="password"
                className="login-form__input"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Cập nhật giá trị của password
              />
            </div>
            <button type="submit" className="form-button btn">
              Đăng nhập
            </button>

            <div className="login-form__register">
              Bạn chưa có tài khoản?{" "}
              <NavLink to="/register" className="register">
                Đăng ký
              </NavLink>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
