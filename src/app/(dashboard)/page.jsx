"use client";
import AdminPage from "@/components/dashboard/admin";
import HrPage from "@/components/dashboard/hr";
import LeaderPage from "@/components/dashboard/leader";
import useAuth from "@/hooks/auth";
import { redirect } from "next/navigation";

export default function Home() {
  const role = useAuth((state) => state.role);
  // 根据角色渲染不同的页面
  if (role === "hr") {
    return <HrPage />;
  } else if (role === "leader") {
    return <LeaderPage />;
  } else if (role === "admin") {
    return <AdminPage />;
  } else if (role === "employee") {
    // 如果是员工角色，可以重定向到员工专属页面或其他逻辑
    redirect("/employees/4");
  } else {
    // 如果不是HR角色，重定向到登录页面或其他页面
    redirect("/login");
  }
}
