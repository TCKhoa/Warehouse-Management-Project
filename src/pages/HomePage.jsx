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

  const zones = [
    { id: 1, label: "A", x: 41, y: 39.5 },
    { id: 2, label: "B", x: 56.5, y: 39.5 },
    { id: 3, label: "C", x: 41, y: 50 },
    { id: 4, label: "D", x: 56.5, y: 50 },
    { id: 5, label: "E", x: 41, y: 60.5 },
    { id: 6, label: "F", x: 56.5, y: 60.5 },
  ];

  // Lấy dữ liệu từ API có sẵn
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // yyyy-MM-dd

        // Gọi tất cả API song song
        const [products, users, importReceipts, exportReceipts] = await Promise.all([
          api.getProducts(),
          api.getUsers(),
          api.getImportReceipts(),
          api.getExportReceipts(),
        ]);

        // 1. Tổng sản phẩm
        const totalProducts = products.length;

        // 2. Tổng nhân viên
        const totalEmployees = users.length;

        // 3. Nhập hôm nay
        const importToday = importReceipts.filter((item) =>
          item.createdAt?.startsWith(today)
        ).length;

        // 4. Xuất hôm nay
        const exportToday = exportReceipts.filter((item) =>
          item.createdAt?.startsWith(today)
        ).length;

        // Cập nhật state
        setStats({
          totalProducts,
          totalEmployees,
          importToday,
          exportToday,
        });
      } catch (error) {
        console.error("Lỗi khi lấy thống kê:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="homepage">
      <h2>Dashboard kho hàng</h2>

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
