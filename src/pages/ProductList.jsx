// src/pages/ProductList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import Swal from "sweetalert2";
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
  const [backendError, setBackendError] = useState("");

  const dropdownRef = useRef({});
  const navigate = useNavigate();

  // phân trang
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Lấy sản phẩm từ backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
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
        !filterStock ||
        (filterStock === "in"
          ? p.stock > 0
          : filterStock === "out"
          ? p.stock === 0
          : true);
      return matchSearch && matchCategory && matchBrand && matchStock;
    });

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(result);
    setCurrentPage(1); // reset về trang đầu khi filter thay đổi
  }, [products, searchTerm, filterCategory, filterBrand, filterStock, sortField, sortOrder]);

  // Xử lý sắp xếp
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  // Export icon sort
  const getSortIcon = (field) => {
    if (sortField !== field) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  // Xử lý xóa sản phẩm
  const handleDeleteClick = (product) => {
    Swal.fire({
      title: `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xóa ngay!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteProduct(product.id);
          setProducts((prev) => prev.filter((p) => p.id !== product.id));
          setFilteredProducts((prev) => prev.filter((p) => p.id !== product.id));

          Swal.fire({
            title: "Đã xóa!",
            text: `Sản phẩm "${product.name}" đã được xóa thành công.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error("Lỗi khi xóa sản phẩm:", err.response?.data || err.message);
          Swal.fire({
            title: "Lỗi!",
            text: "Không thể xóa sản phẩm. Vui lòng thử lại.",
            icon: "error",
          });
        }
      }
    });
  };

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentProducts = filteredProducts.slice(start, end);

  return (
    <div className="product-list-page">
      <h2>📦 Danh sách sản phẩm</h2>
      {backendError && <p className="error">{backendError}</p>}
      {/* chọn số sản phẩm / trang đặt dưới bảng */}
      <div className="top-controls">
      <div className="pagination-control">
        <label>
          Hiển thị
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          sản phẩm mỗi trang
        </label>
      </div>

      {/* bộ lọc */}
      <div className="filters">
        <select onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          {[...new Set(products.map((p) => p.categoryName))].map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select onChange={(e) => setFilterBrand(e.target.value)}>
          <option value="">Tất cả thương hiệu</option>
          {[...new Set(products.map((p) => p.brandName))].map((brand, i) => (
            <option key={i} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select onChange={(e) => setFilterStock(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="in">Còn hàng</option>
          <option value="out">Hết hàng</option>
        </select>

        <input
          type="text"
          placeholder="🔍 Tìm tên hoặc mã SP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      </div>

      {/* bảng sản phẩm */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th onClick={() => handleSort("name")}>
              Tên {getSortIcon("name")}
            </th>
            <th onClick={() => handleSort("productCode")}>
              Mã SP {getSortIcon("productCode")}
            </th>
            <th>Tồn kho</th>
            <th onClick={() => handleSort("importPrice")}>
              Giá {getSortIcon("importPrice")}
            </th>
            <th onClick={() => handleSort("categoryName")}>
              Danh mục {getSortIcon("categoryName")}
            </th>
            <th onClick={() => handleSort("brandName")}>
              Thương hiệu {getSortIcon("brandName")}
            </th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((p) => (
            <tr key={p.id}>
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
                      <div onClick={() => navigate(`/products/${p.id}`)}>Chi tiết</div>
                      <div onClick={() => handleDeleteClick(p)}>Xóa</div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      

      {/* phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            « Trước
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={currentPage === idx + 1 ? "active" : ""}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Tiếp »
          </button>
        </div>
      )}
    </div>
  );
}
