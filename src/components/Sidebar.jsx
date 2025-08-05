import React, { useState } from "react";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import "../styles/Sidebar.scss";
import logo from "../assets/img/warehouse.png"

export default function Sidebar({ isAdmin }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <div className="sidebar">
      <h1 className="sidebar-logo">
        <Link to="/">
        <img src={logo} alt="Logo" className="logo-image" />
        </Link>
        </h1>
      <ul className="sidebar-menu">

        {/* Dashboard */}
        <li className="menu-item has-sub">
          <div className="menu-label" onClick={() => toggleDropdown("dashboard")}>
            <span>Dashboard</span>
            <span className="menu-icon">
              {openDropdown === "dashboard" ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
            </span>
          </div>
          {openDropdown === "dashboard" && (
            <ul className="submenu">
              <li className="submenu-item">
                <Link to="/revenue">Doanh thu</Link>
              </li>
              <li className="submenu-item">
                <Link to="/statistics">Thống kê giao dịch</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Sản phẩm */}
        <li className="menu-item has-sub">
          <div className="menu-label" onClick={() => toggleDropdown("sanPham")}>
            <span>Sản phẩm</span>
            <span className="menu-icon">
              {openDropdown === "sanPham" ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
            </span>
          </div>
          {openDropdown === "sanPham" && (
            <ul className="submenu">
              <li className="submenu-item">
                <Link to="/products">Tất cả sản phẩm</Link>
              </li>
              <li className="submenu-item">
                <Link to="/products/add">Thêm sản phẩm mới</Link>
              </li>
              <li className="submenu-item">
                <Link to="/products/category">Danh mục</Link>
              </li>
              <li className="submenu-item">
                <Link to="/products/brand">Thương hiệu</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Các mục đơn */}
        <li className="menu-item">
          <Link to="/import">Nhập kho</Link>
        </li>
        <li className="menu-item">
          <Link to="/export">Xuất kho</Link>
        </li>
        <li className="menu-item">
          <Link to="/inventory">Tồn kho</Link>
        </li>

        {/* Nhân viên */}
        {(isAdmin ?? true) && (
          <li className="menu-item has-sub">
            <div className="menu-label" onClick={() => toggleDropdown("nhanVien")}>
              <span>Nhân viên</span>
              <span className="menu-icon">
                {openDropdown === "nhanVien" ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
              </span>
            </div>
            {openDropdown === "nhanVien" && (
              <ul className="submenu">
                <li className="submenu-item">
                  <Link to="/staff">Danh sách nhân viên</Link>
                </li>
                <li className="submenu-item">
                  <Link to="/staff/add">Thêm nhân viên</Link>
                </li>
              </ul>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
