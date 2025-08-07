import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ExportWarehouse.scss'; // Dùng chung style
import api from '../services/api';

const ImportWarehouse = () => {
  const [importReceipts, setImportReceipts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImportReceipts = async () => {
      try {
        const data = await api.getImportReceipts(); // Gọi API lấy danh sách phiếu nhập
        setImportReceipts(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phiếu nhập kho:', error);
      }
    };
    fetchImportReceipts();
  }, []);

  const formatCurrency = (amount) =>
    amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

  return (
    <div className="export-receipts">
      <div className="header">
        <h2>Lịch sử phiếu nhập kho</h2>
        <button className="create-button" onClick={() => navigate('/import-receipts/new')}>
          + Tạo phiếu nhập kho
        </button>
      </div>

      <table className="receipts-table">
        <thead>
          <tr>
            <th>Mã phiếu</th>
            <th>Thời gian</th>
            <th>Người tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {importReceipts.map((receipt) => {
            const total = receipt.quantity * receipt.import_price;
            return (
              <tr key={receipt.id}>
                <td>{receipt.import_code}</td>
                <td>{new Date(receipt.created_at).toLocaleDateString('vi-VN')}</td>
                <td>{receipt.created_by}</td>
                <td>
                  <button onClick={() => navigate(`/import-receipts/${receipt.id}`)}>
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

export default ImportWarehouse;
