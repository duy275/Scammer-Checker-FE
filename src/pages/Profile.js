import React, { useState } from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Vector from "../image/Vector.png";
import ReporterAvt from "../image/Reporter-Avt.png";
import "../css/Profile.css";
import { message } from "antd";
import scmravt from "../image/Scammer-Avt.png";
import rptravt from "../image/Reporter-Avt.png";
import close from "../image/Close.png";
import notfound from "../image/empty-box.png";
const Profile = () => {
  //Hiển thị thông tin cá nhân có sẵn
  const [profileData, setProfileData] = useState({
    name: "",
    phonenumber: "",
    email: "",
  });

  const [openForm, setOpenForm] = useState(false);

  const toggleForm = () => {
    setOpenForm(!openForm);
  };

  const userId = localStorage.getItem("userId");
  const fetchUser = async (id) => {
    try {
      const response = await fetch(
        `https://scammerchecker.onrender.com/reporter/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Xảy ra lỗi khi xóa: ${response.statusText}`);
      }
      const data = await response.json();
      setProfileData(data[0]);
    } catch (error) {
      message.error("Đã xảy ra lỗi");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (id) => {
    console.log(profileData);
    const response = await fetch(
      `https://scammerchecker.onrender.com/reporter/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      }
    );
    if (response.ok) {
      message.success("Cập nhật thông tin thành công");
      setOpenForm(false);
      fetchUser(userId);
    } else {
      message.error("Cập nhật thông tin thất bại");
    }
  };

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);
  //Hết hiển thị thông tin user
  //Hiển thị danh sách tố cáo
  const [scammers, setScammers] = useState([]);
  const [selectedScammer, setSelectedScammer] = useState([]);
  const [scammerIsOpen, setScammerIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
    console.log(filteredReports);
  }, []);

  const filteredReports = scammers.filter(
    (scammer) => scammer.reporter_id == userId
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

  //hết hiển thị danh sách tố cáo

  return (
    <>
      <section className="breadcrumb">
        <NavLink to="/" className="breadcrumb__link">
          Trang chủ
        </NavLink>
        <img src={Vector} alt="Vector icon" />
        <NavLink to="/profile" className="breadcrumb__link">
          Thông tin cá nhân
        </NavLink>
      </section>
      <div className="form-change">
        <div className="form-report">
          <div
            className={`form-update-wrapper ${openForm ? "active" : ""}`}
          ></div>
          <i
            className="fa-solid fa-pencil form-change__pencil"
            onClick={toggleForm}
          ></i>
          <div className="profile-img">
            <img src={ReporterAvt} alt="User" className="profile-img__img" />
          </div>
          <div className="form__group-wrap">
            <div className="form__group-custom">
              <label className="form__title">Họ và tên</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>
          </div>
          <div className="form__group-wrap">
            <div className="form__group-custom">
              <label className="form__title">Email</label>
              <input
                type="text"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>
          </div>
          <div className="form__group-wrap">
            <div className="form__group-custom">
              <label className="form__title">Số điện thoại</label>
              <input
                type="text"
                name="phonenumber"
                value={profileData.phonenumber}
                onChange={handleChange}
                className="form__input"
                required
              />
            </div>
          </div>
          {openForm && (
            <button
              className="btn form-report__btn submit-change"
              type="button"
              onClick={() => handleSubmit(userId)}
            >
              Xác nhận
            </button>
          )}
        </div>
      </div>

      <div className="container">
        <section className="alert-scam__custom">
          <div className="alert-scam__header">
            <h2 className="alert-scam__title title">Danh sách Scammer</h2>
            <p className="alert-scam__desc">
              CÓ {filteredReports.length} CẢNH BÁO
            </p>
          </div>
          {filteredReports && filteredReports.length > 0 ? (
            <ul className="scammer__list">
              {filteredReports.map((scammer, id) => (
                <li
                  className="scammer__item"
                  key={id}
                  onClick={() => selectScammer(scammer.id)}
                >
                  <img src={scmravt} alt="avata" className="scammer__avata" />
                  <div className="scammer__info">
                    <h3 className="scammer__name">{scammer.name}</h3>
                    <div className="scammer__date">
                      #{scammer.id} - {scammer.date}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="scammer__notfound">
              <img
                className="scammer_emty-img"
                src={notfound}
                alt="No results found"
              />
              <p className="scammer_empty-title">
                Bạn chưa gửi cảnh báo nào...
              </p>
            </div>
          )}
        </section>
        {scammerIsOpen && selectedScammer && (
          <section className="modal">
            <div className="modal__overlay" onClick={closeModal}></div>
            <div className="modal__content">
              <div className="modal__header">
                <div className="modal__header-title">Chi tiết tố cáo</div>
                <div className="modal__header-close" onClick={closeModal}>
                  <img src={close} alt="close icon" />
                </div>
              </div>
              <div className="modal__body">
                <div className="modal__group">
                  <div className="modal__profile">
                    <div className="modal__profile-image">
                      <img src={scmravt} alt="avata icon" />
                    </div>
                    <div className="modal__info">
                      <h4 className="modal__info-name">
                        {selectedScammer.name}
                      </h4>
                      <p className="modal__info-desc">
                        #{selectedScammer.id} - Tố vào ngày{" "}
                        {selectedScammer.date}
                      </p>
                    </div>
                  </div>
                  <div className="modal__detail">
                    <span className="modal__detail-title">Trạng thái</span>
                    <span className="modal__detail-text">
                      {showStatus(selectedScammer.s_status)}
                    </span>
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
                        JSON.parse(selectedScammer.images).map(
                          (image, index) => (
                            <img
                              key={index}
                              src={`data:image/png;base64,${image}`}
                              alt={`Scammer Image ${index + 1}`}
                              onClick={() => {
                                openImageModal(image);
                              }}
                            />
                          )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {isImageModalOpen && selectedImage && (
          <div className="image-modal">
            <div
              className="image-modal__overlay"
              onClick={closeImageModal}
            ></div>
            <div className="image-modal__content">
              <img
                src={`data:image/png;base64,${selectedImage}`}
                alt="Selected Image"
                className="image-modal__img"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
