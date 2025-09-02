import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";
import "../styles/Inventory.scss";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Thêm state cho phân trang
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);
        setInventory(productData);
        setFilteredData(productData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tồn kho hoặc danh mục:", error);
      }
    };
    fetchInventory();
  }, []);

  // Lọc + tìm kiếm + sắp xếp
  useEffect(() => {
    let result = inventory;

    // Tìm kiếm theo mã hoặc tên
    result = result.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        p.productCode.toLowerCase().includes(searchKeyword.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || p.categoryName === selectedCategory;

      const matchBrand =
        selectedBrand === "all" || p.brandName === selectedBrand;

      return matchSearch && matchCategory && matchBrand;
    });

    // Sắp xếp
    if (sortField) {
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
    }

    setFilteredData(result);
    setCurrentPage(1); // reset về trang 1 khi filter thay đổi
  }, [inventory, searchKeyword, selectedCategory, selectedBrand, sortField, sortOrder]);

  // Hàm xử lý chọn số lượng sản phẩm hiển thị
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const handleExportExcel = () => {
    const worksheetData = filteredData.map((item) => ({
      "Mã sản phẩm": item.productCode,
      "Tên sản phẩm": item.name,
      "Thương hiệu": item.brandName || "---",
      "Danh mục": item.categoryName || "---",
      "Đơn vị": item.unitName || "---",
      "Giá nhập (₫)": item.importPrice?.toLocaleString("vi-VN") || 0,
      "Số lượng tồn": item.stock || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TonKho");
    XLSX.writeFile(workbook, "ton_kho.xlsx");
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentProducts = filteredData.slice(start, end);

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div className="left">
          <h2>📊 Tồn kho</h2>
        </div>
        <div className="right">
          <button onClick={handleExportExcel}>📤 Xuất Excel</button>
        </div>
      </div>

      {/* Dòng chọn số lượng sản phẩm */}
      <div className="top-controls">
      <div className="pagination-control">
        <label>
          Hiển thị
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          sản phẩm mỗi trang
        </label>
      </div>

      <div className="filters">
        <div className="filter-left">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="category-select"
          >
            <option value="all">Tất cả thương hiệu</option>
            {[...new Set(inventory.map((p) => p.brandName).filter(Boolean))].map(
              (brand, idx) => (
                <option key={idx} value={brand}>
                  {brand}
                </option>
              )
            )}
          </select>
        </div>

        <div className="filter-right">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-box"
          />
        </div>
      </div>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort("productCode")}>
              Mã {getSortIcon("productCode")}
            </th>
            <th onClick={() => handleSort("name")}>
              Tên sản phẩm {getSortIcon("name")}
            </th>
            <th onClick={() => handleSort("categoryName")}>
              Danh mục {getSortIcon("categoryName")}
            </th>
            <th onClick={() => handleSort("brandName")}>
              Thương hiệu {getSortIcon("brandName")}
            </th>
            <th onClick={() => handleSort("unitName")}>
              Đơn vị {getSortIcon("unitName")}
            </th>
            <th onClick={() => handleSort("importPrice")}>
              Giá nhập (₫) {getSortIcon("importPrice")}
            </th>
            <th onClick={() => handleSort("stock")}>
              Tồn kho {getSortIcon("stock")}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((item) => (
            <tr key={item.id}>
              <td>{item.productCode}</td>
              <td>{item.name}</td>
              <td>{item.categoryName || "---"}</td>
              <td>{item.brandName || "---"}</td>
              <td>{item.unitName || "---"}</td>
              <td>{item.importPrice?.toLocaleString("vi-VN") || 0}</td>
              <td>{item.stock || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Thanh phân trang */}
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
