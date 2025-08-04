import React from 'react';
import "../styles/MapArea.scss";

const areas = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function MapArea({ onSelectArea }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {areas.map((area) => (
        <div
          key={area}
          className="area-box"
          onClick={() => onSelectArea(area)}
        >
          Khu vực {area}
        </div>
      ))}
    </div>
  );
}