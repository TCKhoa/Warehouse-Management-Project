import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // chỉ import mặc định
import '../styles/StaffList.scss';

export default function StaffList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersData = await api.getUsers(); // gọi từ api object
        setUsers(usersData);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách nhân viên:', err);
        setError('Không thể tải dữ liệu nhân viên');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDetailClick = (id) => {
    navigate(`/staff/${id}`);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

 return (
    <div className="staff-list-page">
      <h2>👥 Danh sách nhân viên</h2>
      <p>Quản lý danh sách nhân viên làm việc trong kho.</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã NV</th>
            <th>Tên người dùng</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
