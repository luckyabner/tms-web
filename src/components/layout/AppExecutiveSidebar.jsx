"use client";

import {
	LayoutDashboard,
	Users,
	Building,
	UserCog,
	Briefcase,
	LineChart,
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
		title: '领导看板',
		url: '/executive/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: '员工管理',
		url: '/executive/employees',
		icon: Users,
	},
	{
		title: '部门管理',
		url: '/executive/departments',
		icon: Building,
	},
];

// 业务管理菜单
const businessItems = [
	{
		title: '人事调动',
		url: '/executive/transfers',
		icon: UserCog,
	},
	{
		title: '部门分析',
		url: '/executive/analysis',
		icon: LineChart,
	},
];

export function AppExecutiveSidebar() {
	const pathname = usePathname();

	const isActive = (url) => {
		return pathname === url;
	};

	return (
		<Sidebar className="border-r border-gray-200">
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
							{mainItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={cn(
											'mx-3 mb-1 transition-colors duration-200',
											'hover:bg-green-50 hover:text-green-700',
											isActive(item.url) && 'bg-green-50 text-green-700 font-medium'
										)}
									>
										<a href={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
											<item.icon className={cn(
												'h-5 w-5 transition-colors duration-200',
												isActive(item.url) ? 'text-green-600' : 'text-gray-400'
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
						业务管理
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{businessItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										className={cn(
											'mx-3 mb-1 transition-colors duration-200',
											'hover:bg-green-50 hover:text-green-700',
											isActive(item.url) && 'bg-green-50 text-green-700 font-medium'
										)}
									>
										<a href={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
											<item.icon className={cn(
												'h-5 w-5 transition-colors duration-200',
												isActive(item.url) ? 'text-green-600' : 'text-gray-400'
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