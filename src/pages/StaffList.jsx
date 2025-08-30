// src/pages/StaffList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import '../styles/StaffList.scss';

export default function StaffList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc');

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
        console.error('Lỗi khi lấy danh sách nhân viên:', err);
        setError('Không thể tải dữ liệu nhân viên');
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
    result = result.filter((u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.staffCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
  }, [users, searchTerm, sortField, sortOrder]);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const handleDetailClick = (id) => {
    navigate(`/staff/${id}`);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="staff-list-page">
      <h2>👥 Danh sách nhân viên</h2>
      <p>Quản lý danh sách nhân viên làm việc trong kho.</p>

      {/* Search input */}
      <div className="staff-filters">
        <input
          type="text"
          placeholder="Tìm theo tên, mã NV hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="staff-table">
        <thead>
          <tr>
            <th>STT</th>
            <th onClick={() => handleSort('staffCode')}>
              Mã NV
              <FaSortUp className={sortField === 'staffCode' && sortOrder === 'asc' ? 'active' : ''} />
              <FaSortDown className={sortField === 'staffCode' && sortOrder === 'desc' ? 'active' : ''} />
            </th>
            <th onClick={() => handleSort('username')}>
              Tên người dùng
              <FaSortUp className={sortField === 'username' && sortOrder === 'asc' ? 'active' : ''} />
              <FaSortDown className={sortField === 'username' && sortOrder === 'desc' ? 'active' : ''} />
            </th>
            <th>Email</th>
            <th onClick={() => handleSort('role')}>
              Vai trò
              <FaSortUp className={sortField === 'role' && sortOrder === 'asc' ? 'active' : ''} />
              <FaSortDown className={sortField === 'role' && sortOrder === 'desc' ? 'active' : ''} />
            </th>
            <th onClick={() => handleSort('createdAt')}>
              Ngày tạo
              <FaSortUp className={sortField === 'createdAt' && sortOrder === 'asc' ? 'active' : ''} />
              <FaSortDown className={sortField === 'createdAt' && sortOrder === 'desc' ? 'active' : ''} />
            </th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', color: 'gray' }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.staffCode}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</td>
                <td>{user.createdAt.slice(0, 10).split('-').reverse().join('/')}</td>
                <td>
                  <button onClick={() => handleDetailClick(user.id)}>Chi tiết</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
