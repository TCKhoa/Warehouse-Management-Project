import React, { useEffect, useState } from "react";
import "../styles/Revenue.scss";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Revenue() {
  const [transactions, setTransactions] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);

  useEffect(() => {
    const data = [
      {
        id: "TX001",
        type: "Nhập kho",
        date: "2025-08-07",
        value: 1500000,
      },
      {
        id: "TX002",
        type: "Xuất kho",
        date: "2025-08-08",
        value: 2500000,
      },
      {
        id: "TX003",
        type: "Xuất kho",
        date: "2025-08-08",
        value: 3000000,
      },
    ];
    setTransactions(data);
  }, []);

  useEffect(() => {
    const today = new Date();
    let daily = 0;
    let monthly = 0;
    let yearly = 0;

    transactions.forEach((tx) => {
      if (tx.type !== "Xuất kho") return;

      const date = new Date(tx.date);
      if (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      ) {
        daily += tx.value;
      }
      if (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth()
      ) {
        monthly += tx.value;
      }
      if (date.getFullYear() === today.getFullYear()) {
        yearly += tx.value;
      }
    });

    setDailyRevenue(daily);
    setMonthlyRevenue(monthly);
    setYearlyRevenue(yearly);
  }, [transactions]);

  const handleExportExcel = () => {
    const exportData = transactions
      .filter((tx) => tx.type === "Xuất kho")
      .map((tx) => ({
        "Mã giao dịch": tx.id,
        "Ngày": tx.date,
        "Giá trị (VND)": tx.value,
      }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(file, "bao-cao-doanh-thu.xlsx");
  };

  return (
    <div className="revenue-page">
      <h2>📈 Báo cáo doanh thu</h2>

      <div className="revenue-cards">
        <div className="card">
          <h3>Tổng doanh thu hôm nay</h3>
          <p>{dailyRevenue.toLocaleString()} VND</p>
        </div>
        <div className="card">
          <h3>Tháng này</h3>
          <p>{monthlyRevenue.toLocaleString()} VND</p>
        </div>
        <div className="card">
          <h3>Năm nay</h3>
          <p>{yearlyRevenue.toLocaleString()} VND</p>
        </div>
      </div>

      <div className="revenue-chart">
        <div className="chart-header">
          <button className="export-btn" onClick={handleExportExcel}>
            📥 Xuất Excel
          </button>
        </div>

        <p>
          <i>[Biểu đồ doanh thu theo ngày/tháng]</i>
        </p>
        {/* Sau này bạn có thể tích hợp Chart.js hoặc Recharts ở đây */}
      </div>
    </div>
  );
}
