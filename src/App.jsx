import React, { useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext"; // import context từ file riêng

import Sidebar from "./components/Sidebar";
import ProductList from "./pages/ProductList";
import ProductAdd from "./pages/ProductAdd";
import ProductCategory from "./pages/ProductCategory";
import ProductBrand from "./pages/ProductBrand";
import ImportWarehouse from "./pages/ImportWarehouse";
import ExportWarehouse from "./pages/ExportWarehouse";
import Inventory from "./pages/Inventory";
import StaffList from "./pages/StaffList";
import StaffAdd from "./pages/StaffAdd";
import HomePage from "./pages/HomePage";
import Revenue from "./pages/Revenue";
import TransactionHistory from "./pages/TransactionHistory";
import LoginPage from "./pages/LoginPage";
import ProductEdit from "./pages/ProductEdit";
import ExportReceiptDetail from "./pages/ExportReceiptDetail";
import CreateExportReceipt from "./pages/CreateExportReceipt";
import ImportReceiptDetail from "./pages/ImportReceiptDetail";
import CreateImportReceipt from "./pages/CreateImportReceipt";
import StaffDetail from "./pages/StaffDetail";
import ProductDetail from "./pages/ProductDetail";
import HistoryLogsPage from "./pages/HistoryLogsPage";

import "./styles/App.scss";

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );

  const handleLogin = (newToken, rememberMe = true) => {
    setToken(newToken);
    if (rememberMe) {
      localStorage.setItem("token", newToken);
      sessionStorage.removeItem("token");
    } else {
      sessionStorage.setItem("token", newToken);
      localStorage.removeItem("token");
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  const ProtectedRoute = () => {
    const { token } = useContext(AuthContext);
    const storedToken =
      token || localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!storedToken) return <Navigate to="/login" replace />;
    return <Outlet />;
  };

  const MainLayout = () => (
    <div className="app-layout">
      <Sidebar isAdmin={true} onLogout={handleLogout} />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ token, setToken, handleLogin, handleLogout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/add" element={<ProductAdd />} />
              <Route path="/products/category" element={<ProductCategory />} />
              <Route path="/products/brand" element={<ProductBrand />} />
              <Route path="/products/:id/edit" element={<ProductEdit />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/import" element={<ImportWarehouse />} />
              <Route path="/import-receipts/new" element={<CreateImportReceipt />} />
              <Route path="/import-receipts/:id" element={<ImportReceiptDetail />} />
              <Route path="/export" element={<ExportWarehouse />} />
              <Route path="/export-receipts/new" element={<CreateExportReceipt />} />
              <Route path="/export-receipts/:id" element={<ExportReceiptDetail />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/staff" element={<StaffList />} />
              <Route path="/staff/add" element={<StaffAdd />} />
              <Route path="/staff/:id" element={<StaffDetail />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/statistics" element={<TransactionHistory />} />
              <Route path="/history-logs" element={<HistoryLogsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
