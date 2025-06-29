import { create } from "zustand";
import { persist } from "zustand/middleware";

export const Role = Object.freeze({
  HR: "人事专员",
  LEADER: "公司高层",
  EMPLOYEE: "普通用户",
  ADMIN: "管理员",
});

export const useAuth = create(
  persist(
    (set, get) => ({
      empId: "",
      role: "",
      token: "",
      name: "",
      phone: "",
      changeRole: (newRole) => set({ role: newRole }),
      setEmpId: (empId) => set({ empId }),
      setToken: (token) => set({ token }),
      setName: (name) => set({ name }),
      setPhone: (phone) => set({ phone }),
      // 完整清理所有认证信息
      clearAuth: () =>
        set({
          empId: "",
          role: "",
          token: "",
          name: "",
          phone: "",
        }),
      // 检查登录状态
      isAuthenticated: () => {
        const { token, empId } = get();
        return Boolean(token && empId);
      },
    }),
    {
      name: "auth-storage",
      // 只持久化非敏感信息
      partialize: (state) => ({
        empId: state.empId,
        role: state.role,
        name: state.name,
        token: state.token,
        phone: state.phone,
      }),
    }
  )
);
