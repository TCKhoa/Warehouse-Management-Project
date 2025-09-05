import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/StaffDetail.scss';

export default function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Lấy thông tin nhân viên theo id
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await api.getUserById(id);
        setStaff(data);
        setFormData(data);
      } catch (error) {
        console.error('Lỗi khi tải thông tin nhân viên:', error);
        alert('Không thể tải thông tin nhân viên.');
        navigate('/staff');
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [id, navigate]);

  if (loading) return <p>Đang tải dữ liệu nhân viên...</p>;
  if (!staff) return <p>Không tìm thấy nhân viên.</p>;

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Lưu thông tin chỉnh sửa
  const handleSave = async () => {
    try {
      const updated = await api.updateUser(staff.id, formData);
      setStaff(updated); // cập nhật lại UI với dữ liệu mới
      setIsEditing(false);
      alert('Cập nhật nhân viên thành công!');
    } catch (err) {
      console.error('Lỗi khi cập nhật nhân viên:', err);
      alert('Cập nhật thất bại!');
    }
  };

  // Xóa nhân viên
  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa nhân viên này?')) return;

    try {
      await api.deleteUser(staff.id);
      alert('Xóa nhân viên thành công!');
      navigate('/staff'); // quay về danh sách nhân viên
    } catch (err) {
      console.error('Lỗi khi xóa nhân viên:', err);
      alert('Xóa nhân viên thất bại!');
    }
  };

  return (
    <div className="staff-detail">
      <h2>
        👤 Chi tiết nhân viên{' '}
        <span className="staff-id">#{staff.staffCode}</span>
      </h2>

      <div className="grid-info">
        {/* Họ tên */}
        <div className="field">
          <label>Họ tên</label>
          {isEditing ? (
            <input
              className="field-value"
              name="username"
              value={formData.username || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="field-value">{staff.username}</div>
          )}
        </div>

        {/* Email */}
        <div className="field">
          <label>Email</label>
          {isEditing ? (
            <input
              className="field-value"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="field-value">{staff.email}</div>
          )}
        </div>

        {/* Số điện thoại */}
        <div className="field">
          <label>Số điện thoại</label>
          {isEditing ? (
            <input
              className="field-value"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="field-value">{staff.phone || 'Chưa cập nhật'}</div>
          )}
        </div>

        {/* Chức vụ */}
        <div className="field">
          <label>Chức vụ</label>
          {isEditing ? (
            <input
              className="field-value"
              name="role"
              value={formData.role || ''}
              onChange={handleChange}
            />
          ) : (
            <div className="field-value">{staff.role}</div>
          )}
        </div>

        {/* Ngày sinh */}
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
              {staff.birthday
                ? new Date(staff.birthday).toLocaleDateString('vi-VN')
                : 'Chưa cập nhật'}
            </div>
          )}
        </div>

        {/* Ngày vào làm */}
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

      {/* Actions */}
      <div className="actions">
        <button className="danger" onClick={handleDelete}>
          🗑 Xoá nhân viên
        </button>
        {isEditing ? (
          <button className="primary" onClick={handleSave}>
            💾 Lưu
          </button>
        ) : (
          <button className="primary" onClick={() => setIsEditing(true)}>
            ✏ Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
}
