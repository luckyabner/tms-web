"use client";
import AdminPage from "@/components/dashboard/admin";
import HrPage from "@/components/dashboard/hr";
import LeaderPage from "@/components/dashboard/leader";
import { Button } from "@/components/ui/button";
import { Role, useAuth } from "@/hooks/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { userInfo } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const role = userInfo?.empType;

  useEffect(() => {
    // 设置一个延迟时间来确保角色信息已加载
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1秒延迟，你可以根据需要调整

    return () => clearTimeout(timer);
  }, []);

  // 如果还在加载中或者用户信息未获取到，显示加载状态
  if (isLoading || !userInfo) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="text-lg">正在加载用户信息...</p>
        </div>
      </div>
    );
  }
  console.log("当前角色:", role);
  // 根据角色渲染不同的页面
  if (role === Role.HR) {
    return <HrPage />;
  } else if (role === Role.LEADER) {
    return <LeaderPage />;
  } else if (role === Role.ADMIN) {
    return <AdminPage />;
  } else if (role === Role.EMPLOYEE) {
    // 如果是员工角色，可以重定向到员工专属页面或其他逻辑
    redirect(`/employees/${userInfo.empId}`);
  } else {
    // 引导登录页面，简约风格，shadcn 组件
    return (
      <div className="bg-background flex h-screen items-center justify-center">
        <div className="bg-card flex min-w-[320px] flex-col items-center gap-8 rounded-xl p-8 shadow-lg">
          <div className="flex flex-col items-center gap-2">
            <img src="/favicon.ico" alt="Logo" className="mb-2 h-12 w-12" />
            <h1 className="text-foreground text-2xl font-bold">
              欢迎使用人才管理系统
            </h1>
            <p className="text-muted-foreground max-w-xs text-center text-sm">
              请先登录以访问您的专属工作台。
            </p>
          </div>
          <Button
            className="w-full text-base font-semibold"
            size="lg"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            登录
          </Button>
        </div>
      </div>
    );
  }
}
