import React from "react";
import { useState, useEffect, useRef } from "react";
import "../css/HomePage.css";
import scmravt from "../image/Scammer-Avt.png";
import rptravt from "../image/Reporter-Avt.png";
import down from "../image/down.png";
import undown from "../image/undown.png";
import close from "../image/Close.png";
import notfound from "../image/empty-box.png";
const HomePage = () => {
  const [warnings, setWarnings] = useState([]);
  const [scammers, setScammers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScammer, setSelectedScammer] = useState([]);
  const [scammerIsOpen, setScammerIsOpen] = useState(false);
  const [warningIsOpen, setWarningIsOpen] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const warningRef = useRef(null);

  useEffect(() => {
    // Lấy ngày hiện tại
    const date = new Date();
    setCurrentDate(date.toLocaleDateString("vi-VN")); // Định dạng ngày theo kiểu Việt Nam (DD/MM/YYYY)
  }, []);

  // Dùng useEffects để load lại list mỗi lần thay đổi gì đó bô ạ
  useEffect(() => {
    const fecthWarning = async () => {
      try {
        const response = await fetch(
          "https://scammerchecker.onrender.com/warning"
        );
        if (!response.ok) {
          throw new Error(`Lỗi khi lấy dữ liệu: ${response.status}`);
        }
        const warningData = await response.json();
        setWarnings(warningData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fecthWarning();
  }, []);

  useEffect(() => {
    const fetchScammer = async () => {
      try {
        const response1 = await fetch(
          "https://scammerchecker.onrender.com/scammer/todayscammers"
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
  //Hàm quản lý đóng mở bô ạ
  const toggleWarning = (warningid) => {
    //So sánh id hiện tại với trước đó nếu bằng thì chuyển thành null không bằng thì set giá trị mới
    setWarningIsOpen((prevWarningIsOpen) =>
      prevWarningIsOpen === warningid ? null : warningid
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (warningRef.current && !warningRef.current.contains(event.target)) {
        setWarningIsOpen(null); // Đóng dropdown nếu click ngoài
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <section className="content">
        <h1 className="content__heading">KIỂM TRA & TỐ CÁO Scammer</h1>
        <p className="content__desc">
          Website lưu trữ dữ liệu lừa đảo trên mạng xã hội
        </p>
        <form className="form-search">
          <input
            type="text"
            placeholder="Kiểm tra số tài khoản ngân hàng..."
            className="form-search__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
        </form>
      </section>
      <div className="container">
        <section className="alert-scam">
          <div className="alert-scam__header">
            <h2 className="alert-scam__title title">Hôm nay {currentDate}</h2>
            <p className="alert-scam__desc">
              CÓ {searchedScammers.length} CẢNH BÁO
            </p>
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
                Hôm nay chưa có cảnh báo nào
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

        <section className="warning" ref={warningRef}>
          <h2 className="warning__title title">
            Một số kiểu lừa đảo online thường gặp
          </h2>
          <ul className="warning__list">
            {loading ? (
              <div>Đang tải dữ liệu</div>
            ) : (
              warnings.map((warning, id) => (
                <li key={id} className="warning__item">
                  <div
                    className="warning__header"
                    onClick={() => toggleWarning(id)}
                  >
                    <span className="warning__header-icon">
                      <img
                        src={warningIsOpen === id ? down : undown}
                        alt="icon"
                      />
                    </span>
                    <h4 className="warning__Title">{warning.title}</h4>
                  </div>
                  <div
                    className={`warning__content ${
                      warningIsOpen === id ? "active" : ""
                    }`}
                  >
                    {warning.content}
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </>
  );
};

export default HomePage;
