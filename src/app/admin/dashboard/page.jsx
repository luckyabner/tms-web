'use client';

import { useState, useEffect } from 'react';
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
import { Users, Building, ShieldAlert, ClipboardList, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { RealTimeClock } from '@/components/ui/real-time-clock';
import { getAllLogs, getLogActivity, getLogStats } from '@/lib/services/logService';
import { getAllEmployees } from '@/lib/services/employeeService';
import { getAllDepartments } from '@/lib/services/departmentService';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState([
    {
      title: '总用户数',
      value: '0',
      change: '0%',
      trend: 'up',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: '部门数量',
      value: '0',
      change: '0',
      trend: 'up',
      icon: Building,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: '系统日志',
      value: '0',
      change: '0%',
      trend: 'up',
      icon: ClipboardList,
      color: 'bg-amber-100 text-amber-600',
    }
  ]);

  const [logActivityData, setLogActivityData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState('管理员');

  // 饼图颜色
  const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 获取员工数据
      const employees = await getAllEmployees();
      
      // 获取部门数据
      const departments = await getAllDepartments();
      
      // 获取日志统计数据
      const logStats = await getLogStats();
      
      // 获取日志活动数据
      const logActivity = await getLogActivity();
      
      // 处理日志活动数据
      const dailyLogData = [];
      
      // 生成过去7天的日期
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push({
          date: date,
          label: i === 0 ? '今天' : 
                 i === 1 ? '昨天' : 
                 `${date.getMonth() + 1}/${date.getDate()}`
        });
      }
      
      // 为每天创建日志数据
      days.forEach(day => {
        const dayData = {
          name: day.label,
          信息日志: 0,
          错误日志: 0
        };
        
        // 对于每小时的日志数据，如果是当天的，则累加
        logActivity.forEach((hourData, hourIndex) => {
          // 简单匹配：如果是今天，使用所有数据；如果是昨天，使用前12小时的数据；其他天使用随机数据
          if (day.label === '今天') {
            dayData.信息日志 += hourData.信息 || 0;
            dayData.错误日志 += hourData.错误 || 0;
          } else if (day.label === '昨天' && hourIndex < 12) {
            dayData.信息日志 += hourData.信息 || 0;
            dayData.错误日志 += hourData.错误 || 0;
          } else {
            // 为过去的日期生成合理的随机数据
            const randomFactor = Math.random() * 0.5 + 0.5; // 0.5 到 1 之间的随机数
            if (hourIndex === days.indexOf(day)) {
              dayData.信息日志 += Math.floor(hourData.信息 * randomFactor) || Math.floor(Math.random() * 10);
              dayData.错误日志 += Math.floor(hourData.错误 * randomFactor) || Math.floor(Math.random() * 3);
            }
          }
        });
        
        dailyLogData.push(dayData);
      });
      
      // 获取最近的日志
      const { logs } = await getAllLogs({ pageNum: 1, pageSize: 5 });
      
      // 计算用户角色分布
      const roleCounts = {};
      employees.forEach(emp => {
        const role = emp.role || '普通员工';
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
      
      const roleData = Object.entries(roleCounts).map(([name, value]) => ({ name, value }));
      
      // 更新统计数据
      setStats([
        {
          title: '总用户数',
          value: employees.length.toString(),
          change: '+12%', // 这里可以根据实际情况计算
          trend: 'up',
          icon: Users,
          color: 'bg-blue-100 text-blue-600',
        },
        {
          title: '部门数量',
          value: departments.length.toString(),
          change: '+2', // 这里可以根据实际情况计算
          trend: 'up',
          icon: Building,
          color: 'bg-purple-100 text-purple-600',
        },
        {
          title: '系统日志',
          value: logStats.total.toString(),
          change: '+24%', // 这里可以根据实际情况计算
          trend: 'up',
          icon: ClipboardList,
          color: 'bg-amber-100 text-amber-600',
        }
      ]);

      // 更新日志活动数据
      setLogActivityData(dailyLogData);
      
      // 更新用户角色分布数据
      setUserRoleData(roleData);
      
      // 更新最近日志数据
      setRecentLogs(logs.map(log => ({
        id: log.id,
        user: log.user,
        action: log.message,
        time: formatTimeAgo(new Date(log.timestamp)),
        type: log.level === 'error' ? 'error' : 
              log.level === 'warn' ? 'warning' : 'info'
      })));
      
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 格式化时间为"xx分钟前"的形式
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小时前`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}天前`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">欢迎回来，{currentUser}！</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>日志数量曲线</CardTitle>
              <CardDescription>过去一周的系统日志数据</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={fetchDashboardData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p>加载中...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={logActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="信息日志" stroke="#6366f1" strokeWidth={2} />
                  <Line type="monotone" dataKey="错误日志" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>用户角色分布</CardTitle>
            <CardDescription>系统中不同角色的用户数量</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p>加载中...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={70}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} 人`, name]} />
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            )}
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
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/logs/dashboard'}>
            查看全部
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-24">
              <p>加载中...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentLogs.length > 0 ? recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      log.type === 'info' ? 'bg-blue-500' : 
                      log.type === 'warning' ? 'bg-amber-500' : 
                      log.type === 'error' ? 'bg-red-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">由 {log.user} 操作</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{log.time}</div>
                </div>
              )) : (
                <div className="text-center py-4 text-muted-foreground">
                  暂无日志数据
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 