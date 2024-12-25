// try {
//     const response = await axios.post("https://scammerchecker.onrender.com/login", {
//       username,
//       password,
//     });

//     const token = response.data.token;
//     const decodedToken = jwtDecode(token);

//     console.log(response);
//     console.log(decodedToken.id);
//     console.log(decodedToken);

//     // Lưu token vào localStorage
//     localStorage.setItem("token", response.data.token);
//     localStorage.setItem("userId", decodedToken.id);

//     // Hiển thị thông báo đăng nhập thành công
//     setSuccessMessage("Đăng nhập thành công!");

//     // Sau 1 giây, chuyển hướng đến trang khác tùy thuộc vào username
//     setTimeout(() => {
//       if (username === "admin") {
//         navigate("/admin/scammer"); // Nếu là admin, chuyển hướng đến /admin/scammer
//       } else {
//         navigate("/"); // Nếu là user bình thường, chuyển hướng đến trang chính
//       }
//     }, 1000); // Chờ 1 giây trước khi chuyển hướng
//   } catch (err) {
//     setError("Thông tin đăng nhập không chính xác!"); // Hiển thị thông báo lỗi
//   }
