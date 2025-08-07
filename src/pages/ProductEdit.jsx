import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductEdit.scss";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const data = {
      name: "Bàn phím cơ G6",
      product_code: "SP001",
      category: "Thiết bị ngoại vi",
      brand: "Logitech",
      unit: "Chiếc",
      location: "Khu A1",
      price: 1200000,
      quantity: 15,
      image_url: "https://via.placeholder.com/100",
    };
    setFormData((prev) => ({ ...prev, ...data }));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        imageFile: files[0],
        image_url: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cập nhật thành công!");
    navigate("/products");
  };

  return (
    <div className="product-edit-page">
      <h2>🖊️ Chỉnh sửa sản phẩm</h2>

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
              style={{ maxWidth: "100%", maxHeight: "120px", objectFit: "contain" }}
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
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
