import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuth = create(
  persist(
    (set) => ({
      role: "hr",
      changeRole: (newRole) => set({ role: newRole }),
    }),
    {
      name: "auth-storage", // localStorage 中的键名
      partialize: (state) => ({ role: state.role }), // 只持久化 role 字段
    }
  )
);

export default useAuth;
