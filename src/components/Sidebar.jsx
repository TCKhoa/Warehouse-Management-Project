// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import {
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoLogOutOutline,
} from "react-icons/io5";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Sidebar.scss";
import logo from "../assets/img/warehouse.png";
import useimg from "../assets/img/images.png";
import api from "../services/api";

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Lấy role, username và số thông báo chưa đọc
  useEffect(() => {
    const storedRole =
      localStorage.getItem("role") || sessionStorage.getItem("role");
    const storedUser =
      localStorage.getItem("username") || sessionStorage.getItem("username");

    if (storedRole) setRole(storedRole.toLowerCase());
    if (storedUser) setUsername(storedUser);

    const fetchUnread = async () => {
      try {
        const res = await api.getUnreadHistoryLogs();
        setUnreadNotifications(res.length || 0);
      } catch (err) {
        console.error("Lỗi lấy thông báo chưa đọc:", err);
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cập nhật menu/submenu active dựa vào URL
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/revenue") || path.startsWith("/statistics")) {
      setActiveMenu("dashboard");
      setOpenDropdown("dashboard");
      setActiveSubmenu(path);
    } else if (path.startsWith("/products")) {
      setActiveMenu("sanPham");
      setOpenDropdown("sanPham");
      setActiveSubmenu(path);
    } else if (path.startsWith("/import")) {
      setActiveMenu("import");
      setOpenDropdown("import");
      setActiveSubmenu(path);
    } else if (path.startsWith("/export")) {
      setActiveMenu("export");
      setOpenDropdown("export");
      setActiveSubmenu(path);
    } else if (path.startsWith("/staff")) {
      setActiveMenu("nhanVien");
      setOpenDropdown("nhanVien");
      setActiveSubmenu(path);
    } else if (path.startsWith("/inventory")) {
      setActiveMenu("inventory");
      setActiveSubmenu(path);
      setOpenDropdown(null);
    } else if (path.startsWith("/history-logs")) {
      setActiveMenu("history-logs");
      setActiveSubmenu(path);
      setOpenDropdown(null);
    } else {
      setActiveMenu(null);
      setActiveSubmenu(null);
      setOpenDropdown(null);
    }
  }, [location.pathname]);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const canManageStaff = ["admin", "management"].includes(role);

  // --- SweetAlert logout ---
  const handleLogout = () => {
  const confirmed = window.confirm("Bạn có chắc muốn đăng xuất?");
  if (confirmed) {
    // Xóa dữ liệu session/localStorage
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("token");
    setShowUserPopup(false);
    navigate("/login");
  }
};


  const menuItemClass = (menuKey) =>
    `menu-item has-sub ${activeMenu === menuKey ? "active" : ""}`;
  const submenuItemClass = (path) =>
    `submenu-item ${activeSubmenu === path ? "active" : ""}`;

  return (
    <>
      <div className="sidebar">
        <h1 className="sidebar-logo">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo-image" />
          </Link>
        </h1>

        <ul className="sidebar-menu">
          {/* Dashboard */}
          <li className={menuItemClass("dashboard")}>
            <div className="menu-label" onClick={() => toggleDropdown("dashboard")}>
              <span>Dashboard</span>
              <span className="menu-icon">
                {openDropdown === "dashboard" ? (
                  <IoChevronUpOutline />
                ) : (
                  <IoChevronDownOutline />
                )}
              </span>
            </div>
            {openDropdown === "dashboard" && (
              <ul className="submenu">
                <li className={submenuItemClass("/revenue")}>
                  <Link to="/revenue">Doanh thu</Link>
                </li>
                <li className={submenuItemClass("/statistics")}>
                  <Link to="/statistics">Thống kê giao dịch</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Sản phẩm */}
          <li className={menuItemClass("sanPham")}>
            <div className="menu-label" onClick={() => toggleDropdown("sanPham")}>
              <span>Sản phẩm</span>
              <span className="menu-icon">
                {openDropdown === "sanPham" ? (
                  <IoChevronUpOutline />
                ) : (
                  <IoChevronDownOutline />
                )}
              </span>
            </div>
            {openDropdown === "sanPham" && (
              <ul className="submenu">
                <li className={submenuItemClass("/products")}>
                  <Link to="/products">Tất cả sản phẩm</Link>
                </li>
                <li className={submenuItemClass("/products/add")}>
                  <Link to="/products/add">Thêm sản phẩm mới</Link>
                </li>
                <li className={submenuItemClass("/products/category")}>
                  <Link to="/products/category">Danh mục</Link>
                </li>
                <li className={submenuItemClass("/products/brand")}>
                  <Link to="/products/brand">Thương hiệu</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Nhập kho */}
          <li className={menuItemClass("import")}>
            <div className="menu-label" onClick={() => toggleDropdown("import")}>
              <span>Nhập kho</span>
              <span className="menu-icon">
                {openDropdown === "import" ? (
                  <IoChevronUpOutline />
                ) : (
                  <IoChevronDownOutline />
                )}
              </span>
            </div>
            {openDropdown === "import" && (
              <ul className="submenu">
                <li className={submenuItemClass("/import")}>
                  <Link to="/import">Danh sách phiếu nhập</Link>
                </li>
                <li className={submenuItemClass("/import-receipts/new")}>
                  <Link to="/import-receipts/new">Tạo phiếu nhập mới</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Xuất kho */}
          <li className={menuItemClass("export")}>
            <div className="menu-label" onClick={() => toggleDropdown("export")}>
              <span>Xuất kho</span>
              <span className="menu-icon">
                {openDropdown === "export" ? (
                  <IoChevronUpOutline />
                ) : (
                  <IoChevronDownOutline />
                )}
              </span>
            </div>
            {openDropdown === "export" && (
              <ul className="submenu">
                <li className={submenuItemClass("/export")}>
                  <Link to="/export">Danh sách phiếu xuất</Link>
                </li>
                <li className={submenuItemClass("/export-receipts/new")}>
                  <Link to="/export-receipts/new">Tạo phiếu xuất mới</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Tồn kho */}
          <li className={`menu-item ${activeMenu === "inventory" ? "active" : ""}`}>
            <Link to="/inventory">Tồn kho</Link>
          </li>

          {/* Nhân viên */}
          {canManageStaff && (
            <li className={menuItemClass("nhanVien")}>
              <div className="menu-label" onClick={() => toggleDropdown("nhanVien")}>
                <span>Nhân viên</span>
                <span className="menu-icon">
                  {openDropdown === "nhanVien" ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                </span>
              </div>
              {openDropdown === "nhanVien" && (
                <ul className="submenu">
                  <li className={submenuItemClass("/staff")}>
                    <Link to="/staff">Danh sách nhân viên</Link>
                  </li>
                  <li className={submenuItemClass("/staff/add")}>
                    <Link to="/staff/add">Thêm nhân viên</Link>
                  </li>
                </ul>
              )}
            </li>
          )}

          {/* Lịch sử hoạt động */}
          {role === "admin" && (
            <li className={`menu-item ${activeMenu === "history-logs" ? "active" : ""}`}>
              <Link to="/history-logs" className="history-link">
                Lịch sử hoạt động
                {unreadNotifications > 0 && (
                  <span className="notification-badge">{unreadNotifications}</span>
                )}
              </Link>
            </li>
          )}
        </ul>

        {/* User box */}
        <div className="sidebar-user" onClick={() => setShowUserPopup(true)}>
          <div className="user-info">
            <p className="user-name">{username || "Người dùng"}</p>
            <p className="user-role">Role: {role ? role.toUpperCase() : ""}</p>
          </div>
          <IoLogOutOutline className="logout-icon" />
        </div>
      </div>

      {/* User Popup */}
      {showUserPopup && (
        <div className="user-popup-overlay" onClick={() => setShowUserPopup(false)}>
          <div className="user-popup" onClick={(e) => e.stopPropagation()}>
            <img src={useimg} alt="Avatar" className="popup-avatar" />
            <h4>Tên người dùng: {username || "Người dùng"}</h4>
            <p className="popup-role">Role: {role ? role.toUpperCase() : "KHÁCH"}</p>
            <button className="logout-btn" onClick={handleLogout}>
              <IoLogOutOutline /> Đăng xuất
            </button>
          </div>
        </div>
      )}
    </>
  );
}
