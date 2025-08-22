// src/pages/ProductEdit.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductEdit.scss";
import api from "../services/api";

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    productCode: "",
    categoryId: "",
    brandId: "",
    unitId: "",
    locationId: "",
    importPrice: "",
    stock: "",
    image_url: "",
    imageFile: null,
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [units, setUnits] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Lấy dữ liệu phụ trợ
  useEffect(() => {
    Promise.all([api.getCategories(), api.getBrands(), api.getUnits(), api.getLocations()])
      .then(([cats, brs, uns, locs]) => {
        setCategories(cats);
        setBrands(brs);
        setUnits(uns);
        setLocations(locs);
      })
      .catch(() => setError("Không load được dữ liệu phụ trợ!"));
  }, []);

  // Lấy thông tin sản phẩm
  useEffect(() => {
    api
      .getProductById(id)
      .then((res) => {
        setFormData({
          name: res.name || "",
          productCode: res.productCode || "",
          categoryId: res.categoryId || "",
          brandId: res.brandId || "",
          unitId: res.unitId || "",
          locationId: res.locationId || "",
          importPrice: res.importPrice ?? 0,
          stock: res.stock ?? 0,
          image_url: res.imageUrl || "",
          imageFile: null,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Không tìm thấy sản phẩm!");
        setLoading(false);
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const dataToSend = { ...formData };
      delete dataToSend.imageFile;
      delete dataToSend.image_url;

      // Convert số
      dataToSend.importPrice = Number(dataToSend.importPrice) || 0;
      dataToSend.stock = Number(dataToSend.stock) || 0;

      // Convert ID sang Number hoặc null
      ["categoryId", "brandId", "unitId", "locationId"].forEach((key) => {
        if (!dataToSend[key]) dataToSend[key] = null;
        else dataToSend[key] = Number(dataToSend[key]);
      });

      // FE
const formDataToSend = new FormData();
formDataToSend.append("product", JSON.stringify(dataToSend)); // remove Blob
if (formData.imageFile) formDataToSend.append("imageFile", formData.imageFile);

await api.updateProduct(id, formDataToSend);

      alert("✅ Cập nhật sản phẩm thành công!");
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError("❌ Cập nhật thất bại. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-edit-page">
      <h2>🖊️ Chỉnh sửa sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        {/* Tên sản phẩm */}
        <div className="row full-width">
          <div className="field">
            <label htmlFor="name">Tên sản phẩm</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Mã SP + Danh mục + Thương hiệu */}
        <div className="row">
          <div className="field">
            <label htmlFor="productCode">Mã sản phẩm</label>
            <input
              id="productCode"
              type="text"
              name="productCode"
              value={formData.productCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="categoryId">Danh mục</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">--Chọn danh mục--</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
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
              required
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

        {/* Đơn vị + Khu vực + Giá + SL */}
        <div className="row">
          <div className="field">
            <label htmlFor="unitId">Đơn vị tính</label>
            <select
              id="unitId"
              name="unitId"
              value={formData.unitId}
              onChange={handleChange}
              required
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
              required
            >
              <option value="">--Chọn khu vực--</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="importPrice">Giá (VND)</label>
            <input
              id="importPrice"
              type="number"
              name="importPrice"
              value={formData.importPrice}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <div className="field">
            <label htmlFor="stock">Số lượng</label>
            <input
              id="stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        {/* Ảnh */}
        <div className="row full-width">
          <div className="field">
            <label>Ảnh sản phẩm</label>
            {formData.image_url && (
              <img
                src={formData.image_url || "/no-image.png"}
                alt={formData.name}
                width="80"
                style={{ marginBottom: "10px", borderRadius: "8px" }}
              />
            )}
            <input type="file" name="imageFile" accept="image/*" onChange={handleChange} />
          </div>
        </div>

        {/* Submit */}
        <div className="row full-width">
          <button type="submit" disabled={submitting}>
            {submitting ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
