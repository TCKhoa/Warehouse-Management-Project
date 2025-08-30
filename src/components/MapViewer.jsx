// src/components/MapViewer.jsx
import React from "react";
import "../styles/MapWithPoints.scss";
import warehouseImg from "../assets/WM.jpg";

export default function MapViewer() {
  const zones = JSON.parse(localStorage.getItem("warehouseZones")) || [];

  return (
    <div className="map-viewer">
      <img src={warehouseImg} alt="warehouse" className="map-background" />
      {zones.map((zone) => (
        <div
          key={zone.id}
          className="zone-point"
          style={{
            left: zone.x,
            top: zone.y,
            width: zone.width,
            height: zone.height,
          }}
        >
          <div className="zone-label">{zone.label}</div>
        </div>
      ))}
    </div>
  );
}
