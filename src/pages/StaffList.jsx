import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/StaffList.scss';

export default function StaffList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  const handleDetailClick = (id) => {
    navigate(`/staff/${id}`);
  };

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
              <td>{user.staff_code}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</td>
              <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
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
