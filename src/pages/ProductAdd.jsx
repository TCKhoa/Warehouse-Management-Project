import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductEdit.scss";

export default function ProductAdd() {
  const navigate = useNavigate();
  const [showCustomUnit, setShowCustomUnit] = useState(false);
  const [customUnit, setCustomUnit] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    product_code: "",
    category: "",
    brand: "",
    unit: "",
    location: "",
    price: "",
    quantity: "",
    image_url: "",
    imageFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageFile: files[0],
        image_url: URL.createObjectURL(files[0]),
      }));
    } else {
      if (name === "unit" && value === "Khác") {
        setShowCustomUnit(true);
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đã thêm sản phẩm mới!");
    navigate("/products");
  };

  const handleSaveCustomUnit = () => {
    if (customUnit.trim()) {
      setFormData((prev) => ({ ...prev, unit: customUnit }));
      setShowCustomUnit(false);
      setCustomUnit("");
    }
  };

  return (
    <div className="product-edit-page">
      <h2>➕ Thêm sản phẩm mới</h2>

      <div className="row full-width">
        <div className="field">
          <label htmlFor="name">Tên sản phẩm</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="product_code">Mã sản phẩm</label>
          <input
            id="product_code"
            type="text"
            name="product_code"
            value={formData.product_code}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="category">Danh mục</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">--Chọn danh mục--</option>
            <option value="Thiết bị ngoại vi">Thiết bị ngoại vi</option>
            <option value="Chuột">Chuột</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="brand">Thương hiệu</label>
          <select
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          >
            <option value="">--Chọn thương hiệu--</option>
            <option value="Logitech">Logitech</option>
            <option value="Razer">Razer</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="unit">Đơn vị tính</label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="">--Chọn đơn vị--</option>
            <option value="Chiếc">Chiếc</option>
            <option value="Bộ">Bộ</option>
            <option value="Khác">Khác...</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="location">Khu vực</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          >
            <option value="">--Chọn khu vực--</option>
            <option value="Khu A1">Khu A1</option>
            <option value="Khu B2">Khu B2</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="price">Giá (VND)</label>
          <input
            id="price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="quantity">Số lượng</label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row full-width">
        <div className="field">
          <label>Ảnh sản phẩm</label>
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt="product"
              style={{
                height: "auto",
                width: "auto",
                maxWidth: "200px",
                objectFit: "contain",
              }}
            />
          )}
          <input
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="row full-width">
        <button type="submit" onClick={handleSubmit}>
          Thêm sản phẩm
        </button>
      </div>

      {showCustomUnit && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Nhập đơn vị khác</h3>
            <input
              type="text"
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value)}
              placeholder="Nhập đơn vị..."
            />
            <div className="modal-actions">
              <button onClick={handleSaveCustomUnit}>OK</button>
              <button onClick={() => setShowCustomUnit(false)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
