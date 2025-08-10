import { useState } from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ExportReceiptDetail from './pages/ExportReceiptDetail';
import CreateExportReceipt from './pages/CreateExportReceipt';
import ImportReceiptDetail from "./pages/ImportReceiptDetail";
import CreateImportReceipt from "./pages/CreateImportReceipt";
import StaffDetail from './pages/StaffDetail';

import "./styles/App.scss";

function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);

   const handleLogin = () => {
    setIsAuthenticated(true);
   };

   if (!isAuthenticated){
    return <LoginPage onLogin={handleLogin}/>;
   }
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar isAdmin={true} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/add" element={<ProductAdd />} />
            <Route path="/products/category" element={<ProductCategory />} />
            <Route path="/products/brand" element={<ProductBrand />} />
            <Route path="/import" element={<ImportWarehouse />} />
            <Route path="/import-receipts/:id" element={<ImportReceiptDetail />} />
            <Route path="/import-receipts/new" element={<CreateImportReceipt />} />
            <Route path="/export" element={<ExportWarehouse />} />
            <Route path="/export-receipts/:id" element={<ExportReceiptDetail />} />
            <Route path="/export-receipts/new" element={<CreateExportReceipt />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/staff" element={<StaffList />} />
            <Route path="/staff/add" element={<StaffAdd />} />
            <Route path="/staff/:id" element={<StaffDetail />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/statistics" element={<TransactionHistory />} />
            <Route path="/products/:id/edit" element={<ProductEdit/>}/>

          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;