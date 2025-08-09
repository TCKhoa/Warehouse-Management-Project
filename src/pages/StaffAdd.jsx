import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/StaffAdd.scss";

export default function StaffAdd() {
  const navigate = useNavigate();
  const [existingCodes, setExistingCodes] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    staff_code: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "staff",
    birthday: "",
    created_at: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await api.getUsers();
        const codes = users.map((u) => u.staff_code);
        setExistingCodes(codes);

        let index = 1;
        let newCode = "";
        while (true) {
          newCode = `STF${index.toString().padStart(3, "0")}`;
          if (!codes.includes(newCode)) break;
          index++;
        }
        setFormData((prev) => ({ ...prev, staff_code: newCode }));
      } catch (err) {
        console.error("Lỗi khi tải danh sách nhân viên:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== confirmPassword) {
      setPasswordError("❌ Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      const newUser = {
        ...formData,
        created_at: formData.created_at + "T00:00:00Z",
        birthday: formData.birthday ? formData.birthday + "T00:00:00Z" : null,
        updated_at: new Date().toISOString(),
      };

      const createdUser = await api.createUser(newUser);

      alert("✅ Thêm nhân viên thành công!");
      
      // Điều hướng đến trang chi tiết nhân viên sau khi tạo xong
      navigate(`/staff/${createdUser.id}`);
    } catch (err) {
      console.error("Lỗi khi thêm nhân viên:", err);
      alert("❌ Lỗi khi thêm nhân viên");
    }
  };

  return (
    <div className="staff-add">
      <h2>➕ Thêm nhân viên mới</h2>
      <form className="staff-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Mã nhân viên</label>
          <input name="staff_code" value={formData.staff_code} disabled />
        </div>

        <div className="field">
          <label>Họ tên</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Số điện thoại</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Mật khẩu</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈 Ẩn" : "👁 Hiện"}
            </button>
          </div>
        </div>

        <div className="field">
          <label>Nhập lại mật khẩu</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
              required
            />
            <button
              type="button"
              className="toggle-btn"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "🙈 Ẩn" : "👁 Hiện"}
            </button>
          </div>
          {passwordError && <p className="error">{passwordError}</p>}
        </div>

        <div className="field">
          <label>Chức vụ</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="admin">Admin</option>
            <option value="staff">Nhân viên</option>
          </select>
        </div>

        <div className="field">
          <label>Ngày sinh</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Ngày vào làm</label>
          <input
            type="date"
            name="created_at"
            value={formData.created_at}
            onChange={handleChange}
          />
        </div>

        <div className="actions">
          <button type="submit" className="primary">
            ✅ Thêm nhân viên
          </button>
        </div>
      </form>
    </div>
  );
}
