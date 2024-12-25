import "../css/Warning.css";
import "../css/Admin.css";
import "../css/User.css";
import "../components/header/WebHeader.css";
import adminavt from "../image/Reporter-Avt.png";
import React, { useState } from "react";
import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logout from "../image/logout.png";
import { message } from "antd";
import close from "../image/Close.png";
import scmravt from "../image/Scammer-Avt.png";
import rptravt from "../image/Reporter-Avt.png";
import notfound from "../image/empty-box.png";

const Warning = () => {
  const [scammers, setScammers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [warnings, setWarnings] = useState([]);

  const fetchWarnings = async () => {
    const response = await fetch(
      "https://scammerchecker.onrender.com/reporter"
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    setWarnings(data);
  };

  useEffect(() => {
    fetchWarnings();
  }, []);

  const openDeleteModal = (username) => {
    setOpenConfirmDelete(true);
    setSelectedUserName(username);
  };

  const closeDeleteModal = (username) => {
    setOpenConfirmDelete(false);
    setSelectedUserName(null);
  };

  const fetchScammer = async () => {
    try {
      const response1 = await fetch(
        "https://scammerchecker.onrender.com/scammer"
      );
      if (!response1.ok) {
        throw new Error(`Lỗi khi lấy dữ liệu: ${response1.status}`);
      }
      const scammerData = await response1.json();
      setScammers(scammerData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchScammer();
  }, []);

  const searchedUsers = warnings.filter(
    (scammer) =>
      scammer.phonenumber.includes(searchTerm) ||
      scammer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scammer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scammer.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const banUser = async (username) => {
    try {
      const response = await fetch(
        `https://scammerchecker.onrender.com/ban/${username}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Đã lỗi: ${response.statusText}`);
      }
      message.success("Thành công!");
      fetchWarnings();
      closeDeleteModal(selectedUserName);
    } catch (err) {
      console.error("Xảy ra lỗi khi banned:", err);
      message.error("Đã xảy ra lỗi khi cấm người dùng. Vui lòng thử lại.");
    }
  };
  const [showLogin, setShowLogin] = useState(false);

  const userStatus = (ban) => {
    if (ban === "1") {
      return "Đã cấm";
    } else if (ban === "0") return "Hoạt động";
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navigate = useNavigate();

  //hàm xem chi tiết user
  const [userId, setUserId] = useState([]);
  const [userModal, setUserModal] = useState(false);

  const seletectUser = (id) => {
    console.log(id);
    setUserId(id);
    setUserModal(true);
    document.body.classList.add("no-scroll");
    console.log(filteredReports.length);
  };

  const closeUserModal = () => {
    setUserModal(false);
    document.body.classList.remove("no-scroll");
  };

  const filteredReports = scammers.filter(
    (scammer) => scammer.reporter_id === userId
  );

  const showStatus = (s_status) => {
    if (s_status === "0") {
      return (
        <span style={{ color: "orange", fontWeight: "bold" }}>
          Chưa xét duyệt
        </span>
      );
    }
    if (s_status === "1") {
      return (
        <span style={{ color: "green", fontWeight: "bold" }}>Đã xét duyệt</span>
      );
    }
    if (s_status === "2") {
      return <span style={{ color: "red", fontWeight: "bold" }}>Từ chối</span>;
    }
  };

  return (
    <>
      <section className="dashboard">
        <header className="header-admin">
          <h2 className="header-admin__title">Quản lý người dùng</h2>
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
              <h2 className="dashboard__top-title">Danh sách người dùng</h2>
              <p className="dashboard__top-total">
                (Có {searchedUsers.length} người dùng)
              </p>
            </div>
            <form className="form-search__admin">
              <input
                type="text"
                placeholder="Kiểm tra số điện thoại, tên người dùng..."
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
                  <th>Họ và tên</th>
                  <th>Số điện thoại</th>
                  <th>Tên đăng nhập</th>
                  <th>Email</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="table-content">
                {searchedUsers.map((warning, id) => (
                  <tr key={id}>
                    <td>{warning.id}</td>
                    <td>{warning.name}</td>
                    <td>{warning.phonenumber}</td>
                    <td>{warning.username}</td>
                    <td>{warning.email}</td>
                    <td>{userStatus(warning.ban)}</td>
                    <td>
                      <span className="table-icons">
                        <i
                          className="fa-solid fa-eye"
                          onClick={() => seletectUser(warning.id)}
                        ></i>
                        <i
                          className="fa-solid fa-ban"
                          onClick={() => openDeleteModal(warning.username)}
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
      {userModal && filteredReports && (
        <section className="modal">
          <div className="modal__overlay" onClick={closeUserModal}></div>
          <div className="modal__content-custom">
            <div className="modal__header-custom">
              <div className="modal__header-title">Chi tiết tố cáo</div>
            </div>
            {filteredReports.length > 0 ? (
              <div>
                {filteredReports.map((report) => (
                  <div className="modal__body-custom">
                    <div className="modal__group">
                      <div className="modal__profile">
                        <div className="modal__profile-image">
                          <img src={scmravt} alt="avata icon" />
                        </div>
                        <div className="modal__info">
                          <h4 className="modal__info-name">{report.name}</h4>
                          <p className="modal__info-desc">
                            #{report.id} - Tố vào ngày {report.date}
                          </p>
                        </div>
                      </div>
                      <div className="modal__detail">
                        <span className="modal__detail-title">Trạng thái</span>
                        <span className="modal__detail-text">
                          {showStatus(report.s_status)}
                        </span>
                      </div>
                      <div className="modal__detail">
                        <span className="modal__detail-title">
                          Số điện thoại
                        </span>
                        <span className="modal__detail-text">
                          {report.phonenumber}
                        </span>
                      </div>
                      <div className="modal__detail">
                        <span className="modal__detail-title">
                          Số tài khoản
                        </span>
                        <span className="modal__detail-text">
                          {report.banknumber}
                        </span>
                      </div>
                      <div className="modal__detail">
                        <span className="modal__detail-title">Ngân hàng</span>
                        <span className="modal__detail-text">
                          {report.bank}
                        </span>
                      </div>
                    </div>
                    <div className="modal__group">
                      <div className="modal__profile">
                        <div className="modal__profile-image">
                          <img src={rptravt} alt="avata icon" />
                        </div>
                        <div className="modal__info">
                          <h4 className="modal__info-name">
                            {report.reporter_name}
                          </h4>
                          <p className="modal__info-desc">Người tố cáo </p>
                        </div>
                      </div>
                      <div className="modal__detail">
                        <span className="modal__detail-title">Trạng thái</span>
                        <span className="modal__detail-text">
                          {report.r_status}
                        </span>
                      </div>
                      <div className="modal__detail">
                        <span className="modal__detail-title">Liên hệ</span>
                        <span className="modal__detail-text">
                          {report.reporter_phonenumber}
                        </span>
                      </div>
                      <div className="modal__textarea">
                        <span className="modal__detail-title">
                          Nội dung tố cáo
                        </span>
                        <p className="modal__textarea-content">
                          {report.description}
                        </p>
                      </div>
                      <div className="modal__images">
                        <span className="modal__detail-title">
                          Hình ảnh liên quan
                        </span>
                        <div className="modal__preview-images">
                          {report.images &&
                            JSON.parse(report.images).map((image, index) => (
                              <img
                                key={index}
                                src={`data:image/png;base64,${image}`}
                                alt={`Scammer Image ${index + 1}`}
                                onClick={() => {
                                  openImageModal(image);
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="scammer__notfound-custom">
                <img
                  className="scammer_emty-img"
                  src={notfound}
                  alt="No results found"
                />
                <p className="scammer_empty-title">Chưa gửi đơn tố cáo nào</p>
              </div>
            )}
          </div>
        </section>
      )}
      {isImageModalOpen && selectedImage && (
        <div className="image-modal">
          <div className="image-modal__overlay" onClick={closeImageModal}></div>
          <div className="image-modal__content">
            <img
              src={`data:image/png;base64,${selectedImage}`}
              alt="Selected Image"
              className="image-modal__img"
            />
          </div>
        </div>
      )}
      {openConfirmDelete && (
        <div className="confirm-modal">
          <div
            className="confirm-modal__overlay"
            onClick={closeDeleteModal}
          ></div>
          <div className="confirm-modal__wrapper">
            <div className="confirm-modal__header">
              <i className="fa-solid fa-circle-exclamation"></i>
              <h3>Xác nhận thao tác người dùng?</h3>
            </div>
            <div className="confirm-modal__content">
              <i
                className="fa-solid fa-circle-check confirm"
                onClick={() => banUser(selectedUserName)}
              ></i>
              <i
                className="fa-solid fa-circle-xmark reject"
                onClick={() => closeDeleteModal(selectedUserName)}
              ></i>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Warning;
