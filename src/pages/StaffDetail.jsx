import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/StaffDetail.scss'; // SCSS tách riêng

export default function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    api.getUsers().then((data) => {
      const found = data.find((u) => u.id.toString() === id);
      if (found) {
        setStaff(found);
        setFormData(found);
      }
    });
  }, [id]);

  if (!staff) return <p>Đang tải dữ liệu nhân viên...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  try {
    const updated = await api.updateUser(staff.id, formData);
    setStaff(updated);   // cập nhật state với dữ liệu trả về từ backend
    setIsEditing(false);
  } catch (err) {
    console.error('Lỗi khi cập nhật nhân viên:', err);
    alert('Cập nhật thất bại!');
  }
};


  return (
    <div className="staff-detail">
      <h2>👤 Chi tiết nhân viên <span className="staff-id">#{staff.staffCode}</span></h2>

      <div className="grid-info">
        <div className="field">
          <label>Họ tên</label>
          {isEditing ? (
            <input className="field-value" name="username" value={formData.username || ''} onChange={handleChange} />
          ) : (
            <div className="field-value">{staff.username}</div>
          )}
        </div>

        <div className="field">
          <label>Email</label>
          {isEditing ? (
            <input className="field-value" name="email" value={formData.email} onChange={handleChange} />
          ) : (
            <div className="field-value">{staff.email}</div>
          )}
        </div>

        <div className="field">
          <label>Số điện thoại</label>
          {isEditing ? (
            <input className="field-value" name="phone" value={formData.phone || ''} onChange={handleChange} />
          ) : (
            <div className="field-value">{staff.phone || 'Chưa cập nhật'}</div>
          )}
        </div>

        <div className="field">
          <label>Chức vụ</label>
          {isEditing ? (
            <input className="field-value" name="role" value={formData.role} onChange={handleChange} />
          ) : (
            <div className="field-value">{staff.role}</div>
          )}
        </div>

        <div className="field">
          <label>Ngày sinh</label>
          {isEditing ? (
            <input
            className="field-value"
              type="date"
              name="birthday"
              value={formData.birthday?.slice(0, 10) || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  birthday: e.target.value + 'T00:00:00Z',
                }))
              }
            />
          ) : (
            <div className="field-value">
              {staff.birthday ? new Date(staff.birthday).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
            </div>
          )}
        </div>

        <div className="field">
          <label>Ngày vào làm</label>
          {isEditing ? (
            <input
            className="field-value"
              type="date"
              name="createdAt"
              value={formData.createdAt?.slice(0, 10) || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  createdAt: e.target.value + 'T00:00:00Z',
                }))
              }
            />
          ) : (
            <div className="field-value">
              {new Date(staff.createdAt).toLocaleDateString('vi-VN')}
            </div>
          )}
        </div>
      </div>

      <div className="actions">
        <button className="danger" onClick={() => alert('Xoá nhân viên')}>🗑 Xoá nhân viên</button>
        {isEditing ? (
          <button className="primary" onClick={handleSave}>💾 Lưu</button>
        ) : (
          <button className="primary" onClick={() => setIsEditing(true)}>✏ Chỉnh sửa</button>
        )}
      </div>
    </div>
  );
}
