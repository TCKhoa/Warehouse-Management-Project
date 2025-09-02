// ImportWarehouse.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/ExportWarehouse.scss"; // Dùng chung style
import api from "../services/api";

const ImportWarehouse = () => {
  const [importReceipts, setImportReceipts] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1); // phân trang toàn bộ
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "staff";

  useEffect(() => {
    fetchImportReceipts();
  }, []);

  const fetchImportReceipts = async () => {
    try {
      const data = await api.getImportReceipts();
      data.sort(
        (a, b) =>
          new Date(b.createdAt || b.created_at) -
          new Date(a.createdAt || a.created_at)
      );
      setImportReceipts(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phiếu nhập kho:", error);
    }
  };

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const handleDeleteClick = (receipt) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa?",
      text: `Phiếu nhập ${receipt.importCode || receipt.import_code} sẽ bị xóa!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteImportReceipt(receipt.id);
          Swal.fire(
            "Đã xóa!",
            `Phiếu nhập ${receipt.importCode || receipt.import_code} đã bị xóa.`,
            "success"
          );
          fetchImportReceipts();
        } catch (err) {
          Swal.fire("Lỗi!", err.response?.data || "Xóa thất bại.", "error");
          console.error("Lỗi khi xóa phiếu nhập:", err);
        }
      }
    });
  };

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

  // --- Pagination toàn bộ danh sách ---
  const totalPages = Math.ceil(importReceipts.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentReceipts = importReceipts.slice(start, end);

  // --- Group theo tháng cho dữ liệu đã phân trang ---
  const groupedReceipts = currentReceipts.reduce((groups, receipt) => {
    const date = new Date(receipt.createdAt || receipt.created_at);
    const monthKey = date.toLocaleString("vi-VN", { month: "long", year: "numeric" });
    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(receipt);
    return groups;
  }, {});

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset về trang đầu
  };

  return (
    <div className="export-receipts">
      <div className="header">
        <h2>📦 Lịch sử phiếu nhập kho</h2>
        <button className="create-button" onClick={() => navigate("/import-receipts/new")}>
          + Tạo phiếu nhập kho
        </button>
      </div>

      <div className="pagination-control">
        <label>
          Hiển thị
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          giao dịch mỗi trang
        </label>
      </div>

      {Object.keys(groupedReceipts).map((month) => (
        <div key={month} className="month-group">
          <h3 className="month-title">{month}</h3>
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
              {groupedReceipts[month].map((receipt) => {
                const total = calculateTotal(receipt);
                const createdAt = new Date(receipt.createdAt || receipt.created_at);
                const now = new Date();
                let canDelete = false;
                let tooltip = "";

                if (role === "admin") {
                  canDelete = true;
                } else if (role === "manager") {
                  const oneWeekLater = new Date(createdAt);
                  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
                  canDelete = now <= oneWeekLater;
                  if (!canDelete) tooltip = "Quản lý chỉ được xóa trong 7 ngày";
                } else if (role === "staff") {
                  const oneDayLater = new Date(createdAt);
                  oneDayLater.setDate(oneDayLater.getDate() + 1);
                  canDelete = now <= oneDayLater;
                  if (!canDelete) tooltip = "Nhân viên chỉ được xóa trong 24h";
                } else {
                  tooltip = "Bạn không có quyền xóa";
                }

                return (
                  <tr key={receipt.id}>
                    <td>{receipt.importCode || receipt.import_code}</td>
                    <td>{createdAt.toLocaleDateString("vi-VN")}</td>
                    <td>{receipt.createdBy || receipt.created_by || "Không xác định"}</td>
                    <td>{formatCurrency(total)}</td>
                    <td>
                      <button onClick={() => navigate(`/import-receipts/${receipt.id}`)}>
                        Xem chi tiết
                      </button>
                      <button
                        className="danger"
                        onClick={() => handleDeleteClick(receipt)}
                        disabled={!canDelete}
                        title={!canDelete ? tooltip : ""}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {/* Pagination dưới cùng */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            « Trước
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={currentPage === idx + 1 ? "active" : ""}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Tiếp »
          </button>
        </div>
      )}
    </div>
  );
};

export default ImportWarehouse;
