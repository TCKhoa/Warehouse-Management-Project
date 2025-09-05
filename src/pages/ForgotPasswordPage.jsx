// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/ForgotPasswordPage.scss";
import bgImage from "../assets/img/bg-login.jpg";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập otp + new password
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Bước 1: gửi OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.sendOtp({ email });
      setMessage(res.message);
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: xác thực OTP và đặt mật khẩu mới
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.resetPassword({ email, otp, newPassword });
      setMessage(res.message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forgot-password-page"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="forgot-container">
        <h2 className="shiny-text">Quên mật khẩu</h2>
        {message && <div className="message">{message}</div>}

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="shiny-button" disabled={loading}>
              {loading ? "Đang gửi OTP..." : "Gửi OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label>OTP</label>
              <input
                type="text"
                placeholder="Nhập OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="shiny-button" disabled={loading}>
              {loading ? "Đang đặt lại mật khẩu..." : "Đặt lại mật khẩu"}
            </button>
          </form>
        )}
        <div className="back-to-login">
          <a
            className="back-login secondary"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
