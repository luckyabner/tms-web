"use client";

import {
	LayoutDashboard,
	Users,
	Award,
	Briefcase,
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
} from '@/components/ui/sidebar';

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

// 主要功能菜单
const mainItems = [
	{
		title: '工作台',
		url: '/hr/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: '员工档案',
		url: '/hr/employees',
		icon: Users,
	},
	{
		title: '绩效管理',
		url: '/hr/performance',
		icon: Award,
	},
	{
		title: '项目管理',
		url: '/hr/projects',
		icon: Briefcase,
	},
];

export function AppSidebar() {
	const pathname = usePathname();

	const isActive = (url) => {
		return pathname === url;
	};

	return (
		<Sidebar className="border-r border-gray-200">
			<SidebarHeader className="flex items-center justify-center py-8 px-6 border-b border-gray-200">
				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
						<span className="text-white font-bold text-lg">TM</span>
					</div>
					<div>
						<h2 className="font-bold text-xl text-gray-800">人才管理</h2>
						<p className="text-sm text-gray-500 font-medium">Talent Management</p>
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
											'hover:bg-blue-50 hover:text-blue-700',
											isActive(item.url) && 'bg-blue-50 text-blue-700 font-medium'
										)}
									>
										<a href={item.url} className="flex items-center space-x-3 px-3 py-2 rounded-lg">
											<item.icon className={cn(
												'h-5 w-5 transition-colors duration-200',
												isActive(item.url) ? 'text-blue-600' : 'text-gray-400'
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
