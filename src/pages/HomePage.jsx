import React, { useState } from 'react';
import MapArea from '../components/MapArea';
import AreaDetailModal from '../components/AreaDetailModal';
import "../styles/HomePage.scss";

export default function HomePage() {
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sơ đồ kho hàng</h2>
      <MapArea onSelectArea={setSelectedArea} />
      {selectedArea && (
        <AreaDetailModal area={selectedArea} onClose={() => setSelectedArea(null)} />
      )}
    </div>
  );
}