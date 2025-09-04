import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Revenue.scss";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Revenue() {
  const [importReceipts, setImportReceipts] = useState([]);
  const [exportReceipts, setExportReceipts] = useState([]);

  const [dailyImportCount, setDailyImportCount] = useState(0);
  const [dailyExportCount, setDailyExportCount] = useState(0);
  const [monthlyImportCount, setMonthlyImportCount] = useState(0);
  const [monthlyExportCount, setMonthlyExportCount] = useState(0);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resImport = await api.getImportReceipts();
        setImportReceipts(resImport.data || resImport);

        const resExport = await api.getExportReceipts();
        setExportReceipts(resExport.data || resExport);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    let countDailyImport = 0,
      countDailyExport = 0,
      countMonthlyImport = 0,
      countMonthlyExport = 0;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const importCountByDay = Array(daysInMonth).fill(0);
    const exportCountByDay = Array(daysInMonth).fill(0);

    importReceipts.forEach((r) => {
      const date = new Date(r.createdAt);
      if (date.getFullYear() === year && date.getMonth() === month) {
        importCountByDay[date.getDate() - 1] += 1;
      }
      if (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === today.getDate()
      ) {
        countDailyImport += 1;
      }
      if (date.getFullYear() === year && date.getMonth() === month) {
        countMonthlyImport += 1;
      }
    });

    exportReceipts.forEach((r) => {
      const date = new Date(r.createdAt);
      if (date.getFullYear() === year && date.getMonth() === month) {
        exportCountByDay[date.getDate() - 1] += 1;
      }
      if (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === today.getDate()
      ) {
        countDailyExport += 1;
      }
      if (date.getFullYear() === year && date.getMonth() === month) {
        countMonthlyExport += 1;
      }
    });

    const chartDataTemp = [];
    for (let i = 0; i < daysInMonth; i++) {
      chartDataTemp.push({
        name: `${i + 1}`,
        "Nhập kho": importCountByDay[i],
        "Xuất kho": exportCountByDay[i],
      });
    }

    setDailyImportCount(countDailyImport);
    setDailyExportCount(countDailyExport);
    setMonthlyImportCount(countMonthlyImport);
    setMonthlyExportCount(countMonthlyExport);
    setChartData(chartDataTemp);
  }, [importReceipts, exportReceipts]);

  const handleExportExcel = () => {
    const allTransactions = [
      ...importReceipts.map((r) => ({
        Loại: "Nhập kho",
        "Mã phiếu": r.importCode || r.id,
        "Ngày": r.createdAt,
      })),
      ...exportReceipts.map((r) => ({
        Loại: "Xuất kho",
        "Mã phiếu": r.exportCode || r.id,
        "Ngày": r.createdAt,
      })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(allTransactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Nhập - Xuất kho");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "bao-cao-so-luong-phiếu.xlsx");
  };

  return (
    <div className="revenue-page">
      <h2>📊 Thống kê nhập - xuất kho (theo số phiếu)</h2>

      <div className="revenue-cards">
        <div className="card">
          <h3>Nhập kho hôm nay</h3>
          <p>{dailyImportCount}</p>
        </div>
        <div className="card">
          <h3>Xuất kho hôm nay</h3>
          <p>{dailyExportCount}</p>
        </div>
      </div>

      <div className="revenue-cards">
        <div className="card">
          <h3>Nhập kho tháng này</h3>
          <p>{monthlyImportCount}</p>
        </div>
        <div className="card">
          <h3>Xuất kho tháng này</h3>
          <p>{monthlyExportCount}</p>
        </div>
      </div>

      <div className="revenue-chart">
        <div className="chart-header">
          <button className="export-btn" onClick={handleExportExcel}>
            📥 Xuất Excel
          </button>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Nhập kho" stroke="#4CAF50" />
            <Line type="monotone" dataKey="Xuất kho" stroke="#FF5722" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
