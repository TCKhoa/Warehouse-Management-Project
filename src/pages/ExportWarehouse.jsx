import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ExportWarehouse.scss';
import api from '../services/api';

const ExportWarehouse = () => {
  const [exportReceipts, setExportReceipts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExportReceipts = async () => {
      try {
        const data = await api.getExportReceipts(); // trả về DTO
        setExportReceipts(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phiếu xuất kho:', error);
      }
    };
    fetchExportReceipts();
  }, []);

  const formatCurrency = (amount) =>
    amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

  return (
    <div className="export-receipts">
      <div className="header">
        <h2>Lịch sử phiếu xuất kho</h2>
        <button className="create-button" onClick={() => navigate('/export-receipts/new')}>
          + Tạo phiếu xuất kho
        </button>
      </div>

      <table className="receipts-table">
        <thead>
          <tr>
            <th>Mã giao dịch</th>
            <th>Thời gian</th>
            <th>Người thực hiện</th>
            <th>Tổng giá trị</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {exportReceipts.map((receipt) => {
            const total = (receipt.details || []).reduce(
              (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
              0
            );

            return (
              <tr key={receipt.id}>
                <td>{receipt.exportCode}</td>
                <td>{new Date(receipt.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>{receipt.createdByUsername || 'Không xác định'}</td>
                <td>{formatCurrency(total)}</td>
                <td>
                  <button onClick={() => navigate(`/export-receipts/${receipt.id}`)}>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExportWarehouse;
