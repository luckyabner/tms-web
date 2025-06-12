'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
	ArrowLeft,
	Mail,
	Phone,
	MapPin,
	Calendar,
	User,
	Briefcase,
	Edit,
	FileText,
	Award,
	Clock,
} from 'lucide-react';

// 模拟员工详细数据
const mockEmployeeDetails = {
	1: {
		id: 1,
		name: '张三',
		position: '前端开发工程师',
		department: '技术部',
		email: 'zhangsan@company.com',
		phone: '138-1234-5678',
		location: '北京',
		joinDate: '2023-01-15',
		avatar: null,
		status: 'active',
		employeeId: 'EMP001',
		manager: '李经理',
		workLocation: '北京总部 - A座15楼',
		salary: '面议',
		workYears: '3年',
		education: '本科',
		university: '北京理工大学',
		major: '计算机科学与技术',
		skills: ['React', 'Vue.js', 'JavaScript', 'TypeScript', 'Node.js'],
		projects: [
			{
				name: '企业管理系统',
				description: '负责前端开发和用户体验优化',
				period: '2023.06 - 2023.12',
			},
			{
				name: '移动端应用开发',
				description: '使用React Native开发跨平台应用',
				period: '2023.01 - 2023.06',
			},
		],
		achievements: ['2023年度优秀员工', '前端技术创新奖', '团队协作杰出贡献奖'],
	},
	2: {
		id: 2,
		name: '李四',
		position: '产品经理',
		department: '产品部',
		email: 'lisi@company.com',
		phone: '139-8765-4321',
		location: '上海',
		joinDate: '2022-08-20',
		avatar: null,
		status: 'active',
		employeeId: 'EMP002',
		manager: '王总监',
		workLocation: '上海分公司 - B座8楼',
		salary: '面议',
		workYears: '5年',
		education: '硕士',
		university: '复旦大学',
		major: '工商管理',
		skills: ['产品设计', '用户研究', 'Axure RP', 'Figma', '数据分析'],
		projects: [
			{
				name: '用户增长项目',
				description: '负责产品功能规划和用户体验设计',
				period: '2023.03 - 至今',
			},
		],
		achievements: ['产品创新奖', '年度最佳产品经理'],
	},
	// 为其他员工添加基本信息
	3: {
		id: 3,
		name: '王五',
		position: 'UI/UX设计师',
		department: '设计部',
		email: 'wangwu@company.com',
		phone: '156-2468-1357',
		location: '深圳',
		joinDate: '2023-03-10',
		avatar: null,
		status: 'active',
		employeeId: 'EMP003',
		manager: '设计总监',
		workLocation: '深圳分公司 - C座12楼',
		salary: '面议',
		workYears: '4年',
		education: '本科',
		university: '广州美术学院',
		major: '视觉传达设计',
		skills: ['UI设计', 'UX设计', 'Figma', 'Sketch', 'Adobe Creative Suite'],
		projects: [],
		achievements: [],
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
						<div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl">
							{employee.name.charAt(0)}
						</div>
						<div className="flex-1">
							<div className="flex items-center space-x-4 mb-2">
								<CardTitle className="text-2xl">{employee.name}</CardTitle>
								<span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
									在职
								</span>
							</div>
							<CardDescription className="text-lg mb-4">{employee.position}</CardDescription>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div className="flex items-center space-x-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<span>员工编号: {employee.employeeId}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Briefcase className="h-4 w-4 text-muted-foreground" />
									<span>部门: {employee.department}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span>入职时间: {employee.joinDate}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span>工作经验: {employee.workYears}</span>
								</div>
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* 联系信息 */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">联系信息</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center space-x-3">
							<Mail className="h-4 w-4 text-muted-foreground" />
							<div>
								<p className="font-medium">{employee.email}</p>
								<p className="text-sm text-muted-foreground">邮箱</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<Phone className="h-4 w-4 text-muted-foreground" />
							<div>
								<p className="font-medium">{employee.phone}</p>
								<p className="text-sm text-muted-foreground">手机</p>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<MapPin className="h-4 w-4 text-muted-foreground" />
							<div>
								<p className="font-medium">{employee.workLocation}</p>
								<p className="text-sm text-muted-foreground">工作地点</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 教育背景 */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">教育背景</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="font-medium">{employee.education}</p>
							<p className="text-sm text-muted-foreground">学历</p>
						</div>
						<div>
							<p className="font-medium">{employee.university}</p>
							<p className="text-sm text-muted-foreground">毕业院校</p>
						</div>
						<div>
							<p className="font-medium">{employee.major}</p>
							<p className="text-sm text-muted-foreground">专业</p>
						</div>
					</CardContent>
				</Card>

				{/* 组织信息 */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">组织信息</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<p className="font-medium">{employee.manager}</p>
							<p className="text-sm text-muted-foreground">直属主管</p>
						</div>
						<div>
							<p className="font-medium">{employee.department}</p>
							<p className="text-sm text-muted-foreground">所属部门</p>
						</div>
						<div>
							<p className="font-medium">{employee.salary}</p>
							<p className="text-sm text-muted-foreground">薪资</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 技能和专长 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">技能专长</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-2">
						{employee.skills.map((skill, index) => (
							<span
								key={index}
								className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
							>
								{skill}
							</span>
						))}
					</div>
				</CardContent>
			</Card>

			{/* 项目经历 */}
			{employee.projects && employee.projects.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">项目经历</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{employee.projects.map((project, index) => (
							<div
								key={index}
								className="border-l-4 border-blue-500 pl-4"
							>
								<h4 className="font-semibold">{project.name}</h4>
								<p className="text-sm text-muted-foreground mb-1">{project.period}</p>
								<p className="text-sm">{project.description}</p>
							</div>
						))}
					</CardContent>
				</Card>
			)}

			{/* 获得荣誉 */}
			{employee.achievements && employee.achievements.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center">
							<Award className="h-5 w-5 mr-2" />
							获得荣誉
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							{employee.achievements.map((achievement, index) => (
								<div
									key={index}
									className="flex items-center space-x-2"
								>
									<Award className="h-4 w-4 text-yellow-500" />
									<span>{achievement}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
