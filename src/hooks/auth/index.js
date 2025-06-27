import { create } from "zustand";

const useAuth = create((set) => ({
  role: "hr",
  changeRole: (newRole) => set({ role: newRole }),
}));

export default useAuth;
