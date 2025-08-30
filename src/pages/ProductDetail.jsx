// src/pages/ProductDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/ProductEdit.scss"; // dùng lại chung SCSS
import api from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getProductById(id)
      .then((res) => {
        setProduct(res);
        setLoading(false);
      })
      .catch(() => {
        setError("Không tìm thấy sản phẩm!");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-edit-page">
      <h2>📦 Chi tiết sản phẩm</h2>
      <form>
        {/* Tên sản phẩm */}
        <div className="row full-width">
          <div className="field">
            <label>Tên sản phẩm</label>
            <p>{product.name}</p>
          </div>
        </div>

        {/* Mã SP + Danh mục + Thương hiệu */}
        <div className="row">
          <div className="field">
            <label>Mã sản phẩm</label>
            <p>{product.productCode}</p>
          </div>

          <div className="field">
            <label>Danh mục</label>
            <p>{product.categoryName || "—"}</p>
          </div>

          <div className="field">
            <label>Thương hiệu</label>
            <p>{product.brandName || "—"}</p>
          </div>
        </div>

        {/* Đơn vị + Khu vực + Giá + SL */}
        <div className="row">
          <div className="field">
            <label>Đơn vị tính</label>
            <p>{product.unitName || "—"}</p>
          </div>

          <div className="field">
            <label>Khu vực</label>
            <p>{product.locationName || "—"}</p>
          </div>

          <div className="field">
            <label>Giá (VND)</label>
            <p>{product.importPrice?.toLocaleString() || 0}</p>
          </div>

          <div className="field">
            <label>Số lượng</label>
            <p>{product.stock}</p>
          </div>
        </div>

        {/* Ảnh */}
        <div className="row full-width">
          <div className="field">
            <label>Ảnh sản phẩm</label>
            <img
              src={product.imageUrl || "/no-image.png"}
              alt={product.name}
              width="80"
              style={{ marginBottom: "10px", borderRadius: "8px" }}
            />
          </div>
        </div>

        {/* Action */}
        <div className="row full-width">
          
          <Link to={`/products/${id}/edit`}>
            <button type="button">✏️ Chỉnh sửa</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
