// src/pages/HistoryLogsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import "../styles/HistoryLogsPage.scss";

const HistoryLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // === STATE CHO TÌM KIẾM THEO NGÀY ===
  const [searchStartDate, setSearchStartDate] = useState("");
  const [searchEndDate, setSearchEndDate] = useState("");

  // === Định dạng ngày và giờ ===
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  // === Lấy logs từ backend ===
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const allLogs = await api.getHistoryLogs();
        // Sắp xếp giảm dần theo thời gian
        allLogs.sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt));
        setLogs((allLogs || []).map((l) => ({ ...l, isRead: Boolean(l.isRead) })));
      } catch (err) {
        console.error("Lỗi khi lấy logs:", err);
        setError("Không thể tải nhật ký hoạt động.");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // === FILTER THEO KHOẢNG THỜI GIAN ===
  const filteredLogs = useMemo(() => {
    if (!searchStartDate && !searchEndDate) return logs;

    return logs.filter((log) => {
      const logDate = new Date(log.performedAt);
      const startDate = searchStartDate ? new Date(searchStartDate) : null;
      const endDate = searchEndDate ? new Date(searchEndDate) : null;

      if (startDate && logDate < startDate) return false;
      if (endDate && logDate > new Date(endDate.getTime() + 24 * 60 * 60 * 1000 - 1)) return false;
      return true;
    });
  }, [logs, searchStartDate, searchEndDate]);

  // === PHÂN TRANG ===
  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentLogs = filteredLogs.slice(start, end);

  // === GOM LOGS THEO THÁNG ===
  const logsByMonth = useMemo(() => {
    return currentLogs.reduce((acc, log) => {
      const date = new Date(log.performedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(log);
      return acc;
    }, {});
  }, [currentLogs]);

  // === Toggle trạng thái read/unread ===
  const handleToggleRead = async (log) => {
    try {
      if (log.isRead) {
        await api.markHistoryLogAsUnread(log.id);
      } else {
        await api.markHistoryLogAsRead(log.id);
      }

      setLogs((prevLogs) =>
        prevLogs.map((l) =>
          l.id === log.id ? { ...l, isRead: !l.isRead } : l
        )
      );
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái đọc:", err);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setSearchStartDate("");
    setSearchEndDate("");
  };

  if (loading) return <p className="history-logs-page">⏳ Đang tải dữ liệu...</p>;
  if (error) return <p className="history-logs-page error">{error}</p>;
  if (logs.length === 0) return <p className="history-logs-page">📭 Không có nhật ký nào.</p>;

  return (
    <div className="history-logs-page">
      <div className="header">
        <h1>🔔 Nhật ký hoạt động</h1>
      </div>

      {/* Thanh điều khiển: Bộ lọc ngày bên trái - Hiển thị trang bên phải */}
      <div className="filter-pagination-bar">
        {/* Hiển thị số nhật ký mỗi trang + ngày hiện tại */}
        <div className="pagination-and-date">
          <div className="pagination-control">
            <label>
              Hiển thị
              <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              nhật ký mỗi trang
            </label>
          </div>
          {/* <div className="current-date">
            {new Date().toLocaleDateString("vi-VN")}
          </div> */}
        </div>

        {/* Bộ lọc tìm kiếm theo ngày */}
        <div className="search-filter">
          <label>
            Từ ngày:
            <input
              type="date"
              value={searchStartDate}
              onChange={(e) => {
                setSearchStartDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>
          <label>
            Đến ngày:
            <input
              type="date"
              value={searchEndDate}
              onChange={(e) => {
                setSearchEndDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>
          <button onClick={handleClearFilter}>Xóa lọc</button>
        </div>
      </div>

      {/* Hiển thị logs theo tháng/ngày */}
      {Object.keys(logsByMonth)
        .sort((a, b) => new Date(b + "-01") - new Date(a + "-01"))
        .map((month) => {
          const monthLogs = logsByMonth[month];
          const logsByDay = monthLogs.reduce((acc, log) => {
            const dateKey = formatDate(log.performedAt);
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(log);
            return acc;
          }, {});

          const [year, monthNum] = month.split("-");
          const monthLabel = `${monthNum}/${year}`;

          return (
            <div key={month} className="logs-by-month">
              <h2 className="month-label">{monthLabel}</h2>

              {Object.keys(logsByDay)
                .sort((a, b) => new Date(b) - new Date(a))
                .map((date) => (
                  <div key={date} className="logs-by-date">
                    {/* Hiển thị ngày */}
                    <div className="date-separator">{date}</div>

                    <table className="logs-table">
                      <thead>
                        <tr>
                          <th>✔</th>
                          <th>Người dùng</th>
                          <th>Hành động</th>
                          <th>Thời gian</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logsByDay[date]
                          .sort(
                            (a, b) =>
                              new Date(b.performedAt) - new Date(a.performedAt)
                          )
                          .map((log) => (
                            <tr key={log.id}>
                              <td
                                className="tick-wrapper"
                                onClick={() => handleToggleRead(log)}
                              >
                                <span
                                  className={`tick ${
                                    log.isRead ? "read" : "unread"
                                  }`}
                                >
                                  ✔
                                </span>
                              </td>
                              <td>{log.username || "Unknown"}</td>
                              <td>{log.action}</td>
                              <td>{formatTime(log.performedAt)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ))}
            </div>
          );
        })}

      {/* Pagination */}
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
};

export default HistoryLogsPage;
