import React from "react";
import "../styles/TransactionHistory.scss";

export default function TransactionHistory() {
  return (
    <div className="transaction-history-page">
      <h2>🧾 Lịch sử giao dịch</h2>
      <table>
        <thead>
          <tr>
            <th>Mã GD</th>
            <th>Loại</th>
            <th>Ngày</th>
            <th>Người thực hiện</th>
            <th>Giá trị</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TX001</td>
            <td>Xuất kho</td>
            <td>03/08/2025</td>
            <td>Nguyễn Văn A</td>
            <td>12,000,000 VND</td>
          </tr>
          <tr>
            <td>TX002</td>
            <td>Nhập kho</td>
            <td>02/08/2025</td>
            <td>Trần Thị B</td>
            <td>25,000,000 VND</td>
          </tr>
          {/* Thêm nhiều dòng hơn nếu cần */}
        </tbody>
      </table>
    </div>
  );
}
