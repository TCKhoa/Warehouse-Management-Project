// src/pages/TransactionHistory.jsx
import React, { useState, useEffect } from "react";
import "../styles/TransactionHistory.scss";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

            // Xử lý lấy tên người thực hiện chuẩn
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

  return (
    <div className="transaction-history-page">
      <h2>📊 Lịch sử giao dịch</h2>
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
            {transactions.length > 0 ? (
              transactions.map((tx) => (
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
    </div>
  );
}
