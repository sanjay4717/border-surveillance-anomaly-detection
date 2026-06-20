import axios from "axios";

// The backend URL is set via an environment variable so we can point to
// localhost during development and to the deployed Render URL in
// production. See .env.example for setup instructions.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const detectAnomaly = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/api/detect", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getHistory = async (limit = 50) => {
  const response = await api.get(`/api/history?limit=${limit}`);
  return response.data;
};

export const getDetectionDetail = async (id) => {
  const response = await api.get(`/api/history/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/api/stats");
  return response.data;
};

export default api;
