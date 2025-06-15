import React from 'react';
import { Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function Header() {
	return (
		<header className="flex items-center justify-between px-6 py-3 bg-white border-b shadow-sm">
			{/* 左侧：侧边栏触发器和面包屑 */}
			<div className="flex items-center space-x-4">
				<SidebarTrigger />
				<div className="flex items-center space-x-2 text-sm text-muted-foreground">
					<span>智能人才管理系统</span>
					<span>/</span>
					<span className="text-foreground font-medium">工作台</span>
				</div>
			</div>

			{/* 中间：搜索框 */}
			<div className="flex-1 max-w-md mx-8">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder="搜索员工、部门、职位..."
						className="pl-10 pr-4"
					/>
				</div>
			</div>

			{/* 右侧：通知和用户菜单 */}
			<div className="flex items-center space-x-4">
				{/* 通知按钮 */}
				<Button
					variant="ghost"
					size="icon"
					className="relative"
				>
					<Bell className="h-5 w-5" />
					<span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
						3
					</span>
				</Button>

				{/* 用户菜单 */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="flex items-center space-x-2 px-3"
						>
							<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
								<User className="h-4 w-4 text-white" />
							</div>
							<div className="text-left">
								<div className="text-sm font-medium">张管理员</div>
								<div className="text-xs text-muted-foreground">系统管理员</div>
							</div>
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="end"
						className="w-56"
					>
						<DropdownMenuLabel>我的账户</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href="/profile" className="flex items-center">
								<User className="mr-2 h-4 w-4" />
								个人资料
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link href="/settings" className="flex items-center">
								<Settings className="mr-2 h-4 w-4" />
								设置
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="text-red-600">
							<LogOut className="mr-2 h-4 w-4" />
							退出登录
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
