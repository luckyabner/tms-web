"use client";
import {
  deleteDepartment,
  getAllDepartments,
} from "@/lib/services/departmentService";
import useSWR from "swr";

export function useDepartment() {
  const { data, error, isLoading, mutate } = useSWR("departments", async () => {
    return getAllDepartments();
  });

  return {
    departments: data,
    isLoading,
    error,
    refreshDepartments: mutate, // 手动刷新数据
  };
}

export const handleDeleteDepartment = async (id) => {
  if (window.confirm("确定要删除该部门吗？此操作无法撤销。")) {
    try {
      await deleteDepartment(id);
    } catch (err) {
      console.error("删除部门失败:", err);
      alert("删除部门失败，请稍后重试");
    }
  }
};
