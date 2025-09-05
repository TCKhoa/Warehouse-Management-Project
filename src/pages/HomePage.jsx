// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import MapWithPoints from "../components/MapWithPoints";
import WarehouseMap from "../components/WarehouseMap";
import api from "../services/api";
import "../styles/HomePage.scss";

export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalEmployees: 0,
    importToday: 0,
    exportToday: 0,
  });
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const zones = [
    { id: 1, label: "A", x: 41, y: 39.5 },
    { id: 2, label: "B", x: 56.5, y: 39.5 },
    { id: 3, label: "C", x: 41, y: 50 },
    { id: 4, label: "D", x: 56.5, y: 50 },
    { id: 5, label: "E", x: 41, y: 60.5 },
    { id: 6, label: "F", x: 56.5, y: 60.5 },
  ];

  // Lấy role từ localStorage hoặc sessionStorage
  useEffect(() => {
    const storedRole = localStorage.getItem("role") || sessionStorage.getItem("role");
    if (storedRole) setRole(storedRole.toLowerCase());
  }, []);

  // Lấy dữ liệu thống kê chỉ khi role là admin
  useEffect(() => {
    if (!role || role !== "admin") return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const today = new Date().toISOString().split("T")[0];

        const [products, users, importReceipts, exportReceipts] = await Promise.all([
          api.getProducts(),
          api.getUsers(),
          api.getImportReceipts(),
          api.getExportReceipts(),
        ]);

        setStats({
          totalProducts: products.length,
          totalEmployees: users.length,
          importToday: importReceipts.filter(item => item.createdAt?.startsWith(today)).length,
          exportToday: exportReceipts.filter(item => item.createdAt?.startsWith(today)).length,
        });
      } catch (err) {
        console.error("Lỗi khi lấy thống kê:", err);
        setError("Không thể tải thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [role]);

  return (
    <div className="homepage">
      <h2>Dashboard kho hàng</h2>

      {/* Thông báo lỗi hoặc loading */}
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Đang tải thống kê...</div>}

      {/* Chỉ hiển thị stats-grid nếu role là admin */}
      {role === "admin" && !loading && !error && (
        <div className="stats-grid">
          <div className="stats-card">
            <h4>Tổng sản phẩm</h4>
            <div className="value">{stats.totalProducts}</div>
          </div>
          <div className="stats-card">
            <h4>Tổng nhân viên</h4>
            <div className="value">{stats.totalEmployees}</div>
          </div>
          <div className="stats-card">
            <h4>Nhập hôm nay</h4>
            <div className="value">{stats.importToday}</div>
          </div>
          <div className="stats-card">
            <h4>Xuất hôm nay</h4>
            <div className="value">{stats.exportToday}</div>
          </div>
        </div>
      )}

      <div className="map-section">
        <h3>Sơ đồ kho hàng</h3>
        <MapWithPoints zones={zones} onZoneClick={setSelectedArea} />
      </div>

      {selectedArea && (
        <WarehouseMap area={selectedArea} onClose={() => setSelectedArea(null)} />
      )}
    </div>
  );
}
