import React, { useEffect, useState } from 'react';
import "../styles/AreaDetailModal.scss";

export default function AreaDetailModal({ area, onClose }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const mockData = {
      A: [{ id: 1, name: 'Gạo', quantity: 100 }],
      B: [{ id: 2, name: 'Đường', quantity: 50 }],
      C: [{ id: 3, name: 'Nước mắm', quantity: 80 }],
      D: [{ id: 4, name: 'Bột giặt', quantity: 120 }],
      E: [],
      F: [{ id: 5, name: 'Dầu ăn', quantity: 60 }],
    };
    setProducts(mockData[area] || []);
  }, [area]);

  return (
    <div className="area-modal-overlay" onClick={onClose}>
      <div
        className="area-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <h3 className="modal-title">Chi tiết khu vực {area}</h3>

        {products.length === 0 ? (
          <p className="no-products">Không có sản phẩm trong khu vực này.</p>
        ) : (
          <ul>
            {products.map((p) => (
              <li key={p.id} className="product-item">
                <span>{p.name}</span>
                <span>SL: {p.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}