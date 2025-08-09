import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import api from "../services/api";
import '../styles/Inventory.scss';

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
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

  const filterData = (keyword, category) => {
    const lowerKeyword = keyword.toLowerCase();
    const filtered = inventory.filter(item =>
      item.name.toLowerCase().includes(lowerKeyword) &&
      (category === 'all' || String(item.category_id) === category)
    );
    setFilteredData(filtered);
  };

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);
    filterData(keyword, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterData(searchKeyword, category);
  };

  const handleSort = (field) => {
    const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
    const sorted = [...filteredData].sort((a, b) => {
      const valueA = a[field] || 0;
      const valueB = b[field] || 0;

      if (typeof valueA === 'string') {
        return order === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });

    setSortField(field);
    setSortOrder(order);
    setFilteredData(sorted);
  };

  const handleExportExcel = () => {
    const worksheetData = filteredData.map((item) => ({
      "Mã sản phẩm": item.code,
      "Tên sản phẩm": item.name,
      "Thương hiệu": item.brand_name || "---",
      "Danh mục": item.category_name || "---",
      "Đơn vị": item.unit_name || "---",
      "Giá nhập (₫)": item.import_price?.toLocaleString("vi-VN") || 0,
      "Giá bán (₫)": item.price?.toLocaleString("vi-VN") || 0,
      "Số lượng tồn": item.quantity || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TonKho");
    XLSX.writeFile(workbook, "ton_kho.xlsx");
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <div className="left">
          <h2>📊 Tồn kho</h2>
          <p>Kiểm tra số lượng tồn kho hiện tại.</p>
        </div>
        <div className="right">
          <button onClick={handleExportExcel}>📤 Xuất Excel</button>
        </div>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm sản phẩm..."
          value={searchKeyword}
          onChange={handleSearch}
          className="search-box"
        />
        <select value={selectedCategory} onChange={handleCategoryChange} className="category-select">
          <option value="all">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('product_code')}>Mã {getSortIcon('product_code')}</th>
            <th onClick={() => handleSort('name')}>Tên sản phẩm {getSortIcon('name')}</th>
            <th onClick={() => handleSort('category_name')}>Danh mục {getSortIcon('category_name')}</th>
            <th onClick={() => handleSort('brand_name')}>Thương hiệu {getSortIcon('brand_name')}</th>
            <th onClick={() => handleSort('unit_name')}>Đơn vị {getSortIcon('unit_name')}</th>
            <th onClick={() => handleSort('price')}>Giá nhập (₫) {getSortIcon('import_price')}</th>
            <th onClick={() => handleSort('import_price')}>Giá bán (₫) {getSortIcon('import_price')}</th>
            <th onClick={() => handleSort('quantity')}>Tồn kho {getSortIcon('quantity')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.product_code}</td>
              <td>{item.name}</td>
              <td>{item.category_name || "---"}</td>
              <td>{item.brand_name || "---"}</td>
              <td>{item.unit_name || "---"}</td>
              <td>{item.price?.toLocaleString("vi-VN") || 0}</td>
              <td>{item.import_price?.toLocaleString("vi-VN") || 0}</td>
              <td>{item.quantity || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
