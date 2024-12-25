import React from "react";
import { useState, useEffect, useRef } from "react";
import "../css/HomePage.css";
import "../css/Scammer.css";
import scmravt from "../image/Scammer-Avt.png";
import rptravt from "../image/Reporter-Avt.png";
import close from "../image/Close.png";
import notfound from "../image/empty-box.png";
const Scammer = () => {
  const [scammers, setScammers] = useState([]);
  const [selectedScammer, setSelectedScammer] = useState([]);
  const [scammerIsOpen, setScammerIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchScammer = async () => {
      try {
        const response1 = await fetch(
          "https://scammerchecker.onrender.com/scammer/confirmed"
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

  return (
    <>
      <section className="content__custom">
        <form className="form-search__custom">
          <input
            type="text"
            placeholder="Kiểm tra số tài khoản ngân hàng..."
            className="form-search__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
          {/* <button className="btn form-search__btn" type="submit">
            Tìm Kiếm
          </button> */}
        </form>
      </section>
      <div className="container">
        <section className="alert-scam__custom">
          <div className="alert-scam__header">
            <h2 className="alert-scam__title title">Danh sách Scammer</h2>
            <p className="alert-scam__desc">CÓ {scammers.length} CẢNH BÁO</p>
          </div>
          {searchedScammers && searchedScammers.length > 0 ? (
            <ul className="scammer__list">
              {searchedScammers.map((scammer, id) => (
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
                Hôm nay chưa có cảnh báo nào...
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

export default Scammer;
