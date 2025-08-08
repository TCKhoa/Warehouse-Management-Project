// src/pages/TransactionHistory.jsx
import React, { useState, useEffect } from "react";
import "../styles/TransactionHistory.scss";
import { Link } from "react-router-dom";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Dữ liệu giả lập
    const data = [
      {
        id: "TX001",
        type: "Nhập kho",
        date: "2025-08-07",
        user: "Nguyễn Văn A",
        value: 1500000,
        description: "Nhập hàng đợt 1",
        note: "Kiểm tra lại số lượng",
        detailPage: "/import-receipts/1",
      },
      {
        id: "TX002",
        type: "Xuất kho",
        date: "2025-08-08",
        user: "Trần Thị B",
        value: 2500000,
        description: "Xuất hàng cho đại lý",
        note: "",
        detailPage: "/export-receipts/2",
      },
    ];
    setTransactions(data);
  }, []);

  // Hàm tạo link động theo loại hình
  const getDetailLink = (tx) => {
    if (tx.type === "Nhập kho") return `/import-receipt/${tx.id}`;
    if (tx.type === "Xuất kho") return `/export-receipt/${tx.id}`;
    return "#";
  };

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
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td className={tx.type === "Xuất kho" ? "export" : "import"}>
                  {tx.type}
                </td>
                <td>{new Date(tx.date).toLocaleDateString("vi-VN")}</td>
                <td>{tx.user}</td>
                <td>{tx.value.toLocaleString()}₫</td>
                <td>{tx.description}</td>
                <td>{tx.note || "—"}</td>
                <td>
                  <Link to={getDetailLink(tx)} className="detail-link">
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
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
