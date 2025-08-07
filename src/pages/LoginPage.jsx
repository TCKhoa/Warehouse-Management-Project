import React, { useState } from "react";
import "../styles/LoginPage.scss";
import bgImage from "../assets/img/bg-login.jpg";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      onLogin();
    } else {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="login-container">
        <h2 className="shiny-text"> LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tài khoản</label>
            <div className="password-wrapper">
              <input
                id="username"
                type="text"
                placeholder="Tài khoản"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <div className="options-row">
            <label className="remember-me">
              <input
              type="checkbox"
              checked={rememberMe}
              onChange={()=> setRememberMe(!rememberMe)}
              />
              Ghi nhớ mật khẩu
            </label>
            <a href="#" className="forgot-password">Quên mật khẩu?</a>
          </div>

          <button className="shiny-button" type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
