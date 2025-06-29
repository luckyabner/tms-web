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
    (set) => ({
      role: Role.HR,
      changeRole: (newRole) => set({ role: newRole }),
    }),
    {
      name: "auth-storage", // localStorage 中的键名
      partialize: (state) => ({ role: state.role }), // 只持久化 role 字段
    }
  )
);
