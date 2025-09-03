// src/pages/TransactionHistory.jsx
import React, { useState, useEffect } from "react";
import "../styles/TransactionHistory.scss";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 📌 Thêm state cho phân trang
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [imports, exports] = await Promise.all([
          api.getImportReceipts(),
          api.getExportReceipts(),
        ]);

        const mapTx = (arr, type) =>
          arr.map((r) => {
            const total = (r.details || []).reduce(
              (sum, item) =>
                sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
              0
            );

            const user =
              typeof r.createdBy === "string"
                ? r.createdBy
                : r.createdByUsername ||
                  r.userName ||
                  r.user?.name ||
                  "N/A";

            return {
              id: r.id,
              code: type === "Nhập kho" ? r.importCode : r.exportCode,
              type,
              date: r.createdAt || r.date,
              user,
              value: total,
              description: r.description || "",
              note: r.note || "",
              detailPage:
                type === "Nhập kho"
                  ? `/import-receipts/${r.id}`
                  : `/export-receipts/${r.id}`,
            };
          });

        const allTx = [
          ...mapTx(imports, "Nhập kho"),
          ...mapTx(exports, "Xuất kho"),
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(allTx);
      } catch (err) {
        console.error(err);
        setError("❌ Không tải được lịch sử giao dịch!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // 📌 Tính toán phân trang
  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentTransactions = transactions.slice(start, end);

  return (
    <div className="transaction-history-page">
      <h2>📊 Lịch sử giao dịch</h2>

      {/* Chọn số dòng mỗi trang */}
      <div className="pagination-control">
        <label>
          Hiển thị
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          giao dịch mỗi trang
        </label>
      </div>

      <div className="transaction-table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Mã giao dịch</th>
              <th>Loại hình</th>
              <th>Ngày giao dịch</th>
              <th>Người thực hiện</th>
              <th>Giá trị</th>
              <th>Mô tả</th>
              <th>Ghi chú</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.code}</td>
                  <td className={tx.type === "Xuất kho" ? "export" : "import"}>
                    {tx.type}
                  </td>
                  <td>{new Date(tx.date).toLocaleDateString("vi-VN")}</td>
                  <td>{tx.user}</td>
                  <td>{formatCurrency(tx.value)}</td>
                  <td>{tx.description}</td>
                  <td>{tx.note || "—"}</td>
                  <td>
                    <Link to={tx.detailPage} className="detail-link">
                      Xem chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Không có dữ liệu giao dịch.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📌 Thanh phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
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
}
