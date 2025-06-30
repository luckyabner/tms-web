import { create } from "zustand";
import { persist } from "zustand/middleware";

export const Role = Object.freeze({
  HR: "人事专员",
  LEADER: "高层",
  EMPLOYEE: "普通用户",
  ADMIN: "系统管理员",
});

const defaultUserInfo = {
  empId: "",
  empType: "",
  token: "",
  name: "",
  phone: "",
};

export const useAuth = create(
  persist(
    (set, get) => ({
      userInfo: defaultUserInfo,
      // 设置完整用户信息
      setUserInfo: (userInfo) => set({ userInfo }),

      // 更新部分用户信息
      updateUserInfo: (partialInfo) =>
        set((state) => ({
          userInfo: { ...state.userInfo, ...partialInfo },
        })),
      // 兼容旧的单个字段设置方法
      changeRole: (newRole) =>
        set((state) => ({
          userInfo: { ...state.userInfo, empType: newRole },
        })),

      setEmpId: (empId) =>
        set((state) => ({
          userInfo: { ...state.userInfo, empId },
        })),

      setToken: (token) =>
        set((state) => ({
          userInfo: { ...state.userInfo, token },
        })),

      setName: (name) =>
        set((state) => ({
          userInfo: { ...state.userInfo, name },
        })),

      setPhone: (phone) =>
        set((state) => ({
          userInfo: { ...state.userInfo, phone },
        })),

      // 完整清理所有认证信息
      clearAuth: () => set({ userInfo: defaultUserInfo }),

      // 检查登录状态
      isAuthenticated: () => {
        const { userInfo } = get();
        return Boolean(userInfo.token && userInfo.empId);
      },
    }),
    {
      name: "auth-storage",
      // 只持久化非敏感信息
      partialize: (state) => ({
        userInfo: state.userInfo,
      }),
    }
  )
);
