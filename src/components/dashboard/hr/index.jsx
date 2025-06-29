'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RealTimeClock } from '@/components/ui/real-time-clock';
import { StatCard } from '@/components/ui/stat-card';
import {
    AlertTriangle,
    Calendar,
    CheckCircle,
    Clock,
    Star,
    TrendingUp,
    UserPlus,
    Users,
} from 'lucide-react';

export default function HrPage() {
	return (
		<div className="p-6 space-y-6 bg-gray-50 min-h-screen">
			{/* 欢迎区域 */}
			<div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white p-6">
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-2xl font-bold mb-2">欢迎回来，张三丰！</h1>
						<p className="text-blue-100">
							今天是{' '}
							{new Date().toLocaleDateString('zh-CN', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								weekday: 'long',
							})}
						</p>
					</div>
					<RealTimeClock />
				</div>
			</div>

			{/* 统计卡片 */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="总员工数"
					value="1,245"
					icon={Users}
					trend="up"
					trendValue="+12 本月"
					color="blue"
				/>
				<StatCard
					title="在招职位"
					value="28"
					icon={UserPlus}
					trend="up"
					trendValue="+5 本周"
					color="green"
				/>
				<StatCard
					title="绩效评估"
					value="892"
					icon={TrendingUp}
					trend="up"
					trendValue="+3.2% 提升"
					color="orange"
				/>
				<StatCard
					title="培训进行中"
					value="156"
					icon={Calendar}
					trend="down"
					trendValue="-8 本周"
					color="purple"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* 待办事项 */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5" />
							今日待办
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[
								{ task: '审批张三的转正申请', priority: 'high', time: '09:00' },
								{ task: '面试UI设计师候选人', priority: 'medium', time: '14:00' },
								{ task: '评审Q4培训计划', priority: 'low', time: '16:30' },
								{ task: '更新员工手册', priority: 'medium', time: '待定' },
							].map((item, index) => (
								<div
									key={index}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
								>
									<div className="flex items-center gap-3">
										<div
											className={`w-2 h-2 rounded-full ${
												item.priority === 'high'
													? 'bg-red-500'
													: item.priority === 'medium'
														? 'bg-yellow-500'
														: 'bg-green-500'
											}`}
										/>
										<span className="text-sm">{item.task}</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground">{item.time}</span>
										<Button
											variant="ghost"
											size="sm"
										>
											<CheckCircle className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* 快速操作 */}
				<Card>
					<CardHeader>
						<CardTitle>快速操作</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<Button
							className="w-full justify-start"
							variant="outline"
						>
							<UserPlus className="mr-2 h-4 w-4" />
							添加新员工
						</Button>
						<Button
							className="w-full justify-start"
							variant="outline"
						>
							<Calendar className="mr-2 h-4 w-4" />
							发布招聘职位
						</Button>
						<Button
							className="w-full justify-start"
							variant="outline"
						>
							<TrendingUp className="mr-2 h-4 w-4" />
							创建绩效评估
						</Button>
						<Button
							className="w-full justify-start"
							variant="outline"
						>
							<Star className="mr-2 h-4 w-4" />
							安排培训课程
						</Button>
					</CardContent>
				</Card>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* 近期活动 */}
				<Card>
					<CardHeader>
						<CardTitle>近期活动</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[
								{ action: '李四入职产品部', time: '2小时前', type: 'join' },
								{ action: '王五完成Java培训', time: '4小时前', type: 'training' },
								{ action: '市场部招聘1名运营专员', time: '1天前', type: 'recruitment' },
								{ action: '赵六获得优秀员工奖', time: '2天前', type: 'award' },
							].map((activity, index) => (
								<div
									key={index}
									className="flex items-center gap-3 p-2"
								>
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
											activity.type === 'join'
												? 'bg-green-500'
												: activity.type === 'training'
													? 'bg-blue-500'
													: activity.type === 'recruitment'
														? 'bg-orange-500'
														: 'bg-purple-500'
										}`}
									>
										{activity.type === 'join'
											? '入'
											: activity.type === 'training'
												? '培'
												: activity.type === 'recruitment'
													? '招'
													: '奖'}
									</div>
									<div className="flex-1">
										<p className="text-sm">{activity.action}</p>
										<p className="text-xs text-muted-foreground">{activity.time}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* 系统通知 */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5" />
							系统通知
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[
								{ message: '系统将于本周六进行维护升级', type: 'warning', time: '1小时前' },
								{ message: '新版员工手册已发布', type: 'info', time: '3小时前' },
								{ message: '月度绩效评估即将开始', type: 'info', time: '1天前' },
								{ message: '培训系统更新完成', type: 'success', time: '2天前' },
							].map((notification, index) => (
								<div
									key={index}
									className={`p-3 rounded-lg border-l-4 ${
										notification.type === 'warning'
											? 'bg-yellow-50 border-yellow-400'
											: notification.type === 'info'
												? 'bg-blue-50 border-blue-400'
												: 'bg-green-50 border-green-400'
									}`}
								>
									<p className="text-sm">{notification.message}</p>
									<p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
