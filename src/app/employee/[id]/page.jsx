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
	BookOpen,
	Target,
	TrendingUp,
	BarChart3,
	Brain,
	Lightbulb,
	Users,
	Zap,
	GraduationCap,
} from 'lucide-react';

// 模拟员工详细数据
const mockEmployeeDetails = {
	1: {
		id: 1,
		name: '张三',
		gender: '男',
		age: 28,
		position: '前端开发工程师',
		department: '技术部',
		workYears: '3年',
		joinDate: '2023-01-15',
		email: 'zhangsan@company.com',
		phone: '138-1234-5678',
		education: '本科',
		university: '北京理工大学',
		major: '计算机科学与技术',
		status: 'active',
		employeeId: 'EMP001',
		// 能力维度评分 (1-5分)
		abilities: {
			professional: 4.2, // 专业能力
			execution: 4.5, // 执行能力
			management: 3.8, // 管理能力
			collaboration: 4.3, // 协作能力
			innovation: 4.0, // 创新能力
			learning: 4.6, // 学习能力
		},
		// AI智能分析
		aiAnalysis: {
			strengths: [
				'技术功底扎实，熟练掌握多种前端技术栈',
				'学习能力强，能够快速适应新技术和新框架',
				'执行力强，能够按时完成项目任务',
				'团队协作能力良好，善于沟通',
			],
			improvements: [
				'可以加强项目管理和团队领导能力',
				'建议深入学习后端技术，成为全栈开发者',
				'增强业务理解能力，提升产品思维',
			],
			development: [
				'可以考虑向技术负责人或架构师方向发展',
				'建议参与更多跨部门项目，提升协调能力',
				'可以尝试指导新人，培养管理技能',
			],
		},
		// 绩效历史数据
		performanceHistory: [
			{ period: '2023Q1', score: 4.2 },
			{ period: '2023Q2', score: 4.5 },
			{ period: '2023Q3', score: 4.3 },
			{ period: '2023Q4', score: 4.6 },
			{ period: '2024Q1', score: 4.4 },
			{ period: '2024Q2', score: 4.7 },
		],
		// 项目经历
		projects: [
			{
				name: '企业管理系统',
				period: '2023.06 - 2023.12',
				role: '前端开发负责人',
			},
			{
				name: '移动端应用开发',
				period: '2023.01 - 2023.06',
				role: '核心开发工程师',
			},
			{
				name: '用户体验优化项目',
				period: '2024.01 - 2024.05',
				role: '技术顾问',
			},
		],
		// 培训记录
		trainings: [
			{
				name: 'React 18 新特性培训',
				date: '2024.03.15',
				result: '优秀',
			},
			{
				name: '前端性能优化实战',
				date: '2024.01.20',
				result: '良好',
			},
			{
				name: '团队协作与沟通技巧',
				date: '2023.11.10',
				result: '优秀',
			},
			{
				name: 'TypeScript 进阶开发',
				date: '2023.09.05',
				result: '优秀',
			},
		],
	},
	2: {
		id: 2,
		name: '李四',
		gender: '女',
		age: 32,
		position: '产品经理',
		department: '产品部',
		workYears: '5年',
		joinDate: '2022-08-20',
		email: 'lisi@company.com',
		phone: '139-8765-4321',
		education: '硕士',
		university: '复旦大学',
		major: '工商管理',
		status: 'active',
		employeeId: 'EMP002',
		abilities: {
			professional: 4.5,
			execution: 4.3,
			management: 4.7,
			collaboration: 4.6,
			innovation: 4.4,
			learning: 4.2,
		},
		aiAnalysis: {
			strengths: [
				'产品思维敏锐，具备优秀的市场洞察力',
				'管理能力突出，能够高效协调跨部门资源',
				'沟通能力强，善于推动项目进展',
				'数据分析能力强，决策有据可依',
			],
			improvements: [
				'可以加强技术理解，更好地与开发团队协作',
				'建议深入了解用户体验设计原理',
				'增强创新思维，探索更多产品可能性',
			],
			development: [
				'可以考虑向产品总监或事业部负责人发展',
				'建议参与战略规划，提升全局思维',
				'可以尝试指导产品新人，建立产品团队',
			],
		},
		performanceHistory: [
			{ period: '2023Q1', score: 4.3 },
			{ period: '2023Q2', score: 4.4 },
			{ period: '2023Q3', score: 4.6 },
			{ period: '2023Q4', score: 4.5 },
			{ period: '2024Q1', score: 4.7 },
			{ period: '2024Q2', score: 4.8 },
		],
		projects: [
			{
				name: '用户增长项目',
				period: '2023.03 - 至今',
				role: '产品负责人',
			},
			{
				name: '移动端产品重构',
				period: '2023.10 - 2024.02',
				role: '项目经理',
			},
		],
		trainings: [
			{
				name: '产品战略与规划',
				date: '2024.04.10',
				result: '优秀',
			},
			{
				name: '用户体验设计思维',
				date: '2024.02.15',
				result: '良好',
			},
		],
	},
	3: {
		id: 3,
		name: '王五',
		gender: '男',
		age: 26,
		position: 'UI/UX设计师',
		department: '设计部',
		workYears: '4年',
		joinDate: '2023-03-10',
		email: 'wangwu@company.com',
		phone: '156-2468-1357',
		education: '本科',
		university: '广州美术学院',
		major: '视觉传达设计',
		status: 'active',
		employeeId: 'EMP003',
		abilities: {
			professional: 4.4,
			execution: 4.1,
			management: 3.5,
			collaboration: 4.2,
			innovation: 4.6,
			learning: 4.3,
		},
		aiAnalysis: {
			strengths: [
				'设计功底扎实，具备优秀的视觉表现力',
				'创新能力突出，能够提出独特的设计方案',
				'用户体验意识强，注重产品可用性',
				'学习能力强，紧跟设计趋势',
			],
			improvements: [
				'可以加强项目管理能力，提升工作效率',
				'建议增强数据分析能力，用数据驱动设计',
				'提升跨部门沟通技巧，更好地推进设计方案',
			],
			development: [
				'可以考虑向设计负责人或创意总监发展',
				'建议深入学习产品设计方法论',
				'可以尝试指导设计新人，建立设计团队',
			],
		},
		performanceHistory: [
			{ period: '2023Q2', score: 4.0 },
			{ period: '2023Q3', score: 4.2 },
			{ period: '2023Q4', score: 4.1 },
			{ period: '2024Q1', score: 4.3 },
			{ period: '2024Q2', score: 4.4 },
		],
		projects: [
			{
				name: '品牌视觉升级项目',
				period: '2024.01 - 2024.04',
				role: '主设计师',
			},
			{
				name: '移动端界面重设计',
				period: '2023.08 - 2023.12',
				role: 'UI设计师',
			},
		],
		trainings: [
			{
				name: 'Figma 高级技巧培训',
				date: '2024.05.20',
				result: '优秀',
			},
			{
				name: '用户研究方法与实践',
				date: '2024.03.08',
				result: '良好',
			},
		],
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

	// 能力维度配置
	const abilityConfig = [
		{ key: 'professional', name: '专业能力', icon: Target, color: 'text-blue-600' },
		{ key: 'execution', name: '执行能力', icon: Zap, color: 'text-green-600' },
		{ key: 'management', name: '管理能力', icon: Users, color: 'text-purple-600' },
		{ key: 'collaboration', name: '协作能力', icon: Users, color: 'text-orange-600' },
		{ key: 'innovation', name: '创新能力', icon: Lightbulb, color: 'text-yellow-600' },
		{ key: 'learning', name: '学习能力', icon: BookOpen, color: 'text-red-600' },
	];

	// 能力评分条组件
	const AbilityBar = ({ label, score, color, icon: Icon }) => (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Icon className={`h-4 w-4 ${color}`} />
					<span className="text-sm font-medium">{label}</span>
				</div>
				<span className="text-sm font-bold">{score.toFixed(1)}</span>
			</div>
			<div className="w-full bg-gray-200 rounded-full h-2">
				<div
					className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
					style={{ width: `${(score / 5) * 100}%` }}
				></div>
			</div>
		</div>
	);

	// 绩效图表组件（简化版柱状图）
	const PerformanceChart = ({ data }) => {
		const maxScore = Math.max(...data.map((item) => item.score));

		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					{data.map((item, index) => (
						<div
							key={index}
							className="flex flex-col items-center space-y-2"
						>
							<div
								className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
								style={{ height: `${(item.score / maxScore) * 120}px` }}
							></div>
							<span className="text-xs text-muted-foreground">{item.period}</span>
							<span className="text-xs font-semibold">{item.score}</span>
						</div>
					))}
				</div>
			</div>
		);
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
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
								<div className="flex items-center space-x-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<span>性别: {employee.gender}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span>年龄: {employee.age}岁</span>
								</div>
								<div className="flex items-center space-x-2">
									<Briefcase className="h-4 w-4 text-muted-foreground" />
									<span>部门: {employee.department}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span>工龄: {employee.workYears}</span>
								</div>
								<div className="flex items-center space-x-2">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span>入职: {employee.joinDate}</span>
								</div>
								<div className="flex items-center space-x-2">
									<User className="h-4 w-4 text-muted-foreground" />
									<span>员工号: {employee.employeeId}</span>
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
							个人信息
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
								<p className="font-medium">{employee.gender}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">年龄</p>
								<p className="font-medium">{employee.age}岁</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">职位</p>
								<p className="font-medium">{employee.position}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">部门</p>
								<p className="font-medium">{employee.department}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">工龄</p>
								<p className="font-medium">{employee.workYears}</p>
							</div>
						</div>
						{employee.education && <Separator />}
						{employee.education && (
							<div className="space-y-3">
								<h4 className="font-medium text-sm">教育背景</h4>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p className="text-muted-foreground">学历</p>
										<p className="font-medium">{employee.education}</p>
									</div>
									{employee.university && (
										<div>
											<p className="text-muted-foreground">毕业院校</p>
											<p className="font-medium">{employee.university}</p>
										</div>
									)}
									{employee.major && (
										<div className="col-span-2">
											<p className="text-muted-foreground">专业</p>
											<p className="font-medium">{employee.major}</p>
										</div>
									)}
								</div>
							</div>
						)}
						{(employee.email || employee.phone) && (
							<>
								<Separator />
								<div className="space-y-3">
									<h4 className="font-medium text-sm">联系方式</h4>
									<div className="space-y-2">
										{employee.email && (
											<div className="flex items-center space-x-2">
												<Mail className="h-4 w-4 text-muted-foreground" />
												<span className="text-sm">{employee.email}</span>
											</div>
										)}
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

				{/* 能力维度 */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center">
							<Target className="h-5 w-5 mr-2" />
							能力维度
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{abilityConfig.map((ability) => (
							<AbilityBar
								key={ability.key}
								label={ability.name}
								score={employee.abilities[ability.key]}
								color={ability.color}
								icon={ability.icon}
							/>
						))}
					</CardContent>
				</Card>
			</div>

			{/* AI智能分析 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<Brain className="h-5 w-5 mr-2" />
						AI智能分析
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
						{/* 优势特长 */}
						<div className="space-y-3">
							<h4 className="font-semibold text-green-700 flex items-center">
								<TrendingUp className="h-4 w-4 mr-2" />
								优势特长
							</h4>
							<div className="space-y-2">
								{employee.aiAnalysis.strengths.map((strength, index) => (
									<div
										key={index}
										className="flex items-start space-x-2"
									>
										<div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
										<p className="text-sm text-gray-700">{strength}</p>
									</div>
								))}
							</div>
						</div>

						{/* 改进建议 */}
						<div className="space-y-3">
							<h4 className="font-semibold text-orange-700 flex items-center">
								<Target className="h-4 w-4 mr-2" />
								改进建议
							</h4>
							<div className="space-y-2">
								{employee.aiAnalysis.improvements.map((improvement, index) => (
									<div
										key={index}
										className="flex items-start space-x-2"
									>
										<div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
										<p className="text-sm text-gray-700">{improvement}</p>
									</div>
								))}
							</div>
						</div>

						{/* 发展建议 */}
						<div className="space-y-3">
							<h4 className="font-semibold text-blue-700 flex items-center">
								<Lightbulb className="h-4 w-4 mr-2" />
								发展建议
							</h4>
							<div className="space-y-2">
								{employee.aiAnalysis.development.map((development, index) => (
									<div
										key={index}
										className="flex items-start space-x-2"
									>
										<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
										<p className="text-sm text-gray-700">{development}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 绩效历史 */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<BarChart3 className="h-5 w-5 mr-2" />
						绩效历史
					</CardTitle>
				</CardHeader>
				<CardContent>
					<PerformanceChart data={employee.performanceHistory} />
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* 项目经历 */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center">
							<Briefcase className="h-5 w-5 mr-2" />
							项目经历
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{employee.projects.map((project, index) => (
							<div
								key={index}
								className="border-l-4 border-blue-500 pl-4 py-2"
							>
								<h4 className="font-semibold">{project.name}</h4>
								<p className="text-sm text-muted-foreground mb-1">{project.period}</p>
								<p className="text-sm font-medium text-blue-600">{project.role}</p>
							</div>
						))}
					</CardContent>
				</Card>

				{/* 培训记录 */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg flex items-center">
							<GraduationCap className="h-5 w-5 mr-2" />
							培训记录
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{employee.trainings.map((training, index) => (
							<div
								key={index}
								className="border-l-4 border-green-500 pl-4 py-2"
							>
								<h4 className="font-semibold">{training.name}</h4>
								<p className="text-sm text-muted-foreground mb-1">{training.date}</p>
								<span
									className={`text-xs px-2 py-1 rounded-full ${
										training.result === '优秀'
											? 'bg-green-100 text-green-800'
											: training.result === '良好'
												? 'bg-blue-100 text-blue-800'
												: 'bg-gray-100 text-gray-800'
									}`}
								>
									{training.result}
								</span>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
