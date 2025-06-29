import api from "../api";

export const login = async (phone, password) => {
  try {
    const res = await api.post("/auth/login", {
      phone: phone,
      password: password,
    });
    return res.data;
  } catch (err) {
    console.error("登录失败:", err);
    throw err;
  }
};
