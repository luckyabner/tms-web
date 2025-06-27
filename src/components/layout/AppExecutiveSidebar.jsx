"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  Building, 
  BarChart, 
  Network, 
  UserCog,
  Settings
} from 'lucide-react';

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
  SidebarSeparator,
} from '@/components/ui/sidebar';

export function AppExecutiveSidebar({ className }) {
  const pathname = usePathname();

  const routes = [
    {
      label: '控制面板',
      icon: Home,
      href: '/executive/dashboard',
      active: pathname === '/executive/dashboard',
    },
    {
      label: '员工信息',
      icon: Users,
      href: '/executive/employees',
      active: pathname.includes('/executive/employees'),
    },
    {
      label: '部门信息',
      icon: Building,
      href: '/executive/departments',
      active: pathname.includes('/executive/departments'),
    },
    {
      label: '人事调动',
      icon: UserCog,
      href: '/executive/transfers/new',
      active: pathname.includes('/executive/transfers'),
    },
    {
      label: '数据分析',
      icon: BarChart,
      href: '/executive/analysis',
      active: pathname === '/executive/analysis',
    }
  ];

  return (
    <Sidebar className={cn("border-r border-gray-200", className)}>
      <SidebarHeader className="flex items-center justify-center py-8 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
            <span className="text-white font-bold text-lg">TM</span>
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-800">领导视图</h2>
            <p className="text-sm text-gray-500 font-medium">Executive View</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
            主要功能
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      'mx-3 mb-1 transition-colors duration-200',
                      'hover:bg-green-50 hover:text-green-700',
                      route.active && 'bg-green-50 text-green-700 font-medium'
                    )}
                  >
                    <a href={route.href} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
                      <route.icon className={cn(
                        'h-5 w-5 transition-colors duration-200',
                        route.active ? 'text-green-600' : 'text-gray-400'
                      )} />
                      <span>{route.label}</span>
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