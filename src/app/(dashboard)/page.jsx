"use client";
import AdminPage from "@/components/admin";
import HrPage from "@/components/hr";
import LeaderPage from "@/components/leader";
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
  } else {
    // 如果不是HR角色，重定向到登录页面或其他页面
    redirect("/login");
  }
}
