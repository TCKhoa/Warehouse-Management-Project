import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/ExportReceiptDetail.scss';
import logo from '../assets/img/warehouse.png'; // Thêm dòng này nếu có logo

const ExportReceiptDetail = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const printRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await api.getExportReceiptById(id);
        setReceipt(data);
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết phiếu:', err);
      }
    };
    fetchReceipt();
  }, [id]);

  const formatCurrency = (amount) =>
    amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const newWindow = window.open('', '_blank', 'width=900,height=700');
    newWindow.document.write(`
      <html>
        <head>
          <title>In phiếu xuất</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h2 { text-align: center; margin-bottom: 20px; }
            p { margin: 6px 0; }
            .info { margin-bottom: 20px; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: center;
            }
            th {
              background-color: #f0f0f0;
            }
            .footer {
              margin-top: 30px;
              display: flex;
              justify-content: space-between;
            }
            .footer div {
              text-align: center;
              width: 30%;
            }
            .logo {
              width: 120px;
              height: auto;
              display: block;
              margin: 0 auto 20px auto;
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
      <div className="receipt-detail-page">
        <div ref={printRef}>
          {/* Logo hiển thị */}
          <img src={logo} alt="Logo" className="logo" />
          <h2>PHIẾU XUẤT KHO</h2>

          <div className="info">
            <p><strong>Mã phiếu:</strong> {receipt.export_code}</p>
            <p><strong>Ngày tạo:</strong> {new Date(receipt.created_at).toLocaleDateString('vi-VN')}</p>
            <p><strong>Người thực hiện:</strong> {receipt.created_by}</p>
            <p><strong>Ghi chú:</strong> {receipt.note || 'Không có'}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã SP</th>
                <th>Tên SP</th>
                <th>Danh mục</th>
                <th>Thương hiệu</th>
                <th>Đơn vị</th>
                <th>Số lượng</th>
                <th>Giá xuất</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {receipt.details.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.product_code}</td>
                  <td>{item.product_name}</td>
                  <td>{item.category_name}</td>
                  <td>{item.brand_name}</td>
                  <td>{item.unit_name}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.export_price)}</td>
                  <td>{formatCurrency(item.quantity * item.export_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="footer">
            <div>
              <p><strong>Người lập phiếu</strong></p>
              <p>(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
              <p><strong>Thủ kho</strong></p>
              <p>(Ký và ghi rõ họ tên)</p>
            </div>
            <div>
              <p><strong>Người nhận hàng</strong></p>
              <p>(Ký và ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
      </div>

      <button className="print-btn" onClick={handlePrint}>🖨 In phiếu</button>
    </div>
  );
};

export default ExportReceiptDetail;
