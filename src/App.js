import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./css/App.css";
import HomePage from "./pages/HomePage.js";
import Scammer from "./pages/Scammer.js";
import Introduce from "./pages/Introduce.js";
import Profile from "./pages/Profile.js";
import Report from "./pages/Report.js";
import shield from "./image/shield.png";
import stars from "./image/stars.png";
import Login from "./pages/Login.js";
import Admin from "./pages/Admin.js";
import Register from "./pages/Register.js";
import Pending from "./pages/Pending.js";
import Warning from "./pages/Warning.js";
import User from "./pages/User.js";
import Rejected from "./pages/Rejected.js";
import PrivateRoute from "./PrivateRoute.js";
import UserLayout from "./layout/UserLayout.js";
import LoginLayout from "./layout/LoginLayout.js";
import AdminLayout from "./layout/AdminLayout.js";
import AdminRoute from "./AdminRoute.js";
function App() {
  const location = useLocation();

  const showHeader = !(
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/admin"
  );

  return (
    <>
      <div className="images-fixed">
        <img src={shield} alt="shield icon" className="image-shield" />
        <img src={stars} alt="star icon" className="image-stars" />
      </div>
      <div className="effect-circle-1"></div>
      <div className="effect-circle-2"></div>

      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/scammer" element={<Scammer />} />
          <Route path="/introduce" element={<Introduce />} />
        </Route>

        <Route path="/" element={<UserLayout />}>
          {/* <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
          <Route
            path="/scammer"
            element={<PrivateRoute element={<Scammer />} />}
          />
          <Route
            path="/introduce"
            element={<PrivateRoute element={<Introduce />} />}
          /> */}
          <Route
            path="/report"
            element={<PrivateRoute element={<Report />} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute element={<Profile />} />}
          />
        </Route>

        <Route path="/" element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="/admin/scammer"
            element={<AdminRoute element={<Admin />} />}
          />
          <Route
            path="/admin/pending"
            element={<AdminRoute element={<Pending />} />}
          />
          <Route
            path="/admin/warning"
            element={<AdminRoute element={<Warning />} />}
          />
          <Route
            path="/admin/user"
            element={<AdminRoute element={<User />} />}
          />
          <Route
            path="/admin/rejected"
            element={<AdminRoute element={<Rejected />} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
