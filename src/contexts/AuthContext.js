import { createContext } from "react";

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
  handleLogin: () => {},
  handleLogout: () => {},
  user: null,
  setUser: () => {},
});
