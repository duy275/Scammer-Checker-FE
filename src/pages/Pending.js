import "../css/Admin.css";
import adminavt from "../image/Reporter-Avt.png";
import React from "react";
import { useState, useEffect, useRef } from "react";
import "../css/HomePage.css";
import scmravt from "../image/Scammer-Avt.png";
import rptravt from "../image/Reporter-Avt.png";
import close from "../image/Close.png";
import notfound from "../image/empty-box.png";
import { message } from "antd";
import logout from "../image/logout.png";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Admin = () => {
  const [scammers, setScammers] = useState([]);
  const [selectedScammer, setSelectedScammer] = useState([]);
  const [scammerIsOpen, setScammerIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserName, setSelectedUserName] = useState(null);

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [selectedScammerId, setSelectedScammerId] = useState(null);

  const openDeleteModal = (id, username) => {
    setOpenConfirmDelete(true);
    setSelectedScammerId(id);
    setSelectedUserName(username);
  };

  const closeDeleteModal = (id, username) => {
    setOpenConfirmDelete(false);
    setSelectedScammerId(null);
    setSelectedUserName(null);
  };

  const handleBanUser = (id, username) => {
    banUser(username);
    deleteScammer(id);
  };

  const deleteScammer = async (id) => {
    console.log(id);
    try {
      const response = await fetch(
        `https://scammerchecker.onrender.com/scammer/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Xảy ra l��i xóa: ${response.statusText}`);
      }
      message.success("Xóa đơn tố cáo thành công");
      fetchScammer();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      message.error("Đã xảy ra lỗi khi xóa. Vui lòng thử lại.");
    }
    closeDeleteModal(selectedScammerId);
  };

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

  const fetchScammer = async () => {
    try {
      const response1 = await fetch(
        "https://scammerchecker.onrender.com/scammer/unconfirmed"
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

  const searchedScammers = scammers.filter(
    (scammer) =>
      scammer.phonenumber.includes(searchTerm) ||
      scammer.banknumber.includes(searchTerm)
  );

  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  const selectScammer = async (id) => {
    const scammer = scammers.find((v) => v.id === id);
    setSelectedScammer(scammer);
    setScammerIsOpen(true);
    document.body.classList.add("no-scroll");
  };

  const closeModal = () => {
    setScammerIsOpen(false);
    document.body.classList.remove("no-scroll");
  };

  const confirmScammer = async (id) => {
    try {
      const response = await fetch(
        `https://scammerchecker.onrender.com/scammer/confirm/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Lỗi khi xét duyệt: ${response.statusText}`);
      }
      message.success("Xét duyệt thành công");
      closeModal();
      fetchScammer();
    } catch (error) {
      console.error("Lỗi khi xét duyệt:", error);
      message.error("Đã xảy ra lỗi khi xét duyệt. Vui lòng thử lại.");
    }
  };

  const rejectScammer = async (id) => {
    try {
      const response = await fetch(
        `https://scammerchecker.onrender.com/scammer/reject/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Đã từ chối: ${response.statusText}`);
      }
      message.success("Đã từ chối tố cáo");
      closeModal();
      fetchScammer();
    } catch (error) {
      console.error("Xảy ra lỗi khi từ chối:", error);
      message.error("Xãy ra lỗi khi từ chối. Vui lòng thử lại.");
    }
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
      message.success("Đã cấm người dùng");
      fetchScammer();
    } catch (err) {
      console.error("Xảy ra lỗi khi banned:", err);
      message.error("Đã xảy ra lỗi khi cấm người dùng. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <section className="dashboard">
        <header className="header-admin">
          <h2 className="header-admin__title">Quản lý đơn tố cáo</h2>
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
              <h2 className="dashboard__top-title">Danh sách Scammer</h2>
              <p className="dashboard__top-total">
                (Có {scammers.length} đơn tố cáo)
              </p>
            </div>
            <form className="form-search__admin">
              <input
                type="text"
                placeholder="Kiểm tra số tài khoản ngân hàng..."
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
                  <th>Chủ tài khoản</th>
                  <th>Số tài khoản</th>
                  <th>Ngân hàng</th>
                  <th>Số điện thoại đối tượng</th>
                  <th>Người gửi đơn</th>
                  <th>Ngày gửi</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="table-content">
                {searchedScammers.map((scammer, id) => (
                  <tr key={id}>
                    <td>{scammer.id}</td>
                    <td>{scammer.name}</td>
                    <td>{scammer.banknumber}</td>
                    <td>{scammer.bank}</td>
                    <td>{scammer.phonenumber}</td>
                    <td>{scammer.reporter_name}</td>
                    <td>{scammer.date}</td>
                    <td>
                      <span className="table-icons">
                        <i
                          className="fa-solid fa-eye"
                          onClick={() => selectScammer(scammer.id)}
                        ></i>
                        <i
                          className="fa-solid fa-ban"
                          onClick={() =>
                            openDeleteModal(
                              scammer.id,
                              scammer.reporter_username
                            )
                          }
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

      {scammerIsOpen && selectedScammer && (
        <section className="modal">
          <div className="modal__overlay" onClick={closeModal}></div>
          <div className="modal__content">
            <div className="modal__header">
              <div className="modal__header-title">Chi tiết tố cáo</div>
              <div className="modal__header-icons">
                <i
                  className="fa-solid fa-circle-check confirm"
                  onClick={() => confirmScammer(selectedScammer.id)}
                ></i>
                <i
                  className="fa-solid fa-circle-xmark reject"
                  onClick={() => rejectScammer(selectedScammer.id)}
                ></i>
                <div className="modal__header-close" onClick={closeModal}>
                  <img src={close} alt="close icon" />
                </div>
              </div>
            </div>
            <div className="modal__body">
              <div className="modal__group">
                <div className="modal__profile">
                  <div className="modal__profile-image">
                    <img src={scmravt} alt="avata icon" />
                  </div>
                  <div className="modal__info">
                    <h4 className="modal__info-name">{selectedScammer.name}</h4>
                    <p className="modal__info-desc">
                      #{selectedScammer.id} - Tố vào ngày {selectedScammer.date}
                    </p>
                  </div>
                </div>
                <div className="modal__detail">
                  <span className="modal__detail-title">Số điện thoại</span>
                  <span className="modal__detail-text">
                    {selectedScammer.phonenumber}
                  </span>
                </div>
                <div className="modal__detail">
                  <span className="modal__detail-title">Số tài khoản</span>
                  <span className="modal__detail-text">
                    {selectedScammer.banknumber}
                  </span>
                </div>
                <div className="modal__detail">
                  <span className="modal__detail-title">Ngân hàng</span>
                  <span className="modal__detail-text">
                    {selectedScammer.bank}
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
                      {selectedScammer.reporter_name}
                    </h4>
                    <p className="modal__info-desc">Người tố cáo </p>
                  </div>
                </div>
                <div className="modal__detail">
                  <span className="modal__detail-title">Trạng thái</span>
                  <span className="modal__detail-text">
                    {selectedScammer.r_status}
                  </span>
                </div>
                <div className="modal__detail">
                  <span className="modal__detail-title">Liên hệ</span>
                  <span className="modal__detail-text">
                    {selectedScammer.reporter_phonenumber}
                  </span>
                </div>
                <div className="modal__textarea">
                  <span className="modal__detail-title">Nội dung tố cáo</span>
                  <p className="modal__textarea-content">
                    {selectedScammer.description}
                  </p>
                </div>
                <div className="modal__images">
                  <span className="modal__detail-title">
                    Hình ảnh liên quan
                  </span>
                  <div className="modal__preview-images">
                    {selectedScammer.images &&
                      JSON.parse(selectedScammer.images).map((image, index) => (
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
              <h3>Xác nhận cấm người dùng?</h3>
            </div>
            <div className="confirm-modal__content">
              <i
                className="fa-solid fa-circle-check confirm"
                onClick={() =>
                  handleBanUser(selectedScammerId, selectedUserName)
                }
              ></i>
              <i
                className="fa-solid fa-circle-xmark reject"
                onClick={() => closeDeleteModal(selectedScammerId)}
              ></i>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
