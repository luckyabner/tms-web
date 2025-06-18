'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ClipboardList, AlertTriangle, CheckCircle, Info, AlertCircle, Download, RefreshCw, Filter } from 'lucide-react';

export default function LogsDashboardPage() {
  const [timeRange, setTimeRange] = useState('today');
  const [logType, setLogType] = useState('all');

  // 模拟日志统计数据
  const logStats = [
    {
      title: '总日志数',
      value: '24,892',
      icon: ClipboardList,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: '错误日志',
      value: '142',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: '警告日志',
      value: '583',
      icon: AlertCircle,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      title: '信息日志',
      value: '24,167',
      icon: Info,
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  // 模拟日志活动数据 - 按小时
  const hourlyLogData = [
    { time: '00:00', 信息: 120, 警告: 15, 错误: 5 },
    { time: '01:00', 信息: 90, 警告: 10, 错误: 3 },
    { time: '02:00', 信息: 75, 警告: 8, 错误: 2 },
    { time: '03:00', 信息: 60, 警告: 5, 错误: 1 },
    { time: '04:00', 信息: 65, 警告: 7, 错误: 2 },
    { time: '05:00', 信息: 70, 警告: 9, 错误: 3 },
    { time: '06:00', 信息: 100, 警告: 12, 错误: 4 },
    { time: '07:00', 信息: 150, 警告: 18, 错误: 6 },
    { time: '08:00', 信息: 280, 警告: 25, 错误: 8 },
    { time: '09:00', 信息: 350, 警告: 30, 错误: 10 },
    { time: '10:00', 信息: 380, 警告: 32, 错误: 12 },
    { time: '11:00', 信息: 400, 警告: 35, 错误: 15 },
    { time: '12:00', 信息: 390, 警告: 33, 错误: 14 },
    { time: '13:00', 信息: 410, 警告: 36, 错误: 16 },
    { time: '14:00', 信息: 430, 警告: 38, 错误: 18 },
    { time: '15:00', 信息: 450, 警告: 40, 错误: 20 },
    { time: '16:00', 信息: 420, 警告: 37, 错误: 17 },
    { time: '17:00', 信息: 380, 警告: 32, 错误: 13 },
    { time: '18:00', 信息: 300, 警告: 28, 错误: 10 },
    { time: '19:00', 信息: 250, 警告: 22, 错误: 8 },
    { time: '20:00', 信息: 200, 警告: 18, 错误: 6 },
    { time: '21:00', 信息: 180, 警告: 15, 错误: 5 },
    { time: '22:00', 信息: 150, 警告: 12, 错误: 4 },
    { time: '23:00', 信息: 130, 警告: 10, 错误: 3 },
  ];

  // 模拟日志来源数据
  const logSourceData = [
    { name: '用户操作', value: 45 },
    { name: '系统事件', value: 25 },
    { name: 'API调用', value: 20 },
    { name: '定时任务', value: 10 },
  ];

  // 模拟最近日志数据
  const recentLogs = [
    { 
      id: 1, 
      timestamp: '2023-09-15 15:45:23', 
      level: 'info', 
      message: '用户 admin 登录系统', 
      source: '认证服务',
      user: 'admin',
      ip: '192.168.1.100'
    },
    { 
      id: 2, 
      timestamp: '2023-09-15 15:42:18', 
      level: 'warning', 
      message: '用户尝试访问未授权资源', 
      source: '权限服务',
      user: 'zhangsan',
      ip: '192.168.1.101'
    },
    { 
      id: 3, 
      timestamp: '2023-09-15 15:40:05', 
      level: 'error', 
      message: '数据库连接超时', 
      source: '数据服务',
      user: 'system',
      ip: '192.168.1.5'
    },
    { 
      id: 4, 
      timestamp: '2023-09-15 15:38:57', 
      level: 'info', 
      message: '新员工账户创建成功', 
      source: '用户管理',
      user: 'admin',
      ip: '192.168.1.100'
    },
    { 
      id: 5, 
      timestamp: '2023-09-15 15:35:42', 
      level: 'info', 
      message: '系统备份完成', 
      source: '备份服务',
      user: 'system',
      ip: '192.168.1.5'
    },
    { 
      id: 6, 
      timestamp: '2023-09-15 15:32:19', 
      level: 'warning', 
      message: '服务器负载过高', 
      source: '监控服务',
      user: 'system',
      ip: '192.168.1.5'
    },
    { 
      id: 7, 
      timestamp: '2023-09-15 15:30:08', 
      level: 'error', 
      message: 'API请求失败: 500 Internal Server Error', 
      source: 'API网关',
      user: 'system',
      ip: '192.168.1.5'
    },
    { 
      id: 8, 
      timestamp: '2023-09-15 15:28:45', 
      level: 'info', 
      message: '用户 zhangsan 更新了个人资料', 
      source: '用户服务',
      user: 'zhangsan',
      ip: '192.168.1.101'
    },
  ];

  // 饼图颜色
  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#ec4899'];

  // 获取日志级别对应的样式
  const getLogLevelBadge = (level) => {
    switch(level) {
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">错误</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">警告</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">信息</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            系统日志看板
          </h1>
          <p className="text-muted-foreground">监控和分析系统日志信息</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出日志
          </Button>
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Filter className="h-4 w-4 mr-2" />
            高级筛选
          </Button>
        </div>
      </div>

      {/* 时间范围选择器 */}
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="选择时间范围" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">今天</SelectItem>
            <SelectItem value="yesterday">昨天</SelectItem>
            <SelectItem value="week">最近7天</SelectItem>
            <SelectItem value="month">最近30天</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {logStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">过去24小时</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>日志活动趋势</CardTitle>
            <CardDescription>24小时日志活动分布</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyLogData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="信息" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="警告" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="错误" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>日志来源分布</CardTitle>
            <CardDescription>系统日志来源分类</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={logSourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {logSourceData.map((entry, index) => (
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
            <CardTitle>最近日志记录</CardTitle>
            <CardDescription>系统最新日志事件</CardDescription>
          </div>
          <Select value={logType} onValueChange={setLogType} className="w-[120px]">
            <SelectTrigger>
              <SelectValue placeholder="日志类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="info">信息</SelectItem>
              <SelectItem value="warning">警告</SelectItem>
              <SelectItem value="error">错误</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>级别</TableHead>
                <TableHead>消息</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>IP地址</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs
                .filter(log => logType === 'all' || log.level === logType)
                .map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50">
                  <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{log.message}</TableCell>
                  <TableCell>{log.source}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4">
            <Button variant="outline">加载更多日志</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 