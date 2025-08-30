import React, { useEffect, useState } from "react";
import "../styles/WarehouseMap.scss";
import api from "../services/api";

export default function WarehouseMap({ area, onClose }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!area) return;

    const fetchProducts = async () => {
      try {
        // Gọi API trực tiếp lấy sản phẩm theo locationId
        const zoneProducts = await api.getProductsByLocation(area.id);
        setProducts(zoneProducts);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [area]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Sản phẩm trong khu vực {area.label}</h3>

        {loading ? (
          <p>Đang tải...</p>
        ) : products.length > 0 ? (
          <div className="table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá nhập</th>
                  <th>Hành động</th>
                  
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.productCode}</td>
                    <td>{p.name}</td>
                    <td>{p.stock}</td>
                    <td>{p.importPrice?.toLocaleString()} đ</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => {
                          window.location.href = `/products/${p.id}`;
                        }}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Không có sản phẩm nào trong khu vực này.</p>
        )}

        <button className="close-btn" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}
