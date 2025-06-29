import axios from "axios";

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://39.106.25.10:9090",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10秒超时
});

export default api;
