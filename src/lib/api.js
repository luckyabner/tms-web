import axios from "axios";
import Cookies from "js-cookie";

// 创建axios实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://39.106.25.10:9090",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10秒超时
});

api.interceptors.request.use(
  async (config) => {
    let token = null;

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      // 客户端环境
      token = Cookies.get("auth_token");
    } else {
      // 服务器端环境
      try {
        const { cookies } = await import("next/headers");
        const cookieStore = cookies();
        token = cookieStore.get("auth_token")?.value;
        console.log("服务器端请求拦截器，当前token:", token);
      } catch (error) {
        console.error("服务器端获取token失败:", error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
