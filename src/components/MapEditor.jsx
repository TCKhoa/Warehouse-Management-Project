import React, { useState } from "react";
import { Rnd } from "react-rnd";
import "../styles/MapEditor.scss";
import warehouseImg from "../assets/warehouse-map.png";

export default function MapEditor({ initialZones = [], onSave }) {
  const [zones, setZones] = useState(initialZones);

  const addZone = () => {
    setZones([
      ...zones,
      {
        id: `Zone-${zones.length + 1}`,
        x: 50,
        y: 50,
        width: 100,
        height: 80,
      },
    ]);
  };

  const updateZone = (i, newProps) => {
    const updated = [...zones];
    updated[i] = { ...updated[i], ...newProps };
    setZones(updated);
  };

  const handleSave = () => {
    // gọi API lưu vào backend hoặc localStorage
    onSave(zones);
  };

  return (
    <div className="map-editor">
      <div className="toolbar">
        <button onClick={addZone}>+ Thêm khu vực</button>
        <button onClick={handleSave}>💾 Lưu bản đồ</button>
      </div>

      <div className="map-canvas">
        <img src={warehouseImg} alt="warehouse" className="map-background" />

        {zones.map((zone, i) => (
          <Rnd
            key={zone.id}
            size={{ width: zone.width, height: zone.height }}
            position={{ x: zone.x, y: zone.y }}
            onDragStop={(e, d) => {
              updateZone(i, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateZone(i, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                ...position,
              });
            }}
            bounds="parent"
            className="zone"
          >
            <div className="zone-label">{zone.id}</div>
          </Rnd>
        ))}
      </div>
    </div>
  );
}
