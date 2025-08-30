// src/services/api.js
import axios from "axios";

// ----------------- BASE CONFIG -----------------
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
});

// ----------------- REQUEST INTERCEPTOR -----------------
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------- RESPONSE INTERCEPTOR -----------------
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ----------------- API METHODS -----------------
const api = {
  // ---------- AUTH ----------
  login: async (data) => {
    const response = await apiClient.post("/login", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },

  // ---------- USERS ----------
  createUser: async (data) => {
    const res = await apiClient.post("/users", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },
  getUsers: async () => {
    const response = await apiClient.get("/users");
    return response.data;
  },
  getUserById: async (id) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
  updateUser: async (id, data) => {
    const response = await apiClient.put(`/users/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // ---------- PRODUCTS ----------
  getProducts: async () => {
    const response = await apiClient.get("/products");
    return response.data.map((p) => ({
      ...p,
      imageUrl: p.imageUrl
        ? p.imageUrl.startsWith("http")
          ? p.imageUrl
          : `http://localhost:8080/${p.imageUrl.replace(/^\//, "")}`
        : null,
    }));
  },
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },
  createProduct: async (data) => {
    const formData = new FormData();
    const productData = { ...data };
    if (productData.imageFile) delete productData.imageFile;
    if (productData.importPrice !== undefined)
      productData.importPrice = parseFloat(productData.importPrice);
    if (productData.stock !== undefined)
      productData.stock = parseInt(productData.stock);
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );
    if (data.imageFile) {
      formData.append("imageFile", data.imageFile);
    }
    const response = await apiClient.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  updateProduct: async (id, data) => {
    const formData = new FormData();
    const productData = { ...data };
    if (productData.imageFile) delete productData.imageFile;
    if (productData.importPrice !== undefined)
      productData.importPrice = parseFloat(productData.importPrice);
    if (productData.stock !== undefined)
      productData.stock = parseInt(productData.stock);
    formData.append(
      "product",
      new Blob([JSON.stringify(productData)], { type: "application/json" })
    );
    if (data.imageFile) {
      formData.append("imageFile", data.imageFile);
    }
    const response = await apiClient.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },
  getProductsByLocation: async (locationId) => {
    const response = await apiClient.get(`/products/location/${locationId}`);
    return response.data;
  },

  // ---------- CATEGORIES ----------
  getCategories: async () => {
    const response = await apiClient.get("/categories");
    return response.data;
  },
  createCategory: async (data) => {
    const response = await apiClient.post("/categories", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  updateCategory: async (id, data) => {
    const response = await apiClient.put(`/categories/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },

  // ---------- BRANDS ----------
  getBrands: async () => {
    const response = await apiClient.get("/brands");
    return response.data;
  },
  createBrand: async (data) => {
    const response = await apiClient.post("/brands", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  updateBrand: async (id, data) => {
    const response = await apiClient.put(`/brands/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  deleteBrand: async (id) => {
    const response = await apiClient.delete(`/brands/${id}`);
    return response.data;
  },

  // ---------- UNITS ----------
  getUnits: async () => {
    const response = await apiClient.get("/units");
    return response.data;
  },
  createUnit: async (data) => {
    const response = await apiClient.post("/units", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  updateUnit: async (id, data) => {
    const response = await apiClient.put(`/units/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  deleteUnit: async (id) => {
    const response = await apiClient.delete(`/units/${id}`);
    return response.data;
  },

  // ---------- LOCATIONS ----------
  getLocations: async () => {
    const response = await apiClient.get("/locations");
    return response.data;
  },
  createLocation: async (data) => {
    const response = await apiClient.post("/locations", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  updateLocation: async (id, data) => {
    const response = await apiClient.put(`/locations/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  deleteLocation: async (id) => {
    const response = await apiClient.delete(`/locations/${id}`);
    return response.data;
  },

  // ---------- IMPORT RECEIPTS ----------
  getImportReceipts: async () => {
    const response = await apiClient.get("/import-receipts");
    return response.data;
  },
  getImportReceiptById: async (id) => {
    const response = await apiClient.get(`/import-receipts/${id}`);
    return response.data;
  },
  createImportReceipt: async (data) => {
    const response = await apiClient.post("/import-receipts", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  updateImportReceipt: async (id, data) => {
    const response = await apiClient.put(`/import-receipts/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  deleteImportReceipt: async (id) => {
    const response = await apiClient.delete(`/import-receipts/${id}`);
    return response.data;
  },

  // ---------- EXPORT RECEIPTS ----------
  getExportReceipts: async () => {
    const response = await apiClient.get("/export-receipts");
    return response.data;
  },
  getExportReceiptById: async (id) => {
    const response = await apiClient.get(`/export-receipts/${id}`);
    return response.data;
  },
  createExportReceipt: async (data) => {
    const response = await apiClient.post("/export-receipts", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  updateExportReceipt: async (id, data) => {
    const response = await apiClient.put(`/export-receipts/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  deleteExportReceipt: async (id) => {
    const response = await apiClient.delete(`/export-receipts/${id}`);
    return response.data;
  },

  // ---------- HISTORY LOGS ----------
  // ---------- HISTORY LOGS ----------
getHistoryLogs: async () => {
  const response = await apiClient.get("/history-logs");
  return response.data.map((l) => ({ ...l, isRead: Boolean(l.isRead) }));
},
getUnreadHistoryLogs: async () => {
  const response = await apiClient.get("/history-logs/unread");
  return response.data.map((l) => ({ ...l, isRead: Boolean(l.isRead) }));
},
getHistoryLogById: async (id) => {
  const res = await apiClient.get(`/history-logs/${id}`);
  return { ...res.data, isRead: Boolean(res.data.isRead) };
},
createHistoryLog: async (data) => {
  const res = await apiClient.post("/history-logs", data, {
    headers: { "Content-Type": "application/json" },
  });
  return { ...res.data, isRead: Boolean(res.data.isRead) };
},
deleteHistoryLog: async (id) => {
  const res = await apiClient.delete(`/history-logs/${id}`);
  return res.data;
},
markHistoryLogAsRead: async (id) => {
  const res = await apiClient.patch(`/history-logs/${id}/read`, null, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
},

markHistoryLogAsUnread: async (id) => {
  const res = await apiClient.patch(`/history-logs/${id}/unread`, null, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
},

// ---------- SSE: subscribe history logs ----------
  subscribeHistoryLogs: () => {
    // Trả về EventSource để Sidebar hoặc component khác dùng
    return new EventSource(`${API_BASE_URL}/api/history-logs/stream`);
  },

};

export default api;
