import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ExportWarehouse.scss"; // Dùng chung style
import api from "../services/api";

const ImportWarehouse = () => {
  const [importReceipts, setImportReceipts] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmDeleteCode, setConfirmDeleteCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchImportReceipts();
  }, []);

  // ===================== Lấy danh sách phiếu nhập =====================
  const fetchImportReceipts = async () => {
    try {
      const data = await api.getImportReceipts(); // API trả về danh sách
      setImportReceipts(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phiếu nhập kho:", error);
    }
  };

  // ===================== Format tiền =====================
  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });

  // ===================== Xử lý xóa =====================
  const handleDeleteClick = (receipt) => {
    setConfirmDeleteId(receipt.id);
    setConfirmDeleteCode(receipt.importCode || receipt.import_code);
  };

  const confirmDelete = async () => {
    try {
      await api.deleteImportReceipt(confirmDeleteId); // API xóa phiếu
      await fetchImportReceipts(); // Cập nhật lại danh sách
    } catch (err) {
      console.error("Lỗi khi xóa phiếu nhập:", err);
    }
    setConfirmDeleteId(null);
    setConfirmDeleteCode("");
  };

  // ===================== Tính tổng tiền =====================
  const calculateTotal = (receipt) => {
    if (receipt.totalAmount || receipt.total_amount) {
      return receipt.totalAmount || receipt.total_amount;
    }
    if (receipt.items) {
      return receipt.items.reduce(
        (sum, item) =>
          sum + Number(item.quantity) * Number(item.importPrice || item.import_price),
        0
      );
    }
    return 0;
  };

  return (
    <div className="export-receipts">
      <div className="header">
        <h2>📦 Lịch sử phiếu nhập kho</h2>
        <button
          className="create-button"
          onClick={() => navigate("/import-receipts/new")}
        >
          + Tạo phiếu nhập kho
        </button>
      </div>

      <table className="receipts-table">
        <thead>
          <tr>
            <th>Mã phiếu</th>
            <th>Thời gian</th>
            <th>Người tạo</th>
            <th>Tổng tiền</th>
            
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {importReceipts.map((receipt) => {
            const total = calculateTotal(receipt);

            return (
              <tr key={receipt.id}>
                <td>{receipt.importCode || receipt.import_code}</td>
                <td>
                  {new Date(receipt.createdAt || receipt.created_at).toLocaleDateString(
                    "vi-VN"
                  )}
                </td>
                <td>{receipt.createdBy} 
  </td>
                <td>{formatCurrency(total)}</td>
               
                <td>
                  <button
                    onClick={() => navigate(`/import-receipts/${receipt.id}`)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="danger"
                    onClick={() => handleDeleteClick(receipt)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Modal xác nhận xóa */}
      {confirmDeleteId && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <p>
              Bạn có chắc chắn muốn xóa phiếu nhập{" "}
              <strong>{confirmDeleteCode}</strong>?
            </p>
            <div className="confirm-buttons">
              <button onClick={() => setConfirmDeleteId(null)}>Hủy</button>
              <button onClick={confirmDelete} className="danger">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportWarehouse;
