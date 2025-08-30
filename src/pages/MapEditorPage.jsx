// src/pages/MapEditorPage.jsx
import React, { useState } from "react";
import MapWithPoints from "../components/MapWithPoints";

export default function MapEditorPage() {
  const [savedZones, setSavedZones] = useState([]);

  const handleSave = (zones) => {
    console.log("Lưu vào DB hoặc localStorage:", zones);
    setSavedZones(zones);
    localStorage.setItem("warehouseZones", JSON.stringify(zones));
  };

  return (
    <div>
      <h2>Chỉnh sửa sơ đồ kho</h2>
      <MapWithPoints
        initialZones={savedZones}
        onSave={handleSave}
      />
    </div>
  );
}
