// src/pages/ExportReceiptDetail.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ExportReceiptDetail.scss";
// import logo from "../assets/img/logoden.png";

const ExportReceiptDetail = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await api.getExportReceiptById(id);
        setReceipt({
          ...data,
          details: data.details || [],
        });
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết phiếu:", err);
      }
    };
    fetchReceipt();
  }, [id]);

  const formatCurrency = (amount) =>
    amount?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }) || "0 ₫";

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open("", "_blank", "width=900,height=700");
    newWindow.document.write(`
      <html>
        <head>
          <title>In phiếu xuất kho</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; }
            h2 { text-align: center; margin: 5px 0; }
            p { margin: 4px 0; }
            .header-top {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 14px;
            }
            .header-top div { width: 45%; }
            .header-top .right { text-align: right; }
            .title {
              text-align: center;
              margin: 10px 0 20px;
            }
            .title .date {
              font-style: italic;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px;
              text-align: center;
            }
            th { background-color: #f0f0f0; }
            .info-section { font-size: 14px; margin-bottom: 15px; }
            .info-section p { margin: 3px 0; }
            .footer-sign {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
              text-align: center;
              font-size: 14px;
            }
            .footer-sign div {
              width: 20%;
            }
            .total-amount {
              margin-top: 15px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  if (!receipt) return <p>Đang tải...</p>;

  return (
    <div className="print-area">
      <div className="receipt-detail-page" ref={printRef}>
        {/* Header trên cùng */}
        <div className="header-top">
          <div>
            <p><strong>Đơn vị:</strong> Công ty KTQ WAREHOUSE</p>
            <p><strong>Địa chỉ:</strong> 70 Tô Ký, Tân Thới Hiệp Quận 12</p>
          </div>
          <div className="right">
            <p><strong>Mẫu số 02 - VT</strong></p>
            <p>(Ban hành theo Thông tư số 200/2014/TT-BTC)</p>
            <p>Ngày 22/12/2014 của Bộ Tài chính</p>
          </div>
        </div>

        {/* Tiêu đề chính */}
        <div className="title">
          <h2>PHIẾU XUẤT KHO</h2>
          <p className="date">
            Ngày {new Date(receipt.createdAt).getDate()} tháng{" "}
            {new Date(receipt.createdAt).getMonth() + 1} năm{" "}
            {new Date(receipt.createdAt).getFullYear()}
          </p>
          <p>Số: {receipt.exportCode}</p>
        </div>

        {/* Thông tin người nhận */}
        <div className="info-section">
          <p>
            <strong>Họ và tên người nhận hàng:</strong>{" "}
            {receipt.createdByUsername || 'Không xác định'}
          </p>
          <p>
            <strong>Địa chỉ (bộ phận):</strong>{" "}
            {receipt.receiverCompany || "Công ty Thương mại và Dịch vụ ABC"}
          </p>
          {/* <p>
            <strong>Lý do xuất kho:</strong> {receipt.reason || "Xuất bán"}
          </p> */}
          {/* <p>
            <strong>Xuất tại kho (ngăn lô):</strong> Hàng hóa
          </p> */}
          <p>
            <strong>Địa điểm:</strong> 70 Tô Ký, Tân Thới Hiệp Quận 12, TP HCM
          </p>
        </div>

        {/* Bảng sản phẩm */}
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã SP</th>
              <th>Tên SP</th>
              <th>Đơn vị</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {receipt.details?.length > 0 ? (
              receipt.details.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.productCode}</td>
                  <td>{item.productName}</td>
                  <td>{item.unitName}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.exportPrice || item.price)}</td>
                  <td>
                    {formatCurrency(item.quantity * (item.exportPrice || item.price))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Không có sản phẩm</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Tổng cộng */}
        <div className="total-amount">
          Tổng cộng:{" "}
          {formatCurrency(
            receipt.details.reduce(
              (sum, item) =>
                sum + item.quantity * (item.exportPrice || item.price),
              0
            )
          )}
        </div>

        {/* Footer ký tên */}
        <div className="footer-sign">
          <div>
            <p><strong>Người lập phiếu</strong></p>
            <p>(Ký, họ tên)</p>
          </div>
          <div>
            <p><strong>Người nhận hàng</strong></p>
            <p>(Ký, họ tên)</p>
          </div>
          <div>
            <p><strong>Thủ kho</strong></p>
            <p>(Ký, họ tên)</p>
          </div>
          {/* <div>
            <p><strong>Kế toán trưởng</strong></p>
            <p>(Hoặc bộ phận có nhu cầu)</p>
          </div> */}
          <div>
            <p><strong>Giám đốc</strong></p>
            <p>(Ký, họp)</p>
          </div>
        </div>
      </div>

      <button className="print-btn" onClick={handlePrint}>
        🖨 In phiếu
      </button>
    </div>
  );
};

export default ExportReceiptDetail;
