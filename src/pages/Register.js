import React, { useState } from "react";
import "../css/Register.css";
import "../css/Login.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const Register = () => {
  const [name, setName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // Trạng thái lỗi
  const navigate = useNavigate(); // Để điều hướng sau khi đăng ký thành công

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      // Gửi thông tin đăng ký tới API backend
      const response = await axios.post(
        "https://scammerchecker.onrender.com/register",
        {
          name,
          phonenumber,
          username,
          password,
          email,
        }
      );

      // Nếu đăng ký thành công, chuyển hướng đến trang đăng nhập
      message.success("Đăng ký tài khoản thành công!");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Đã xảy ra lỗi khi đăng ký, vui lòng thử lại.");
      }
    }
  };

  return (
    <div>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="form__heading">Đăng ký tài khoản</h2>
        <div className="form__group-wrapp">
          <div className="form__group">
            <label className="form__titlee">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên của bạn"
              className="form__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form__group">
            <label className="form__titlee">Số điện thoại</label>
            <input
              type="text"
              placeholder="Nhập số điện thoại của bạn"
              className="form__input"
              value={phonenumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form__group-wrapp">
          <div className="form__group">
            <label className="form__titlee">Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập của bạn"
              className="form__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form__group">
            <label className="form__titlee">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              className="form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form__group-wrapp">
          <div className="form__group">
            <label className="form__titlee">Email</label>
            <input
              type="email"
              placeholder="Nhập địa chỉ Email của bạn"
              className="form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form__group">
            <label className="form__titlee">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu của bạn để xác nhận"
              className="form__input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn form-report__bt">
          Đăng ký
        </button>

        <div className="login-form__register">
          Bạn đã có tài khoản?{" "}
          <NavLink to="/login" className="register">
            Đăng nhập
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default Register;
