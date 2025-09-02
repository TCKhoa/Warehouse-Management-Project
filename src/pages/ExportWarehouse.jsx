// src/pages/ExportWarehouse.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/ExportWarehouse.scss';
import api from '../services/api';

const ExportWarehouse = () => {
  const [exportReceipts, setExportReceipts] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const role = (localStorage.getItem('role') || 'staff').toLowerCase();

  // Lấy danh sách phiếu xuất
  useEffect(() => {
    fetchExportReceipts();
  }, []);

  const fetchExportReceipts = async () => {
    try {
      const data = await api.getExportReceipts();
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setExportReceipts(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phiếu xuất kho:', error);
    }
  };

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  // Xử lý xóa phiếu xuất
  const handleDeleteClick = (receipt) => {
    Swal.fire({
      title: 'Bạn có chắc muốn xóa?',
      text: `Phiếu xuất ${receipt.exportCode} sẽ bị xóa!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có, xóa!',
      cancelButtonText: 'Hủy',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.deleteExportReceipt(receipt.id);
          Swal.fire('Đã xóa!', `Phiếu xuất ${receipt.exportCode} đã bị xóa.`, 'success');
          fetchExportReceipts();
        } catch (err) {
          Swal.fire('Lỗi!', err.response?.data || 'Xóa thất bại.', 'error');
        }
      }
    });
  };

  // Tính tổng tiền phiếu
  const calculateTotal = (receipt) => {
    if (receipt.totalAmount) return receipt.totalAmount;
    return (receipt.details || []).reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.price) || 0),
      0
    );
  };

  // --- PHÂN TRANG TOÀN BỘ ---
  const totalPages = Math.ceil(exportReceipts.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const currentReceipts = exportReceipts.slice(start, end);

  // Nhóm theo tháng nhưng chỉ lấy dữ liệu của currentReceipts
  const groupedReceipts = currentReceipts.reduce((groups, receipt) => {
    const date = new Date(receipt.createdAt);
    const monthKey = date.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
    if (!groups[monthKey]) groups[monthKey] = [];
    groups[monthKey].push(receipt);
    return groups;
  }, {});

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // reset về trang đầu
  };

  return (
    <div className="export-receipts">
      <div className="header">
        <h2>📦 Lịch sử phiếu xuất kho</h2>
        <button className="create-button" onClick={() => navigate('/export-receipts/new')}>
          + Tạo phiếu xuất kho
        </button>
      </div>

      <div className="pagination-control">
        <label>
          Hiển thị
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          giao dịch mỗi trang
        </label>
      </div>

      {/* Hiển thị grouped receipts theo tháng */}
      {Object.keys(groupedReceipts).map((month) => (
        <div key={month} className="month-group">
          <h3 className="month-title">{month}</h3>
          <table className="receipts-table">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Thời gian</th>
                <th>Người tạo</th>
                <th>Tổng tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {groupedReceipts[month].map((receipt) => {
                const total = calculateTotal(receipt);
                const createdAt = new Date(receipt.createdAt);
                const now = new Date();
                let canDelete = false;
                let tooltip = '';

                if (role === 'admin') {
                  canDelete = true;
                } else if (role === 'manager') {
                  const oneWeekLater = new Date(createdAt);
                  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
                  canDelete = now <= oneWeekLater;
                  if (!canDelete) tooltip = 'Quản lý chỉ được xóa trong 7 ngày';
                } else if (role === 'staff') {
                  const oneDayLater = new Date(createdAt);
                  oneDayLater.setDate(oneDayLater.getDate() + 1);
                  canDelete = now <= oneDayLater;
                  if (!canDelete) tooltip = 'Nhân viên chỉ được xóa trong 24h';
                } else {
                  tooltip = 'Bạn không có quyền xóa';
                }

                return (
                  <tr key={receipt.id}>
                    <td>{receipt.exportCode}</td>
                    <td>{createdAt.toLocaleDateString('vi-VN')}</td>
                    <td>{receipt.createdByUsername || 'Không xác định'}</td>
                    <td>{formatCurrency(total)}</td>
                    <td>
                      <button onClick={() => navigate(`/export-receipts/${receipt.id}`)}>
                        Xem chi tiết
                      </button>
                      <button
                        className="danger"
                        onClick={() => handleDeleteClick(receipt)}
                        disabled={!canDelete}
                        title={!canDelete ? tooltip : ''}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}

      {/* Pagination chung cho toàn bộ */}
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
              className={currentPage === idx + 1 ? 'active' : ''}
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

export default ExportWarehouse;
