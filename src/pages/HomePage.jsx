import React, { useState } from "react";
import MapWithPoints from "../components/MapWithPoints";
import WarehouseMap from "../components/WarehouseMap";
import "../styles/HomePage.scss";

export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState(null);

  const zones = [
  { id: 1, label: "A", x: 41, y: 39.5 },
  { id: 2, label: "B", x: 56.5, y: 39.5 },
  { id: 3, label: "C", x: 41, y: 50 },
  { id: 4, label: "D", x: 56.5, y: 50 },
  { id: 5, label: "E", x: 41, y: 60.5 },
  { id: 6, label: "F", x: 56.5, y: 60.5 },
];

  return (
    <div className="homepage">
      <h2>Dashboard kho hàng</h2>

      <div className="stats-grid">
        <div className="stats-card"><h4>Tổng sản phẩm</h4><div className="value">250</div></div>
        <div className="stats-card"><h4>Tồn kho</h4><div className="value">500</div></div>
        <div className="stats-card"><h4>Nhập hôm nay</h4><div className="value">10</div></div>
        <div className="stats-card"><h4>Xuất hôm nay</h4><div className="value">6</div></div>
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
