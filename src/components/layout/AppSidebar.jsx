"use client";

import { Award, Briefcase, LayoutDashboard, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import useAuth from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { BarChart, Building, Home, UserCog } from "lucide-react";
import { usePathname } from "next/navigation";

// hr端菜单
const hrNav = [
  {
    title: "工作台",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "员工档案",
    url: "/employees",
    icon: Users,
  },
  {
    title: "绩效管理",
    url: "/performance",
    icon: Award,
  },
  {
    title: "项目管理",
    url: "/projects",
    icon: Briefcase,
  },
  {
    title: "人事审批",
    icon: UserCog,
    url: "/transfers",
  },
];

const leaderNav = [
  {
    title: "工作台",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "员工信息",
    icon: Users,
    url: "/employees",
  },
  {
    title: "部门信息",
    icon: Building,
    url: "/departments",
  },
  {
    title: "人事调动",
    icon: UserCog,
    url: "/transfers/new",
  },
  {
    title: "数据分析",
    icon: BarChart,
    url: "/analysis",
  },
];

const adminNav = [
  {
    title: "工作台",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "员工管理",
    icon: Users,
    url: "/employees",
  },
  {
    title: "部门管理",
    icon: Building,
    url: "/departments",
  },
  {
    title: "系统日志",
    icon: BarChart,
    url: "/logs",
  },
];

const employeeNav = [
  {
    title: "个人档案",
    icon: Users,
    url: "/employees/4",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const role = useAuth((state) => state.role);

  let navItems = [];
  if (role === "hr") {
    navItems = hrNav;
  } else if (role === "leader") {
    navItems = leaderNav;
  } else if (role === "admin") {
    navItems = adminNav;
  } else if (role === "employee") {
    navItems = employeeNav;
  }

  const isActive = (url) => {
    return pathname === url;
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="flex items-center justify-center border-b border-gray-200 px-6 py-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-200">
            <span className="text-lg font-bold text-white">TM</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">人才管理</h2>
            <p className="text-sm font-medium text-gray-500">
              Talent Management
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">
            主要功能
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "mx-3 mb-1 transition-colors duration-200",
                      "hover:bg-blue-50 hover:text-blue-700",
                      isActive(item.url) &&
                        "bg-blue-50 font-medium text-blue-700"
                    )}
                  >
                    <a
                      href={item.url}
                      className="flex items-center space-x-3 rounded-lg px-3 py-2"
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-colors duration-200",
                          isActive(item.url) ? "text-blue-600" : "text-gray-400"
                        )}
                      />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
