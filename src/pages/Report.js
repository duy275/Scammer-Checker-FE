import React, { useState } from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Vector from "../image/Vector.png";
import addimg from "../image/Image.png";
import close from "../image/Close.png";
import { message } from "antd";
import "../css/Report.css";

const Report = () => {
  const [files, setFiles] = useState([]); // Lưu danh sách file đã chọn
  const [status, setStatus] = useState("");
  const [previewImages, setPreviewImages] = useState([]); // Lưu danh sách ảnh preview
  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    banknumber: "",
    bank: "",
    description: "",
    r_status: "",
  });

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const openDeleteModal = (e) => {
    e.preventDefault();
    setOpenConfirmDelete(true);
  };

  const closeDeleteModal = () => {
    setOpenConfirmDelete(false);
  };

  const handleConfirmSubmit = () => {
    handleSubmit(new Event("submit"));
    setOpenConfirmDelete(false);
  };

  const reporter_id = localStorage.getItem("userId");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Lấy ngày hiện tại
    const date = new Date();
    setCurrentDate(date.toLocaleDateString("vi-VN")); // Định dạng ngày theo kiểu Việt Nam (DD/MM/YYYY)
  }, []);

  const handleFile = (event) => {
    const selectedFiles = event.target.files;

    // Cập nhật danh sách các file đã chọn
    setFiles((prevFiles) => {
      const newFiles = Array.from(selectedFiles);
      return [...prevFiles, ...newFiles];
    });

    // Tạo URL preview cho ảnh mới và thêm vào danh sách preview
    const newPreviewUrls = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages((prevImages) => [...prevImages, ...newPreviewUrls]);
  };

  const handleRemoveImage = (index) => {
    const newPreviewImages = previewImages.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    setPreviewImages(newPreviewImages);
    setFiles(newFiles);
  };

  const handleChange = (e) => {
    setStatus(e.target.value);
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setStatus(""); // Reset the radio buttons
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imagesBase64 = [];
    const readFiles = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result.split(",")[1];
          imagesBase64.push(base64String);
          resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      await Promise.all(readFiles);
      const formPayload = {
        ...formData,
        images: JSON.stringify(imagesBase64),
        date: currentDate,
        reporter_id: reporter_id,
      };

      const response = await fetch(
        "https://scammerchecker.onrender.com/scammer/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formPayload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Dữ liệu đã được gửi lên server:", result);
        message.success("Gửi tố cáo thành công!");
      } else {
        const text = await response.text();
        console.error("Lỗi từ server:", text);
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
    }
    setFormData({
      name: "",
      phonenumber: "",
      banknumber: "",
      bank: "",
      description: "",
      r_status: "",
    });
    setFiles([]);
    setPreviewImages([]);
    handleReset();
  };

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
      <div className="form-report">
        <h2 className="form__heading">Thông tin kẻ lừa đảo</h2>
        <div className="form__group-wrap">
          <div className="form__group">
            <label className="form__title">Tên chủ tài khoản</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên chủ tài khoản..."
              className="form__input"
              required
            />
          </div>
          <div className="form__group">
            <label className="form__title">Số điện thoại</label>
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              placeholder="Nhập số điện thoại..."
              className="form__input"
              required
            />
          </div>
        </div>
        <div className="form__group-wrap">
          <div className="form__group">
            <label className="form__title">Số tài khoản</label>
            <input
              type="text"
              name="banknumber"
              value={formData.banknumber}
              onChange={handleChange}
              placeholder="Nhập số tài khoản..."
              className="form__input"
              required
            />
          </div>
          <div className="form__group">
            <label className="form__title">Ngân hàng</label>
            <input
              type="text"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              placeholder="Nhập tên ngân hàng..."
              className="form__input"
              required
            />
          </div>
        </div>
        <div className="form__group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form__textarea"
            placeholder="Nhập nội dung tố cáo"
          ></textarea>
        </div>
        <div className="form__upload-wrap">
          {previewImages.map((img, index) => (
            <div className="form__image-preview" key={index}>
              <div className="form__preview-remove">
                <img
                  src={close}
                  alt="close icon"
                  onClick={() => handleRemoveImage(index)}
                  className="form__remove-icon"
                />
              </div>
              <img src={img} alt="preview" className="form__preview-img" />
            </div>
          ))}
          <div className="form__upload-group">
            <label className="form__upload">
              <input
                type="file"
                className="form__upload-input"
                accept="image/*"
                onChange={handleFile}
                multiple
                hidden
              />
              <img
                src={addimg}
                alt="addimg icon"
                className="form__upload-icon"
              />
              <span className="form__upload-text">Chọn ảnh</span>
            </label>
          </div>
        </div>
        <div className="form__action-group">
          <div className="form__action-item">
            <input
              type="radio"
              name="r_status"
              value="Nạn nhân"
              className="form__radio-input"
              checked={status === "Nạn nhân"}
              onChange={handleChange}
            />
            <label className="form__title-radio">Tôi là nạn nhân</label>
          </div>
          <div className="form__action-item">
            <input
              type="radio"
              name="r_status"
              value="Đăng hộ"
              className="form__radio-input"
              checked={status === "Đăng hộ"}
              onChange={handleChange}
            />
            <label className="form__title-radio">Tôi chỉ đăng hộ</label>
          </div>
        </div>
        <button onClick={openDeleteModal} className="btn form-report__btn">
          Gửi tố cáo
        </button>
      </div>

      {openConfirmDelete && (
        <div className="confirm-modal">
          <div className="confirm-modal__overlay"></div>
          <div className="confirm-modal__wrapper">
            <div className="confirm-modal__header">
              <i className="fa-solid fa-circle-exclamation"></i>
              <h3>Xác nhận gửi đơn tố cáo?</h3>
            </div>
            <div className="confirm-modal__content">
              <i
                className="fa-solid fa-circle-check confirm"
                onClick={handleConfirmSubmit}
              ></i>
              <i
                className="fa-solid fa-circle-xmark reject"
                onClick={closeDeleteModal}
              ></i>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Report;
