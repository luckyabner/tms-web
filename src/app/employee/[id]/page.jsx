'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
	ArrowLeft,
	Award,
	BarChart3,
	BookOpen,
	Brain,
	Briefcase,
	Calendar,
	Clock,
	Edit,
	FileText,
	GraduationCap,
	Lightbulb,
	Mail,
	MapPin,
	Phone,
	Target,
	TrendingUp,
	User,
	Users,
	Zap,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

// 模拟员工详细数据 - 基于API数据结构
const mockEmployeeDetails = {
	1: {
		id: 1,
		name: '张三',
		password: null, // 不在前端显示
		gender: '男',
		phone: '138-1234-5678',
		empType: '正式员工',
		hireDate: '2023-01-15',
		education: '本科',
		empPhoto: '/api/placeholder/150/150', // 头像URL
		isDeleted: false,
		school: '北京理工大学',
		status: '在职',
		createdAt: '2023-01-01T00:00:00.000Z',
		updatedAt: '2024-06-20T10:30:00.000Z',
		// 扩展字段 - 可能来自其他API
		position: '前端开发工程师',
		department: '技术部',
		employeeId: 'EMP001',
	},
	2: {
		id: 2,
		name: '李四',
		password: null,
		gender: '女',
		phone: '139-8765-4321',
		empType: '正式员工',
		hireDate: '2022-08-20',
		education: '硕士',
		empPhoto: '/api/placeholder/150/150',
		isDeleted: false,
		school: '复旦大学',
		status: '在职',
		createdAt: '2022-08-01T00:00:00.000Z',
		updatedAt: '2024-06-22T14:20:00.000Z',
		position: '产品经理',
		department: '产品部',
		employeeId: 'EMP002',
	},
	3: {
		id: 3,
		name: '王五',
		password: null,
		gender: '男',
		phone: '156-2468-1357',
		empType: '合同工',
		hireDate: '2023-03-10',
		education: '本科',
		empPhoto: null,
		isDeleted: false,
		school: '广州美术学院',
		status: '在职',
		createdAt: '2023-03-01T00:00:00.000Z',
		updatedAt: '2024-06-23T09:15:00.000Z',
		position: 'UI/UX设计师',
		department: '设计部',
		employeeId: 'EMP003',
	},
};

export default function EmployeeDetailPage() {
	const router = useRouter();
	const params = useParams();
	const employeeId = parseInt(params.id);

	const employee = mockEmployeeDetails[employeeId];

	if (!employee) {
		return (
			<div className="container mx-auto p-6">
				<div className="text-center py-12">
					<User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-lg font-semibold mb-2">员工不存在</h3>
					<p className="text-muted-foreground mb-4">未找到ID为 {employeeId} 的员工信息</p>
					<Button
						variant="outline"
						onClick={() => router.push('/employees')}
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						返回员工列表
					</Button>
				</div>
			</div>
		);
	}

	// 格式化日期
	const formatDate = (dateString) => {
		if (!dateString) return '未设置';
		return new Date(dateString).toLocaleDateString('zh-CN');
	};

	// 计算工作年限
	const calculateWorkYears = (hireDate) => {
		if (!hireDate) return '未知';
		const hire = new Date(hireDate);
		const now = new Date();
		const years = now.getFullYear() - hire.getFullYear();
		const months = now.getMonth() - hire.getMonth();
		
		if (years === 0) {
			return `${months}个月`;
		} else if (months < 0) {
			return `${years - 1}年${12 + months}个月`;
		} else {
			return `${years}年${months}个月`;
		}
	};

	// 获取员工状态样式
	const getStatusStyle = (status) => {
		switch (status) {
			case '在职':
				return 'bg-green-100 text-green-800';
			case '离职':
				return 'bg-red-100 text-red-800';
			case '停职':
				return 'bg-yellow-100 text-yellow-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// 获取员工类型样式
	const getEmpTypeStyle = (empType) => {
		switch (empType) {
			case '正式员工':
				return 'bg-blue-100 text-blue-800';
			case '合同工':
				return 'bg-orange-100 text-orange-800';
			case '实习生':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* 返回按钮和操作区域 */}
			<div className="flex items-center justify-between">
				<Button
					variant="outline"
					onClick={() => router.push('/employees')}
					className="mb-4"
				>
					<ArrowLeft className="h-4 w-4 mr-2" />
					返回员工列表
				</Button>
				<div className="flex space-x-2">
					<Button variant="outline">
						<Edit className="h-4 w-4 mr-2" />
						编辑资料
					</Button>
					<Button variant="outline">
						<FileText className="h-4 w-4 mr-2" />
						生成报告
					</Button>
				</div>
			</div>

			{/* 员工基本信息卡片 */}
			<Card>
				<CardHeader>
					<div className="flex items-start space-x-6">
						<div className="relative">
							{employee.empPhoto ? (
								<img
									src={employee.empPhoto}
									alt={employee.name}
									className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
								/>
							) : (
								<div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-white shadow-lg">
									{employee.name.charAt(0)}
								</div>
							)}
							<span className={`absolute -bottom-1 -right-1 px-2 py-1 text-xs rounded-full ${getStatusStyle(employee.status)}`}>
								{employee.status}
							</span>
						</div>
						<div className="flex-1">
							<div className="flex items-center space-x-4 mb-2">
								<CardTitle className="text-2xl">{employee.name}</CardTitle>
								<span className={`px-2 py-1 text-xs rounded-full ${getEmpTypeStyle(employee.empType)}`}>
									{employee.empType}
								</span>
							</div>
							<CardDescription className="text-lg mb-4">
								{employee.position || '暂无职位信息'}
							</CardDescription>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
								<div className="flex items-center space-x-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<span>性别: {employee.gender || '未设置'}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span>电话: {employee.phone || '未设置'}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Briefcase className="h-4 w-4 text-muted-foreground" />
									<span>部门: {employee.department || '未分配'}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span>入职: {formatDate(employee.hireDate)}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span>工龄: {calculateWorkYears(employee.hireDate)}</span>
								</div>
								<div className="flex items-center space-x-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<span>员工号: {employee.employeeId || `EMP${String(employee.id).padStart(3, '0')}`}</span>
								</div>
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* 个人信息详细 */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* 基本信息 */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center">
							<User className="h-5 w-5 mr-2" />
							基本信息
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">姓名</p>
								<p className="font-medium">{employee.name}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">性别</p>
								<p className="font-medium">{employee.gender || '未设置'}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">员工类型</p>
								<span className={`inline-block px-2 py-1 text-xs rounded-full ${getEmpTypeStyle(employee.empType)}`}>
									{employee.empType || '未设置'}
								</span>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">状态</p>
								<span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusStyle(employee.status)}`}>
									{employee.status || '未知'}
								</span>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">职位</p>
								<p className="font-medium">{employee.position || '暂无'}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">部门</p>
								<p className="font-medium">{employee.department || '未分配'}</p>
							</div>
						</div>
						
						<Separator />
						
						<div className="space-y-3">
							<h4 className="font-medium text-sm">时间信息</h4>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground">入职日期</p>
									<p className="font-medium">{formatDate(employee.hireDate)}</p>
								</div>
								<div>
									<p className="text-muted-foreground">工作年限</p>
									<p className="font-medium">{calculateWorkYears(employee.hireDate)}</p>
								</div>
								<div>
									<p className="text-muted-foreground">创建时间</p>
									<p className="font-medium text-xs">{formatDate(employee.createdAt)}</p>
								</div>
								<div>
									<p className="text-muted-foreground">更新时间</p>
									<p className="font-medium text-xs">{formatDate(employee.updatedAt)}</p>
								</div>
							</div>
						</div>

						{(employee.phone) && (
							<>
								<Separator />
								<div className="space-y-3">
									<h4 className="font-medium text-sm">联系方式</h4>
									<div className="space-y-2">
										{employee.phone && (
											<div className="flex items-center space-x-2">
												<Phone className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">{employee.phone}</span>
											</div>
										)}
									</div>
								</div>
							</>
						)}
					</CardContent>
				</Card>

				{/* 教育背景 */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center">
							<BookOpen className="h-5 w-5 mr-2" />
							教育背景
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">学历</p>
								<p className="font-medium">{employee.education || '未设置'}</p>
							</div>
							{employee.school && (
								<div>
									<p className="text-sm text-muted-foreground">毕业院校</p>
									<p className="font-medium">{employee.school}</p>
								</div>
							)}
							{employee.empPhoto && (
								<>
									<Separator />
									<div>
										<p className="text-sm text-muted-foreground mb-2">员工照片</p>
										<img
											src={employee.empPhoto}
											alt={employee.name}
											className="w-32 h-32 rounded-lg object-cover border shadow-sm"
										/>
									</div>
								</>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 系统信息 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<FileText className="h-5 w-5 mr-2" />
						系统信息
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* 账户信息 */}
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-700 flex items-center">
								<User className="h-4 w-4 mr-2" />
								账户信息
							</h4>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-muted-foreground">员工ID:</span>
									<span className="font-medium">{employee.id}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">员工编号:</span>
									<span className="font-medium">{employee.employeeId || `EMP${String(employee.id).padStart(3, '0')}`}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">账户状态:</span>
									<span className={`px-2 py-1 text-xs rounded-full ${employee.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
										{employee.isDeleted ? '已删除' : '正常'}
									</span>
								</div>
							</div>
						</div>

						{/* 时间记录 */}
						<div className="space-y-3">
							<h4 className="font-semibold text-green-700 flex items-center">
								<Clock className="h-4 w-4 mr-2" />
								时间记录
							</h4>
							<div className="space-y-2 text-sm">
								<div>
									<span className="text-muted-foreground block">创建时间:</span>
									<span className="font-medium">{formatDate(employee.createdAt)}</span>
								</div>
								<div>
									<span className="text-muted-foreground block">最后更新:</span>
									<span className="font-medium">{formatDate(employee.updatedAt)}</span>
								</div>
								<div>
									<span className="text-muted-foreground block">入职时间:</span>
									<span className="font-medium">{formatDate(employee.hireDate)}</span>
								</div>
							</div>
						</div>

						{/* 快速操作 */}
						<div className="space-y-3">
							<h4 className="font-semibold text-purple-700 flex items-center">
								<Zap className="h-4 w-4 mr-2" />
								快速操作
							</h4>
							<div className="space-y-2">
								<Button variant="outline" size="sm" className="w-full justify-start">
									<Edit className="h-4 w-4 mr-2" />
									编辑信息
								</Button>
								<Button variant="outline" size="sm" className="w-full justify-start">
									<FileText className="h-4 w-4 mr-2" />
									生成报告
								</Button>
								<Button variant="outline" size="sm" className="w-full justify-start">
									<Phone className="h-4 w-4 mr-2" />
									联系员工
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
