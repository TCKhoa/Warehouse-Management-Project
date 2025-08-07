import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/CreateExportReceipt.scss'; // Dùng lại style nếu chưa có file riêng

const CreateImportReceipt = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [note, setNote] = useState('');
  const [createdBy, setCreatedBy] = useState('');

  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [createdDate, setCreatedDate] = useState('');

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

  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    setCreatedDate(formatted);
  }, []);

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

    const item = {
      ...product,
      quantity: selectedQuantity,
      import_price: selectedPrice || product.price || 0,
    };

    setSelectedItems((prev) => [...prev, item]);
    setSelectedProductId('');
    setSelectedQuantity(1);
    setSelectedPrice(0);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      alert('Vui lòng thêm ít nhất một sản phẩm!');
      return;
    }

    const newReceipt = {
      import_code: `PNK-${Date.now()}`,
      created_by: createdBy || 'admin',
      created_at: createdDate,
      note,
      details: selectedItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        import_price: item.import_price,
      })),
    };

    try {
      const savedReceipt = await api.createImportReceipt(newReceipt);
      alert('Tạo phiếu nhập kho thành công!');
      navigate(`/import-receipts/${savedReceipt.id}`);
    } catch (err) {
      console.error('Lỗi tạo phiếu:', err);
      alert('Tạo phiếu thất bại!');
    }
  };

  return (
    <div className="create-export-page">
      <h2>Tạo phiếu nhập kho</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Người tạo phiếu:</label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            required
          />
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
                <th>Số lượng</th>
                <th>Xoá</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.unit_name || '---'}</td>
                  <td>{item.quantity}</td>
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
          ✅ Nhập kho
        </button>
      </form>
    </div>
  );
};

export default CreateImportReceipt;
