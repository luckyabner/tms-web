import {
	LayoutDashboard,
	Users,
	UserPlus,
	Calendar,
	TrendingUp,
	FileText,
	Award,
	Settings,
	Building,
	UserCheck,
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

// 主要功能菜单
const mainItems = [
	{
		title: '工作台',
		url: '/dashboard',
		icon: LayoutDashboard,
	},
	{
		title: '员工档案',
		url: '/employees',
		icon: Users,
	},
	{
		title: '绩效管理',
		url: '/performance',
		icon: Award,
	},
	{
		title: '关系分析',
		url: '/performance',
		icon: TrendingUp,
	},
];

// 组织管理菜单
const organizationItems = [
	{
		title: '部门管理',
		url: '/departments',
		icon: Building,
	},
	{
		title: '员工档案',
		url: '/employees',
		icon: UserCheck,
	},
];

// 系统设置菜单
const systemItems = [
	{
		title: '报表分析',
		url: '/reports',
		icon: FileText,
	},
	{
		title: '系统设置',
		url: '/settings',
		icon: Settings,
	},
];

export function AppSidebar() {
	return (
		<Sidebar>
			<SidebarHeader className="flex items-center justify-center p-6 border-b">
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
						<span className="text-white font-bold text-sm">TM</span>
					</div>
					<div>
						<h2 className="font-semibold text-lg">人才管理系统</h2>
						<p className="text-sm text-muted-foreground">Talent Management</p>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>主要功能</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>组织管理</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{organizationItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>系统管理</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{systemItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
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
