const BASE_URL = 'http://localhost:3000';

const api = {
  // USERS
getUsers: async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
},

createUser: async (data) => {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
},

updateUser: async (user) => {
  const res = await fetch(`${BASE_URL}/users/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
},


  // CATEGORIES
  getCategories: async () => fetch(`${BASE_URL}/categories`).then(res => res.json()),

  // BRANDS
  getBrands: async () => fetch(`${BASE_URL}/brands`).then(res => res.json()),

  // LOCATIONS
  getLocations: async () => fetch(`${BASE_URL}/locations`).then(res => res.json()),

  // PRODUCTS
  getProducts: async () => fetch(`${BASE_URL}/products`).then(res => res.json()),
  getProductById: async (id) => fetch(`${BASE_URL}/products/${id}`).then(res => res.json()),
  createProduct: async (data) =>
    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),
  updateProduct: async (id, data) =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),
  deleteProduct: async (id) =>
    fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' }).then(res => res.json()),

  // IMPORT RECEIPTS
  getImportReceipts: async () => fetch(`${BASE_URL}/import_receipts`).then(res => res.json()),
  getImportReceiptById: async (id) =>
    fetch(`${BASE_URL}/import_receipts/${id}`).then(res => res.json()),
  createImportReceipt: async (data) =>
    fetch(`${BASE_URL}/import_receipts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // EXPORT RECEIPTS
  getExportReceipts: async () => fetch(`${BASE_URL}/export_receipts`).then(res => res.json()),
  getExportReceiptById: async (id) =>
    fetch(`${BASE_URL}/export_receipts/${id}`).then(res => res.json()),
  createExportReceipt: async (data) =>
    fetch(`${BASE_URL}/export_receipts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // REVENUES
  getRevenues: async () => fetch(`${BASE_URL}/revenues`).then(res => res.json()),
  createRevenue: async (data) =>
    fetch(`${BASE_URL}/revenues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

  // HISTORY LOGS
  getHistoryLogs: async () => fetch(`${BASE_URL}/history_logs`).then(res => res.json()),
  createHistoryLog: async (data) =>
    fetch(`${BASE_URL}/history_logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),
};

export default api;
