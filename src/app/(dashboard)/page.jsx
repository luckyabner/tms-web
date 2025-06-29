"use client";
import AdminPage from "@/components/dashboard/admin";
import HrPage from "@/components/dashboard/hr";
import LeaderPage from "@/components/dashboard/leader";
import { Role, useAuth } from "@/hooks/auth";
import { redirect } from "next/navigation";

export default function Home() {
  const { role, empId } = useAuth();
  // 根据角色渲染不同的页面
  if (role === Role.HR) {
    return <HrPage />;
  } else if (role === Role.LEADER) {
    return <LeaderPage />;
  } else if (role === Role.ADMIN) {
    return <AdminPage />;
  } else if (role === Role.EMPLOYEE) {
    // 如果是员工角色，可以重定向到员工专属页面或其他逻辑
    redirect(`/employees/${empId}`);
  } else {
    // 其他情况，重定向到登录页面或其他页面
    redirect("/login");
  }
}
