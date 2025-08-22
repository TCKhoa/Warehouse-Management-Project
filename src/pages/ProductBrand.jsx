// src/pages/ProductBrand.jsx
import React, { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import api from "../services/api";
import "../styles/ProductMeta.scss";

export default function ProductBrand() {
  const [brands, setBrands] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Lấy danh sách thương hiệu từ backend
  const fetchBrands = async () => {
    try {
      const data = await api.getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Thêm / sửa thương hiệu
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        // Sửa
        await api.updateBrand(editingId, editingData);
        setEditingId(null);
        setEditingData({});
      } else {
        // Thêm mới
        await api.createBrand({ name, slug, description });
        setName("");
        setSlug("");
        setDescription("");
      }
      fetchBrands();
    } catch (error) {
      console.error("Lỗi khi lưu thương hiệu:", error);
    }
  };

  const handleEditClick = (brand) => {
    setEditingId(brand.id);
    setEditingData({ ...brand });
    setActiveDropdown(null);
  };

  const handleDeleteClick = (brand) => {
    setConfirmDeleteId(brand.id);
    setConfirmDeleteName(brand.name);
    setActiveDropdown(null);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteBrand(confirmDeleteId);
      if (editingId === confirmDeleteId) {
        setEditingId(null);
        setEditingData({});
      }
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
      fetchBrands();
    } catch (error) {
      console.error("Lỗi khi xóa thương hiệu:", error);
    }
  };

  const handleCheckAll = () => {
    if (selectedAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(brands.map((brand) => brand.id));
    }
    setSelectedAll(!selectedAll);
  };

  const handleCheckItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBackToAdd = () => {
    setEditingId(null);
    setEditingData({});
  };

  return (
    <div className="category-page">
      <h2>🏷️ Thương hiệu sản phẩm</h2>

      <div className="category-container">
        {/* Form Thêm hoặc Sửa */}
        <form onSubmit={handleSubmit} className="category-form">
          <div className="back-edit-placeholder">
            {editingId ? (
              <div className="back-edit" onClick={handleBackToAdd}>
                <IoArrowBackOutline />
                <span>Quay lại thêm thương hiệu</span>
              </div>
            ) : (
              <div className="back-edit fake"></div>
            )}
          </div>

          <h3>{editingId ? "✏️ Sửa thương hiệu" : "➕ Thêm thương hiệu mới"}</h3>

          <label>Tên</label>
          <input
            type="text"
            value={editingId ? editingData.name : name}
            onChange={(e) =>
              editingId
                ? setEditingData({ ...editingData, name: e.target.value })
                : setName(e.target.value)
            }
            required
          />

          <label>Đường dẫn (slug)</label>
          <input
            type="text"
            value={editingId ? editingData.slug : slug}
            onChange={(e) =>
              editingId
                ? setEditingData({ ...editingData, slug: e.target.value })
                : setSlug(e.target.value)
            }
            required
          />

          <label>Mô tả</label>
          <textarea
            value={editingId ? editingData.description : description}
            onChange={(e) =>
              editingId
                ? setEditingData({ ...editingData, description: e.target.value })
                : setDescription(e.target.value)
            }
          ></textarea>

          <button type="submit">
            {editingId ? "Lưu thay đổi" : "Thêm thương hiệu"}
          </button>
        </form>

        {/* Danh sách thương hiệu */}
        <table className="category-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedAll}
                  onChange={handleCheckAll}
                />
              </th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Đường dẫn</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(brand.id)}
                    onChange={() => handleCheckItem(brand.id)}
                  />
                </td>
                <td>{brand.name}</td>
                <td>{brand.description || "—"}</td>
                <td>{brand.slug}</td>
                <td className="action-cell">
                  <div className="dropdown">
                    <FaCog
                      className="icon"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === brand.id ? null : brand.id
                        )
                      }
                    />
                    {activeDropdown === brand.id && (
                      <div className="dropdown-menu">
                        <div onClick={() => handleEditClick(brand)}>Sửa</div>
                        <div onClick={() => handleDeleteClick(brand)}>Xóa</div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal xác nhận xóa */}
      {confirmDeleteId !== null && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <p>
              Bạn có chắc chắn muốn xóa thương hiệu{" "}
              <strong>{confirmDeleteName}</strong>?
            </p>
            <div className="confirm-buttons">
              <button onClick={() => setConfirmDeleteId(null)}>Hủy</button>
              <button onClick={confirmDelete} className="danger">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
