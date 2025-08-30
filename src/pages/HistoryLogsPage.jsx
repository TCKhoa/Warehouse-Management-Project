// src/pages/HistoryLogsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import "../styles/HistoryLogsPage.scss";

const HistoryLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Lấy logs từ backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const allLogs = await api.getHistoryLogs();
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

  // Gom logs theo tháng
  const logsByMonth = useMemo(() => {
    return logs.reduce((acc, log) => {
      const date = new Date(log.performedAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(log);
      return acc;
    }, {});
  }, [logs]);

  // Click để toggle trạng thái read/unread
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

  if (loading) return <p className="history-logs-page">⏳ Đang tải dữ liệu...</p>;
  if (error) return <p className="history-logs-page error">{error}</p>;
  if (logs.length === 0) return <p className="history-logs-page">📭 Không có nhật ký nào.</p>;

  return (
    <div className="history-logs-page">
      <h1>🔔 Nhật ký hoạt động</h1>

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
                    <h3 className="date-separator">{date}</h3>
                    <table>
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
                          .sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt))
                          .map((log) => (
                            <tr key={log.id}>
                              <td className="tick-wrapper" onClick={() => handleToggleRead(log)}>
  <span className={`tick ${log.isRead ? "read" : "unread"}`}>✔</span>
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
    </div>
  );
};

export default HistoryLogsPage;
