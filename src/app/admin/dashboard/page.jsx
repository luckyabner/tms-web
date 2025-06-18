'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Users, Building, ShieldAlert, ClipboardList, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RealTimeClock } from '@/components/ui/real-time-clock';

export default function AdminDashboardPage() {
  // 模拟统计数据
  const stats = [
    {
      title: '总用户数',
      value: '1,248',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: '部门数量',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Building,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: '系统日志',
      value: '3,842',
      change: '+24%',
      trend: 'up',
      icon: ClipboardList,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: '权限变更',
      value: '28',
      change: '-5%',
      trend: 'down',
      icon: ShieldAlert,
      color: 'bg-green-100 text-green-600',
    },
  ];

  // 模拟活动数据
  const activityData = [
    { name: '周一', 员工登录: 120, 系统操作: 80 },
    { name: '周二', 员工登录: 132, 系统操作: 70 },
    { name: '周三', 员工登录: 101, 系统操作: 130 },
    { name: '周四', 员工登录: 134, 系统操作: 90 },
    { name: '周五', 员工登录: 190, 系统操作: 85 },
    { name: '周六', 员工登录: 30, 系统操作: 20 },
    { name: '周日', 员工登录: 20, 系统操作: 15 },
  ];

  // 模拟用户角色分布数据
  const userRoleData = [
    { name: '系统管理员', value: 5 },
    { name: '人事专员', value: 15 },
    { name: '公司高层', value: 25 },
    { name: '普通员工', value: 150 },
  ];

  // 模拟最近日志数据
  const recentLogs = [
    { id: 1, user: '张三', action: '登录系统', time: '10分钟前', type: 'info' },
    { id: 2, user: '系统管理员', action: '修改了用户权限', time: '30分钟前', type: 'warning' },
    { id: 3, user: '李四', action: '上传了新文档', time: '1小时前', type: 'info' },
    { id: 4, user: '王五', action: '创建了新部门', time: '2小时前', type: 'success' },
    { id: 5, user: '系统', action: '自动备份完成', time: '4小时前', type: 'info' },
  ];

  // 饼图颜色
  const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899'];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">欢迎回来，张无忌！</h1>
            <p className="text-purple-100">今天是 {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}</p>
          </div>
          <RealTimeClock />
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs mt-1">
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                </span>
                <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground">较上月</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>系统活动趋势</CardTitle>
            <CardDescription>过去一周的系统活动数据</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="员工登录" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="系统操作" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>用户角色分布</CardTitle>
            <CardDescription>系统中不同角色的用户数量</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 最近日志 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>最近系统日志</CardTitle>
            <CardDescription>系统中最近的活动记录</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            查看全部
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    log.type === 'info' ? 'bg-blue-500' : 
                    log.type === 'warning' ? 'bg-amber-500' : 
                    log.type === 'success' ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">由 {log.user} 操作</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{log.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 