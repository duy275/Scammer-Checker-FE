import "../css/Warning.css";
import "../css/Admin.css";
import adminavt from "../image/Reporter-Avt.png";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logout from "../image/logout.png";
import { message } from "antd";
import { NavLink } from "react-router-dom";

const Warning = () => {
  const [warnings, setWarnings] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    // Chuyển hướng về trang đăng nhập
    navigate("/login"); // Dùng navigate() thay vì Navigate
  };

  const navigate = useNavigate(); // Khởi tạo useNavigate

  const fetchWarnings = async () => {
    const response = await fetch("http://localhost:5000/warning");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    setWarnings(data);
  };

  useEffect(() => {
    fetchWarnings();
  }, []);

  //Gửi cảnh báo mới
  const [isWarningModal, setIsWarningModal] = useState(false);

  const handleOpenWarning = () => {
    setIsWarningModal(true);
  };

  const handleCloseWarning = () => {
    setIsWarningModal(false);
  };

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/warning/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    message.success("Thêm cảnh báo thành công!");
    fetchWarnings();
    setIsWarningModal(false);
    setFormData({ title: "", content: "" });
  };
  //Hết gửi cảnh báo mới

  //Xóa cảnh báo
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [selectedWarningId, setSelectedWarningId] = useState(null);

  const openDeleteModal = (id) => {
    setOpenConfirmDelete(true);
    setSelectedWarningId(id);
  };

  const closeDeleteModal = (id) => {
    setOpenConfirmDelete(false);
    setSelectedWarningId(null);
  };

  const handleDeleteWarning = async (id) => {
    const response = await fetch(`http://localhost:5000/warning/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    message.success("Xóa cảnh báo thành công!");
    fetchWarnings();
    closeDeleteModal(selectedWarningId);
  };
  //Hết xóa cảnh báo
  //Tìm kiếm cảnh báo
  const [searchTerm, setSearchTerm] = useState("");

  const searchedWarnings = warnings.filter(
    (warning) =>
      warning.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warning.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  //hết tìm kiếm cảnh báo
  return (
    <>
      <section className="dashboard">
        <header className="header-admin">
          <h2 className="header-admin__title">Quản lý cảnh báo</h2>
          <div className="header-admin__info" onClick={toggleLogin}>
            <img src={adminavt}></img>
            <span className="header-admin__name">Admin</span>
          </div>
          <div className={`login-list__custom ${showLogin ? "active" : ""}`}>
            <NavLink to="/profile" className="login-item">
              Thông tin tài khoản
            </NavLink>
            <div className="login-item" onClick={handleLogout}>
              Đăng xuất
              <img src={logout} alt="logout" className="logout-img" />
            </div>
          </div>
        </header>
        <div className="dashboard-content">
          <div className="dashboard__top">
            <div className="dashboard__top-heading">
              <h2 className="dashboard__top-title">Danh sách cảnh báo</h2>
              <p className="dashboard__top-total">
                (Có {searchedWarnings.length} cảnh báo)
              </p>
              <i
                className="fa-solid fa-circle-plus add-warning"
                onClick={handleOpenWarning}
              ></i>
            </div>
            <form className="form-search__admin form-search__admin-custom ">
              <input
                type="text"
                placeholder="Tìm kiếm hình thức lừa đảo..."
                className="form-search__input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              ></input>
              <i className="fa-solid fa-magnifying-glass search-icon"></i>
            </form>
          </div>
          <div className="fui-table-ui-basic-linh table-wrap">
            <table className="dashboard-table">
              <thead className="dashboard-table__header">
                <tr>
                  <th>Id</th>
                  <th>Hình thức lừa đảo</th>
                  <th>Nội dung chi tiết</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="table-content">
                {searchedWarnings.map((warning, id) => (
                  <tr key={id}>
                    <td>{warning.id}</td>
                    <td>{warning.title}</td>
                    <td>{warning.content}</td>
                    <td>
                      <span className="table-icons">
                        <i
                          className="fa-solid fa-trash-can"
                          onClick={() => openDeleteModal(warning.id)}
                        ></i>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {isWarningModal && (
        <div className="warning-modal">
          <div
            className="warning-modal__overlay"
            onClick={handleCloseWarning}
          ></div>
          <div className="warning-modal__wrapper">
            <div className="warning-modal__header">
              <h2 className="">Thêm cảnh báo mới</h2>
            </div>
            <div className="warning-modal__content">
              <form className="warning-modal__form">
                <div className="warning-input__wrapper">
                  <label>Hình thức lừa đảo:</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="warning-modal__input"
                    placeholder="Nhập hình thức lừa đảo..."
                    required
                  />
                </div>
                <div className="warning-input__wrapper">
                  <label>Chi tiết:</label>
                  <textarea
                    type="text"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="warning-modal__input"
                    placeholder="Nhập chi tiết hình thức lừa đảo..."
                    required
                  />
                </div>
              </form>
            </div>
            <div className="confirm-modal__content">
              <i
                className="fa-solid fa-circle-check confirm"
                onClick={handleSubmit}
              ></i>
              <i
                className="fa-solid fa-circle-xmark reject"
                onClick={handleCloseWarning}
              ></i>
            </div>
          </div>
        </div>
      )}

      {openConfirmDelete && selectedWarningId && (
        <div className="confirm-modal">
          <div
            className="confirm-modal__overlay"
            onClick={closeDeleteModal}
          ></div>
          <div className="confirm-modal__wrapper">
            <div className="confirm-modal__header">
              <i className="fa-solid fa-circle-exclamation"></i>
              <h3>Xác nhận xóa cảnh báo?</h3>
            </div>
            <div className="confirm-modal__content">
              <i
                className="fa-solid fa-circle-check confirm"
                onClick={() => handleDeleteWarning(selectedWarningId)}
              ></i>
              <i
                className="fa-solid fa-circle-xmark reject"
                onClick={() => closeDeleteModal(selectedWarningId)}
              ></i>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Warning;
