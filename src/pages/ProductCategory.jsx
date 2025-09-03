import React, { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import api from "../services/api"; // ✅ import API
import "../styles/ProductMeta.scss";

export default function ProductCategory() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  // ---------------- Lấy danh sách category từ API ----------------
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Lỗi khi tải categories:", err);
      alert("❌ Không thể tải danh sách danh mục!");
    }
  };

  // ---------------- Thêm / Cập nhật ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId !== null) {
        await api.updateCategory(editingId, editingData);
        await fetchCategories();
        setEditingId(null);
        setEditingData({});
        alert("✅ Cập nhật danh mục thành công!");
      } else {
        await api.createCategory({ name, slug, description });
        await fetchCategories();
        setName("");
        setSlug("");
        setDescription("");
        alert("✅ Thêm danh mục thành công!");
      }
    } catch (err) {
      console.error("Lỗi khi lưu category:", err);
      alert("❌ Có lỗi xảy ra khi lưu danh mục!");
    }
  };

  // ---------------- Chỉnh sửa ----------------
  const handleEditClick = (category) => {
    setEditingId(category.id);
    setEditingData({ ...category });
    setActiveDropdown(null);
  };

  // ---------------- Xóa ----------------
  const handleDeleteClick = (category) => {
    setConfirmDeleteId(category.id);
    setConfirmDeleteName(category.name);
    setActiveDropdown(null);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteCategory(confirmDeleteId);
      await fetchCategories();
      if (editingId === confirmDeleteId) {
        setEditingId(null);
        setEditingData({});
      }
      alert(`🗑️ Đã xóa danh mục "${confirmDeleteName}" thành công!`);
    } catch (err) {
      console.error("Lỗi khi xóa category:", err);
      alert("❌ Không thể xóa danh mục!");
    }
    setConfirmDeleteId(null);
    setConfirmDeleteName("");
  };

  const handleBackToAdd = () => {
    setEditingId(null);
    setEditingData({});
  };

  return (
    <div className="category-page">
      <h2>📂 Danh mục sản phẩm</h2>

      <div className="category-container">
        {/* Form Thêm hoặc Sửa */}
        <form onSubmit={handleSubmit} className="category-form">
          <div className="back-edit-placeholder">
            {editingId ? (
              <div className="back-edit" onClick={handleBackToAdd}>
                <IoArrowBackOutline />
                <span>Quay lại thêm danh mục</span>
              </div>
            ) : (
              <div className="back-edit fake"></div>
            )}
          </div>

          <h3>{editingId ? "✏️ Sửa danh mục" : "➕ Thêm danh mục mới"}</h3>

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
                ? setEditingData({
                    ...editingData,
                    description: e.target.value,
                  })
                : setDescription(e.target.value)
            }
          ></textarea>

          <button type="submit">
            {editingId ? "Lưu thay đổi" : "Thêm danh mục"}
          </button>
        </form>

        {/* Danh sách danh mục */}
        <table className="category-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Đường dẫn</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>{cat.description || "—"}</td>
                <td>{cat.slug}</td>
                <td className="action-cell">
                  <div className="dropdown">
                    <FaCog
                      className="icon"
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === cat.id ? null : cat.id
                        )
                      }
                    />
                    {activeDropdown === cat.id && (
                      <div className="dropdown-menu">
                        <div onClick={() => handleEditClick(cat)}>Sửa</div>
                        <div onClick={() => handleDeleteClick(cat)}>Xóa</div>
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
              Bạn có chắc chắn muốn xóa danh mục{" "}
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
