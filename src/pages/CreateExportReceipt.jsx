import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/CreateExportReceipt.scss';

const CreateExportReceipt = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [note, setNote] = useState('');
  const [createdById, setCreatedById] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // <-- state lưu lỗi

  // Lấy danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
      }
    };
    fetchProducts();
  }, []);

  // Lấy danh sách user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách user:', error);
      }
    };
    fetchUsers();
  }, []);

  // Lấy ngày hiện tại
  useEffect(() => {
    const today = new Date();
    setCreatedDate(today.toISOString().split('T')[0]);
  }, []);

  // Thêm sản phẩm vào danh sách xuất
  const handleAddProduct = () => {
    if (!selectedProductId) {
      alert('Vui lòng chọn sản phẩm');
      return;
    }

    const product = products.find((p) => String(p.id) === String(selectedProductId));
    if (!product) return;

    const alreadySelected = selectedItems.find(
      (item) => String(item.id) === String(product.id)
    );
    if (alreadySelected) {
      alert('Sản phẩm đã được thêm. Vui lòng xoá nếu muốn thay đổi.');
      return;
    }

    const price = Number(product.price ?? product.importPrice ?? 0);
    const unitName = product.unitName || (product.unit ? product.unit.name : '---');

    const item = {
      id: product.id,
      name: product.name,
      price,
      quantity: selectedQuantity,
      export_price: selectedPrice ? Number(selectedPrice) : price,
      unit_name: unitName,
    };

    setSelectedItems((prev) => [...prev, item]);
    setSelectedProductId('');
    setSelectedQuantity(1);
    setSelectedPrice('');
  };

  // Xóa sản phẩm khỏi danh sách
  const handleRemoveItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  // Submit phiếu xuất kho
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // reset lỗi trước khi submit

    if (selectedItems.length === 0) {
      setErrorMessage('Vui lòng thêm ít nhất một sản phẩm!');
      return;
    }

    if (!createdById) {
      setErrorMessage('Vui lòng chọn người tạo phiếu!');
      return;
    }

    const createdAtISO = `${createdDate}T00:00:00`;

    const newReceipt = {
      exportReceipt: {
        exportCode: `PXK-${Date.now()}`,
        createdBy: { id: createdById },
        createdAt: createdAtISO,
        note,
      },
      details: selectedItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.export_price,
      })),
    };

    try {
      const savedReceipt = await api.createExportReceipt(newReceipt);
      alert('✅ Tạo phiếu xuất kho thành công!');
      navigate(`/export-receipts/${savedReceipt.id}`);
    } catch (err) {
      console.error('Lỗi tạo phiếu:', err);

      // Nếu BE trả JSON có message
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Tạo phiếu thất bại! Vui lòng thử lại.');
      }
    }
  };

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  return (
    <div className="create-export-page">
      <h2>Tạo phiếu xuất kho</h2>

      {errorMessage && (
        <div className="error-message">
          ❌ {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Người tạo phiếu:</label>
          <select
            value={createdById}
            onChange={(e) => setCreatedById(e.target.value)}
            required
          >
            <option value="">-- Chọn người tạo --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.username})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Ngày lập:</label>
          <input type="date" value={createdDate} readOnly />
        </div>

        <div className="form-group">
          <label>Ghi chú:</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Chọn sản phẩm:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">-- Chọn sản phẩm --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.code})
              </option>
            ))}
          </select>
        </div>

        {selectedProductId && (
          <>
            <div className="form-group">
              <label>Số lượng:</label>
              <input
                type="number"
                min="1"
                value={selectedQuantity}
                onChange={(e) =>
                  setSelectedQuantity(Math.max(1, parseInt(e.target.value)))
                }
              />
            </div>

            <div className="form-group">
              <label>Giá xuất (₫):</label>
              <input
                type="number"
                min="0"
                value={selectedPrice}
                onChange={(e) =>
                  setSelectedPrice(Math.max(0, parseFloat(e.target.value)))
                }
                placeholder="Mặc định bằng giá sản phẩm"
              />
            </div>

            <button className="button" type="button" onClick={handleAddProduct}>
              ➕ Thêm sản phẩm
            </button>
          </>
        )}

        {selectedItems.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Tên sản phẩm</th>
                <th>Đơn vị</th>
                <th>Giá gốc</th>
                <th>Số lượng</th>
                <th>Giá xuất</th>
                <th>Thành tiền</th>
                <th>Xoá</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.unit_name}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(item.export_price)}</td>
                  <td>{formatCurrency(item.quantity * item.export_price)}</td>
                  <td>
                    <button type="button" onClick={() => handleRemoveItem(index)}>
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button type="submit" className="submit-btn">
          ✅ Xuất phiếu kho
        </button>
      </form>
    </div>
  );
};

export default CreateExportReceipt;
