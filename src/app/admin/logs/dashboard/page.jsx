'use client';

import { useState, useEffect } from 'react';
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
import { ClipboardList, AlertTriangle, CheckCircle, Info, AlertCircle, Download, RefreshCw, Filter, Loader2 } from 'lucide-react';
import { getAllLogs, getLogStats, getLogActivity, getLogSources, exportLogs } from '@/lib/services/logService';

export default function LogsDashboardPage() {
  const [timeRange, setTimeRange] = useState('today');
  const [logType, setLogType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);

  // 日志数据状态
  const [logs, setLogs] = useState([]);
  const [logStats, setLogStats] = useState([
    {
      title: '总日志数',
      value: '0',
      icon: ClipboardList,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: '错误日志',
      value: '0',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: '信息日志',
      value: '0',
      icon: Info,
      color: 'bg-blue-100 text-blue-600',
    },
  ]);
  const [hourlyLogData, setHourlyLogData] = useState([]);
  const [logSourceData, setLogSourceData] = useState([]);

  // 加载所有日志数据
  const fetchAllLogData = async () => {
    try {
      setLoading(true);
      setDebugInfo(null);
      
      // 获取日志列表
      try {
        console.log('正在获取日志列表...');
        const logsData = await getAllLogs();
        console.log('获取到的日志列表:', logsData);
        setLogs(logsData || []);
        
        if (!logsData || logsData.length === 0) {
          console.log('没有获取到日志数据');
          setDebugInfo(prev => ({ ...prev, logsInfo: '没有获取到日志数据' }));
        }
      } catch (err) {
        console.error('获取日志列表失败:', err);
        setDebugInfo(prev => ({ ...prev, logsError: err.message || '获取日志列表失败' }));
      }
      
      // 获取日志统计
      try {
        console.log('正在获取日志统计...');
        const statsData = await getLogStats();
        console.log('获取到的日志统计:', statsData);
        
        if (statsData) {
          setLogStats([
            {
              title: '总日志数',
              value: statsData.total.toString(),
              icon: ClipboardList,
              color: 'bg-purple-100 text-purple-600',
            },
            {
              title: '错误日志',
              value: statsData.error.toString(),
              icon: AlertTriangle,
              color: 'bg-red-100 text-red-600',
            },
            {
              title: '信息日志',
              value: statsData.info.toString(),
              icon: Info,
              color: 'bg-blue-100 text-blue-600',
            },
          ]);
        }
      } catch (err) {
        console.error('获取日志统计失败:', err);
        setDebugInfo(prev => ({ ...prev, statsError: err.message || '获取日志统计失败' }));
      }
      
      // 获取小时活动数据
      try {
        console.log('正在获取日志活动数据...');
        const activityData = await getLogActivity();
        console.log('获取到的日志活动数据:', activityData);
        setHourlyLogData(activityData || []);
      } catch (err) {
        console.error('获取日志活动数据失败:', err);
        setDebugInfo(prev => ({ ...prev, activityError: err.message || '获取日志活动数据失败' }));
      }
      
      // 获取来源数据
      try {
        console.log('正在获取日志来源数据...');
        const sourcesData = await getLogSources();
        console.log('获取到的日志来源数据:', sourcesData);
        setLogSourceData(sourcesData || []);
      } catch (err) {
        console.error('获取日志来源数据失败:', err);
        setDebugInfo(prev => ({ ...prev, sourcesError: err.message || '获取日志来源数据失败' }));
      }
      
      setError(null);
    } catch (err) {
      console.error('获取日志数据失败:', err);
      setError('获取日志数据失败，请稍后重试');
      setDebugInfo(prev => ({ ...prev, mainError: err.message || '获取日志数据失败' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllLogData();
  }, []);

  // 处理刷新
  const handleRefresh = () => {
    fetchAllLogData();
  };

  // 处理导出
  const handleExport = async () => {
    try {
      const blob = await exportLogs({ timeRange });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `系统日志_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('导出日志失败:', err);
      alert('导出日志失败，请稍后重试');
    }
  };

  // 饼图颜色
  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#ec4899'];

  // 获取日志级别对应的样式
  const getLogLevelBadge = (level) => {
    switch(level) {
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">错误</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">信息</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  // 检查是否有数据
  const hasData = logs && logs.length > 0;

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
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            刷新
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={loading}>
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

      {/* 错误信息显示 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-700">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 调试信息 */}
      {debugInfo && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-700">调试信息</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto max-h-[200px]">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* 无数据提示 */}
      {!loading && !hasData && !error && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Info className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-medium text-blue-700 mb-2">暂无日志数据</h3>
              <p className="text-blue-600 text-center max-w-md">
                系统中还没有日志记录。当用户进行操作或系统事件发生时，日志将会在这里显示。
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {logStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '加载中...' : stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">过去24小时</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 日志活动图表 */}
        <Card>
          <CardHeader>
            <CardTitle>日志活动</CardTitle>
            <CardDescription>按小时统计的日志数量</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : hourlyLogData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={hourlyLogData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="信息" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="错误" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                暂无日志活动数据
              </div>
            )}
          </CardContent>
        </Card>

        {/* 日志来源图表 */}
        <Card>
          <CardHeader>
            <CardTitle>日志来源</CardTitle>
            <CardDescription>按来源统计的日志分布</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : logSourceData.length > 0 ? (
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
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                暂无日志来源数据
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 最近日志表格 */}
      <Card>
        <CardHeader>
          <CardTitle>最近日志记录</CardTitle>
          <CardDescription>系统最近的日志活动</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>级别</TableHead>
                  <TableHead className="w-[40%]">消息</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>用户</TableHead>
                  <TableHead>IP地址</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.slice(0, 10).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                      <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{log.message}</TableCell>
                      <TableCell>{log.source}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      {error ? '加载日志数据失败' : '暂无日志数据'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 