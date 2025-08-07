import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSortUp, FaSortDown } from "react-icons/fa";
import "../styles/ProductList.scss";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState("");

  const dropdownRef = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "Bàn phím cơ G6",
        product_code: "SP001",
        quantity: 15,
        price: 1200000,
        category_name: "Thiết bị ngoại vi",
        brand_name: "Logitech",
        image_url: "https://via.placeholder.com/50",
        updated_at: "2025-08-06T10:00:00Z",
      },
      {
        id: 2,
        name: "Chuột không dây",
        product_code: "SP002",
        quantity: 0,
        price: 450000,
        category_name: "Chuột",
        brand_name: "Razer",
        image_url: "https://via.placeholder.com/50",
        updated_at: "2025-08-05T14:30:00Z",
      },
    ];
    setProducts(mockData);
    setFilteredProducts(mockData);
  }, []);

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


  useEffect(() => {
    const result = products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.product_code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = !filterCategory || p.category_name === filterCategory;
      const matchBrand = !filterBrand || p.brand_name === filterBrand;
      const matchStock =
        !filterStock || (filterStock === "in" ? p.quantity > 0 : p.quantity === 0);

      return matchSearch && matchCategory && matchBrand && matchStock;
    });

    if (!filterCategory && !filterBrand && !filterStock && searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(result);
    }
  }, [products, filterCategory, filterBrand, filterStock, searchTerm]);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);

    const sorted = [...filteredProducts].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredProducts(sorted);
  };

  const handleDeleteClick = (product) => {
    setConfirmDeleteId(product.id);
    setConfirmDeleteName(product.name);
  };

  const confirmDeleteProduct = () => {
    setProducts((prev) => prev.filter((p) => p.id !== confirmDeleteId));
    setFilteredProducts((prev) => prev.filter((p) => p.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    setConfirmDeleteName("");
  };

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

      <div className="filters">
        <select onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          <option value="Thiết bị ngoại vi">Thiết bị ngoại vi</option>
          <option value="Chuột">Chuột</option>
        </select>
        <select onChange={(e) => setFilterBrand(e.target.value)}>
          <option value="">Tất cả thương hiệu</option>
          <option value="Logitech">Logitech</option>
          <option value="Razer">Razer</option>
        </select>
        <select onChange={(e) => setFilterStock(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="in">Còn hàng</option>
          <option value="out">Hết hàng</option>
        </select>
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
            <th><input type="checkbox" checked={selectAll} onChange={handleSelectAll} /></th>
            <th>Ảnh</th>
            <th onClick={() => handleSort("name")}>
              Tên
              <FaSortUp className={sortField === "name" && sortOrder === "asc" ? "active" : ""} />
              <FaSortDown className={sortField === "name" && sortOrder === "desc" ? "active" : ""} />
            </th>
            <th onClick={() => handleSort("product_code")}>
              Mã SP
              <FaSortUp className={sortField === "product_code" && sortOrder === "asc" ? "active" : ""} />
              <FaSortDown className={sortField === "product_code" && sortOrder === "desc" ? "active" : ""} />
            </th>
            <th>Tồn kho</th>
            <th onClick={() => handleSort("price")}>
              Giá
              <FaSortUp className={sortField === "price" && sortOrder === "asc" ? "active" : ""} />
              <FaSortDown className={sortField === "price" && sortOrder === "desc" ? "active" : ""} />
            </th>
            <th>Danh mục</th>
            <th>Thương hiệu</th>
            <th onClick={() => handleSort("updated_at")}>
              Ngày cập nhật
              <FaSortUp className={sortField === "updated_at" && sortOrder === "asc" ? "active" : ""} />
              <FaSortDown className={sortField === "updated_at" && sortOrder === "desc" ? "active" : ""} />
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
              <td><img src={p.image_url} alt={p.name} width="50" /></td>
              <td>{p.name}</td>
              <td>{p.product_code}</td>
              <td style={{ color: p.quantity === 0 ? "red" : "green" }}>
                {p.quantity > 0 ? "Còn hàng" : "Hết hàng"}
              </td>
              <td>{p.price.toLocaleString()} ₫</td>
              <td>{p.category_name}</td>
              <td>{p.brand_name}</td>
              <td>{new Date(p.updated_at).toLocaleString()}</td>
              <td className="action-cell">
                <div className="dropdown" ref={(el)=>(dropdownRef.current[p.id]=el)}>
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
            <p>Bạn có chắc chắn muốn xóa sản phẩm <strong>{confirmDeleteName}</strong> không?</p>
            <div className="confirm-buttons">
              <button onClick={() => setConfirmDeleteId(null)}>Hủy</button>
              <button onClick={confirmDeleteProduct} className="danger">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
