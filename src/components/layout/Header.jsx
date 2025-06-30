"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Role, useAuth } from "@/hooks/auth";
import { useNextAuth } from "@/hooks/useNextAuth";
import { Bell, ChevronDown, LogOut, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPath = pathname?.startsWith("/admin");
  const { changeRole, userInfo, clearAuth } = useAuth();
  const { logout } = useNextAuth();
  const role = userInfo?.empType;

  // 处理退出登录
  const handleLogout = () => {
    // 在实际应用中，这里会调用API清除会话、令牌等
    // 可以添加确认对话框
    if (window.confirm("确定要退出登录吗？")) {
      clearAuth();
      logout();
      // 重定向到登录页面
      router.push("/login");
    }
  };

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
      {/* 左侧：侧边栏触发器和面包屑 */}
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div className="text-muted-foreground flex items-center space-x-2 text-sm">
          <span>智能人才管理系统</span>
          <span>/</span>
          <span className="text-foreground font-medium">工作台</span>
        </div>
      </div>

      {/* 右侧：通知和用户菜单 */}
      <div className="flex items-center space-x-4">
        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 px-3"
            >
              <div
                className={`h-8 w-8 ${isAdminPath ? "bg-purple-600" : "bg-blue-600"} flex items-center justify-center rounded-full`}
              >
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">
                  {userInfo?.name || "未登录"}
                </div>
                <div className="text-muted-foreground text-xs">{role}</div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
