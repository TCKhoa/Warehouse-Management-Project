import { useState } from "react";
import { AuthContext } from "./AuthContext.js";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token") || ""
  );

  const handleLogin = (newToken, remember = true) => {
    setToken(newToken);
    if (remember) {
      localStorage.setItem("token", newToken);
    } else {
      sessionStorage.setItem("token", newToken);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
