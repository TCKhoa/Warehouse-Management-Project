import React from "react";
import warehouseImg from "../assets/img/WM.jpg";
import "../styles/MapWithPoints.scss";

export default function MapWithPoints({ zones, onZoneClick }) {
  return (
    <div className="map-container">
      <img src={warehouseImg} alt="Warehouse" className="map-image" />

      {zones.map((zone) => (
        <div
          key={zone.id}
          className="map-zone"
          style={{
            left: `${zone.x}%`,   // dùng %
            top: `${zone.y}%`,
          }}
          onClick={() => onZoneClick(zone)}
        >
          <span className="zone-label">{zone.label}</span>
        </div>
      ))}
    </div>
  );
}
