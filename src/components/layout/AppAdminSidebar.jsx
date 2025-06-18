"use client";

import {
	LayoutDashboard,
	Users,
	Building,
	Settings,
	ClipboardList,
	ShieldAlert,
	Search,
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

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

// 主要功能菜单
const mainItems = [
	{
		title: '系统概览',
		url: '/admin/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: '员工管理',
		url: '/admin/employees',
		icon: Users,
	},
	{
		title: '部门管理',
		url: '/admin/departments',
		icon: Building,
	},
];

// 系统日志菜单
const logItems = [
	{
		title: '日志看板',
		url: '/admin/logs/dashboard',
		icon: ClipboardList,
	},
	{
		title: '日志查询',
		url: '/admin/logs/search',
		icon: Search,
	},
];

// 系统设置菜单
const systemItems = [
	{
		title: '系统设置',
		url: '/admin/settings',
		icon: Settings,
	},
	{
		title: '权限管理',
		url: '/admin/permissions',
		icon: ShieldAlert,
	},
];

export function AppAdminSidebar() {
	const pathname = usePathname();

	const isActive = (url) => {
		return pathname === url;
	};

	return (
		<Sidebar className="border-r border-gray-200">
			<SidebarHeader className="flex items-center justify-center py-8 px-6 border-b border-gray-200">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
						<span className="text-white font-bold text-lg">TM</span>
					</div>
					<div>
						<h2 className="font-bold text-xl text-gray-800">系统管理</h2>
						<p className="text-sm text-gray-500 font-medium">Admin Panel</p>
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
							{mainItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={cn(
											'mx-3 mb-1 transition-colors duration-200',
											'hover:bg-purple-50 hover:text-purple-700',
											isActive(item.url) && 'bg-purple-50 text-purple-700 font-medium'
										)}
									>
										<a href={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
											<item.icon className={cn(
												'h-5 w-5 transition-colors duration-200',
												isActive(item.url) ? 'text-purple-600' : 'text-gray-400'
											)} />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator className="my-4" />

				<SidebarGroup>
					<SidebarGroupLabel className="px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
						系统日志
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{logItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={cn(
											'mx-3 mb-1 transition-colors duration-200',
											'hover:bg-purple-50 hover:text-purple-700',
											isActive(item.url) && 'bg-purple-50 text-purple-700 font-medium'
										)}
									>
										<a href={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
											<item.icon className={cn(
												'h-5 w-5 transition-colors duration-200',
												isActive(item.url) ? 'text-purple-600' : 'text-gray-400'
											)} />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator className="my-4" />

				<SidebarGroup>
					<SidebarGroupLabel className="px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
						系统管理
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{systemItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={cn(
											'mx-3 mb-1 transition-colors duration-200',
											'hover:bg-purple-50 hover:text-purple-700',
											isActive(item.url) && 'bg-purple-50 text-purple-700 font-medium'
										)}
									>
										<a href={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
											<item.icon className={cn(
												'h-5 w-5 transition-colors duration-200',
												isActive(item.url) ? 'text-purple-600' : 'text-gray-400'
											)} />
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