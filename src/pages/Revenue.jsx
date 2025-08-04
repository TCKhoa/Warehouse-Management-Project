import React from "react";
import "../styles/Revenue.scss";

export default function Revenue() {
  return (
    <div className="revenue-page">
      <h2>📈 Báo cáo doanh thu</h2>
      <div className="revenue-summary">
        <div className="summary-box">
          <h4>Tổng doanh thu hôm nay</h4>
          <p>5,000,000 VND</p>
        </div>
        <div className="summary-box">
          <h4>Tháng này</h4>
          <p>120,000,000 VND</p>
        </div>
        <div className="summary-box">
          <h4>Năm nay</h4>
          <p>1,450,000,000 VND</p>
        </div>
      </div>

      <div className="chart-placeholder">
        <p>[Biểu đồ doanh thu theo ngày/tháng]</p>
      </div>
    </div>
  );
}
