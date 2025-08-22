// src/pages/ProductList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSortUp, FaSortDown } from "react-icons/fa";
import api from "../services/api";
import "../styles/ProductList.scss";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");
  const [backendError, setBackendError] = useState("");

  const dropdownRef = useRef({});
  const navigate = useNavigate();

  // Lấy sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        console.log("👉 Products từ backend:", data);
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err.response?.data || err.message);
        setBackendError("Không thể tải sản phẩm từ server");
      }
    };
    fetchProducts();
  }, []);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      const currentRef = dropdownRef.current[activeDropdown];
      if (currentRef && !currentRef.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // Filter + search + sort
  useEffect(() => {
    let result = products;

    // Filter
    result = result.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.productCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = !filterCategory || p.categoryName === filterCategory;
      const matchBrand = !filterBrand || p.brandName === filterBrand;
      const matchStock =
        !filterStock || (filterStock === "in" ? p.stock > 0 : p.stock === 0);
      return matchSearch && matchCategory && matchBrand && matchStock;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortField === "updatedAt") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(result);
  }, [products, searchTerm, filterCategory, filterBrand, filterStock, sortField, sortOrder]);

  // Thay đổi sắp xếp
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  // Xử lý xóa sản phẩm
  const handleDeleteClick = (product) => {
    setConfirmDeleteId(product.id);
    setConfirmDeleteName(product.name);
  };

  const confirmDeleteProduct = async () => {
    try {
      await api.deleteProduct(confirmDeleteId);
      setProducts((prev) => prev.filter((p) => p.id !== confirmDeleteId));
      setFilteredProducts((prev) => prev.filter((p) => p.id !== confirmDeleteId));
      setConfirmDeleteId(null);
      setConfirmDeleteName("");
      setBackendError("");
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err.response?.data || err.message);
      setBackendError("❌ Không thể xóa sản phẩm");
    }
  };

  // Chọn tất cả
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedIds(checked ? filteredProducts.map((p) => p.id) : []);
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="product-list-page">
      <h2>📦 Danh sách sản phẩm</h2>
      {backendError && <p className="error">{backendError}</p>}

      <div className="filters">
  {/* Lọc danh mục */}
  <select onChange={(e) => setFilterCategory(e.target.value)}>
    <option value="">Tất cả danh mục</option>
    {[...new Set(products.map(p => p.categoryName))].map((cat, i) => (
      <option key={i} value={cat}>{cat}</option>
    ))}
  </select>

  {/* Lọc thương hiệu */}
  <select onChange={(e) => setFilterBrand(e.target.value)}>
    <option value="">Tất cả thương hiệu</option>
    {[...new Set(products.map(p => p.brandName))].map((brand, i) => (
      <option key={i} value={brand}>{brand}</option>
    ))}
  </select>

  {/* Lọc trạng thái tồn kho */}
  <select onChange={(e) => setFilterStock(e.target.value)}>
    <option value="">Tất cả trạng thái</option>
    <option value="in">Còn hàng</option>
    <option value="out">Hết hàng</option>
  </select>

  {/* Tìm kiếm theo tên hoặc mã */}
  <input
    type="text"
    placeholder="Tìm tên hoặc mã SP..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
</div>


      <table className="product-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>Ảnh</th>
            <th onClick={() => handleSort("name")}>
              Tên
              <FaSortUp className={sortField === "name" && sortOrder === "asc" ? "active" : ""} />
              <FaSortDown className={sortField === "name" && sortOrder === "desc" ? "active" : ""} />
            </th>
            <th onClick={() => handleSort("productCode")}>
              Mã SP
              <FaSortUp className={sortField === "productCode" && sortOrder === "asc" ? "active" : ""} />
              <FaSortDown className={sortField === "productCode" && sortOrder === "desc" ? "active" : ""} />
            </th>
            <th>Tồn kho</th>
            <th onClick={() => handleSort("importPrice")}>
              Giá
              <FaSortUp className={sortField === "importPrice" && sortOrder === "asc" ? "active" : ""} />
              <FaSortDown className={sortField === "importPrice" && sortOrder === "desc" ? "active" : ""} />
            </th>
            <th>Danh mục</th>
            <th>Thương hiệu</th>
            <th onClick={() => handleSort("updatedAt")}>
              Ngày cập nhật
              <FaSortUp className={sortField === "updatedAt" && sortOrder === "asc" ? "active" : ""} />
              <FaSortDown className={sortField === "updatedAt" && sortOrder === "desc" ? "active" : ""} />
            </th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(p.id)}
                  onChange={() => handleSelectRow(p.id)}
                />
              </td>
              <td>
                <img src={p.imageUrl || "/no-image.png"} alt={p.name} width="50" />

              </td>
              <td>{p.name}</td>
              <td>{p.productCode}</td>
              <td style={{ color: p.stock === 0 ? "red" : "green" }}>
                {p.stock > 0 ? "Còn hàng" : "Hết hàng"}
              </td>
              <td>{p.importPrice.toLocaleString()} ₫</td>
              <td>{p.categoryName}</td>
              <td>{p.brandName}</td>
              <td>{new Date(p.updatedAt).toLocaleString()}</td>
              <td className="action-cell">
                <div className="dropdown" ref={(el) => (dropdownRef.current[p.id] = el)}>
                  <FaCog
                    className="icon"
                    onClick={() =>
                      setActiveDropdown(activeDropdown === p.id ? null : p.id)
                    }
                  />
                  {activeDropdown === p.id && (
                    <div className="dropdown-menu">
                      <div onClick={() => navigate(`/products/${p.id}/edit`)}>Sửa</div>
                      <div onClick={() => handleDeleteClick(p)}>Xóa</div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal xác nhận xóa */}
      {confirmDeleteId !== null && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm{" "}
              <strong>{confirmDeleteName}</strong> không?
            </p>
            <div className="confirm-buttons">
              <button onClick={() => setConfirmDeleteId(null)}>Hủy</button>
              <button onClick={confirmDeleteProduct} className="danger">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
