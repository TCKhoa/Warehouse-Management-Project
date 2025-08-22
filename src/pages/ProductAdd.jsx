import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ProductEdit.scss";

export default function ProductAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    product_code: "",
    categoryId: "",
    brandId: "",
    unitId: "",
    locationId: "",
    price: "",
    quantity: "",
    importPrice: "",
    image_url: "",
    imageFile: null,
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [locations, setLocations] = useState([]);

  // Load options from backend
  useEffect(() => {
    const fetchSelections = async () => {
      try {
        const [cats, brs, unts, locs] = await Promise.all([
          api.getCategories(),
          api.getBrands(),
          api.getUnits(),
          api.getLocations(),
        ]);
        setCategories(cats);
        setBrands(brs);
        setUnits(unts);
        setLocations(locs);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu select:", err);
      }
    };
    fetchSelections();
  }, []);

  // Auto-generate product code
  useEffect(() => {
    const timestamp = Date.now().toString().slice(-4);
    setFormData((prev) => ({ ...prev, product_code: `PR-${timestamp}` }));
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map to DTO for backend
      const submitData = {
        productCode: formData.product_code,
        name: formData.name,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        brandId: formData.brandId ? parseInt(formData.brandId) : null,
        unitId: formData.unitId ? parseInt(formData.unitId) : null,
        locationId: formData.locationId ? parseInt(formData.locationId) : null,
        importPrice: parseFloat(formData.price) || 0,
        stock: parseInt(formData.quantity) || 0,
        imageFile: formData.imageFile,
      };

      await api.createProduct(submitData);
      alert("Đã thêm sản phẩm mới!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Có lỗi xảy ra khi thêm sản phẩm.");
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
            readOnly
          />
        </div>

        <div className="field">
          <label htmlFor="categoryId">Danh mục</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
          >
            <option value="">--Chọn danh mục--</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="brandId">Thương hiệu</label>
          <select
            id="brandId"
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
          >
            <option value="">--Chọn thương hiệu--</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="unitId">Đơn vị tính</label>
          <select
            id="unitId"
            name="unitId"
            value={formData.unitId}
            onChange={handleChange}
          >
            <option value="">--Chọn đơn vị--</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="locationId">Khu vực</label>
          <select
            id="locationId"
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
          >
            <option value="">--Chọn khu vực--</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
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
              style={{ maxWidth: "200px", objectFit: "contain" }}
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
    </div>
  );
}
