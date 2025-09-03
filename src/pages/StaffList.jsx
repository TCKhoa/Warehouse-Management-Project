// src/pages/StaffList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/StaffList.scss";

export default function StaffList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");

  // 📌 State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersData = await api.getUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nhân viên:", err);
        setError("Không thể tải dữ liệu nhân viên");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter + search + sort
  useEffect(() => {
    let result = users;

    // Search
    result = result.filter(
      (u) =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.staffCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "createdAt") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
    setCurrentPage(1); // reset về trang 1 khi search/sort thay đổi
  }, [users, searchTerm, sortField, sortOrder]);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "⇅";
    return sortOrder === "asc" ? "↑" : "↓";
  };

  const handleDetailClick = (id) => {
    navigate(`/staff/${id}`);
  };

  // 📌 Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="staff-list-page">
      <h2>👥 Danh sách nhân viên</h2>
      
      {/* Chọn số dòng hiển thị */}
      <div className="pagination-control">
        <label>Hiển thị</label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <span> nhân viên mỗi trang</span>
      </div>

      {/* Search input */}
      <div className="staff-filters">
        <input
          type="text"
          placeholder="🔍 Tìm theo tên, mã NV hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
     
      <table className="staff-table">
        <thead>
          <tr>
            <th>STT</th>
            <th onClick={() => handleSort("staffCode")}>
              Mã NV {getSortIcon("staffCode")}
            </th>
            <th onClick={() => handleSort("username")}>
              Tên người dùng {getSortIcon("username")}
            </th>
            <th>Email</th>
            <th onClick={() => handleSort("role")}>
              Vai trò {getSortIcon("role")}
            </th>
            <th onClick={() => handleSort("createdAt")}>
              Ngày tạo {getSortIcon("createdAt")}
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", color: "gray" }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            currentItems.map((user, index) => (
              <tr key={user.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{user.staffCode}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role === "admin" ? "Quản trị viên" : "Nhân viên"}</td>
                <td>
                  {user.createdAt
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")}
                </td>
                <td>
                  <button onClick={() => handleDetailClick(user.id)}>
                    Chi tiết
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination buttons */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)}>« Trước</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)}>Tiếp »</button>
        </div>
      )}
    </div>
  );
}
