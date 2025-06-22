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
import { ClipboardList, AlertTriangle, CheckCircle, Info, AlertCircle, Download, RefreshCw, Filter, Loader2, ChevronLeft, ChevronRight, Trash2, AlertOctagon, Calendar } from 'lucide-react';
import { getAllLogs, exportLogs, deleteLog, clearAllLogs, getDateRangeFromTimeRange } from '@/lib/services/logService';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LogsDashboardPage() {
  const [timeRange, setTimeRange] = useState('today');
  const [logType, setLogType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // 分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

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
  const fetchAllLogData = async (forceRefresh = false) => {
    // 如果已经在加载中，则不重复请求
    if (loading) return;
    
    try {
      setLoading(true);
      setDebugInfo(null);
      
      // 获取日期范围
      const dateRange = getDateRangeFromTimeRange(timeRange);
      console.log('日期范围:', dateRange);
      
      // 基础请求参数
      const baseParams = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        useCache: !forceRefresh // 强制刷新时不使用缓存
      };
      
      // 首先获取当前页面的日志列表
      try {
        console.log('正在获取日志列表...');
        const listParams = {
          ...baseParams,
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
          level: logType !== 'all' ? logType : null,
        };
        console.log('请求参数:', listParams);
        
        const logsResponse = await getAllLogs(listParams);
        console.log('获取到的日志列表:', logsResponse);
        
        if (logsResponse && logsResponse.logs) {
          setLogs(logsResponse.logs || []);
          setPagination(logsResponse.pagination || pagination);
          
          // 准备获取各类型日志的数量
          let errorCount = 0;
          let warnCount = 0;
          let infoCount = 0;
          let totalCount = logsResponse.pagination.total;
          
          // 根据筛选条件决定如何获取各类型日志数量
          if (logType !== 'all') {
            // 如果已经筛选了特定类型，则该类型的数量就是总数
            if (logType === 'error') {
              errorCount = totalCount;
            } else if (logType === 'warn') {
              warnCount = totalCount;
            } else if (logType === 'info') {
              infoCount = totalCount;
            }
          } else {
            // 全部日志情况下，分别请求各类型的数量
            console.log('获取各类型日志数量...');
            
            try {
              // 获取错误日志数量
              const errorParams = { ...baseParams, level: 'error', pageNum: 1, pageSize: 1 };
              const errorResponse = await getAllLogs(errorParams);
              errorCount = errorResponse?.pagination?.total || 0;
              console.log('错误日志数量:', errorCount);
              
              // 获取警告日志数量
              const warnParams = { ...baseParams, level: 'warn', pageNum: 1, pageSize: 1 };
              const warnResponse = await getAllLogs(warnParams);
              warnCount = warnResponse?.pagination?.total || 0;
              console.log('警告日志数量:', warnCount);
              
              // 获取信息日志数量
              const infoParams = { ...baseParams, level: 'info', pageNum: 1, pageSize: 1 };
              const infoResponse = await getAllLogs(infoParams);
              infoCount = infoResponse?.pagination?.total || 0;
              console.log('信息日志数量:', infoCount);
            } catch (err) {
              console.error('获取日志类型统计失败:', err);
              // 如果获取失败，使用当前页面的数据进行估算
              const logs = logsResponse.logs;
              const pageErrorCount = logs.filter(log => log.level?.toLowerCase() === 'error').length;
              const pageWarnCount = logs.filter(log => log.level?.toLowerCase() === 'warn' || log.level?.toLowerCase() === 'warning').length;
              const pageInfoCount = logs.filter(log => log.level?.toLowerCase() === 'info').length;
              
              // 计算比例
              const totalSample = logs.length || 1;
              errorCount = Math.round(totalCount * (pageErrorCount / totalSample));
              warnCount = Math.round(totalCount * (pageWarnCount / totalSample));
              infoCount = Math.round(totalCount * (pageInfoCount / totalSample));
            }
          }
          
          console.log('最终日志统计:', { 
            error: errorCount, 
            warn: warnCount, 
            info: infoCount, 
            total: totalCount 
          });
          
          // 设置统计卡片数据
          setLogStats([
            {
              title: '总日志数',
              value: totalCount.toString(),
              icon: ClipboardList,
              color: 'bg-purple-100 text-purple-600',
            },
            {
              title: '错误日志',
              value: errorCount.toString(),
              icon: AlertTriangle,
              color: 'bg-red-100 text-red-600',
            },
            {
              title: '警告日志',
              value: warnCount.toString(),
              icon: AlertCircle,
              color: 'bg-amber-100 text-amber-600',
            },
            {
              title: '信息日志',
              value: infoCount.toString(),
              icon: Info,
              color: 'bg-blue-100 text-blue-600',
            },
          ]);
          
          // 计算小时活动数据 - 仅显示有数据的小时，避免图表过于分散
          const hourlyData = [];
          
          // 我们不再使用最小值，而是让图表显示真实数据
          
          // 获取今天的日期范围
          const today = new Date();
          const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
          
          // 创建小时分布数据
          const hourDistribution = {};
          for (let i = 0; i < 24; i++) {
            hourDistribution[i] = {
              error: 0,
              warn: 0,
              info: 0
            };
          }
          
          // 分析当前页面日志的小时分布
          logsResponse.logs.forEach(log => {
            try {
              const date = new Date(log.timestamp);
              if (date >= startOfDay && date <= endOfDay) {
                const hour = date.getHours();
                if (hour >= 0 && hour < 24) {
                  const level = log.level?.toLowerCase();
                  if (level === 'error') {
                    hourDistribution[hour].error++;
                  } else if (level === 'warn' || level === 'warning') {
                    hourDistribution[hour].warn++;
                  } else if (level === 'info') {
                    hourDistribution[hour].info++;
                  }
                }
              }
            } catch (err) {
              console.error('处理日志时间失败:', err, log.timestamp);
            }
          });
          
          // 计算每种类型日志在每小时的分布比例
          const totalErrorsInSample = Object.values(hourDistribution).reduce((sum, hour) => sum + hour.error, 0) || 1;
          const totalWarnsInSample = Object.values(hourDistribution).reduce((sum, hour) => sum + hour.warn, 0) || 1;
          const totalInfosInSample = Object.values(hourDistribution).reduce((sum, hour) => sum + hour.info, 0) || 1;
          
          // 新版本：直接从hourDistribution中提取数据
          // 首先获取所有有日志的小时
          const activeHours = [];
          for (let hour = 0; hour < 24; hour++) {
            const hasLogs = hourDistribution[hour].error > 0 || 
                           hourDistribution[hour].warn > 0 || 
                           hourDistribution[hour].info > 0;
            if (hasLogs) {
              activeHours.push(hour);
            }
          }
          
          // 如果没有活跃小时，至少添加一些时间点以便显示
          if (activeHours.length === 0) {
            activeHours.push(9, 12, 15, 18);
          }
          
          // 为每个活跃小时创建数据点
          activeHours.forEach(hour => {
            let hourErrorCount = 0;
            let hourWarnCount = 0;
            let hourInfoCount = 0;
            
            // 根据日志类型计算每小时的数量
            if (logType === 'all' || logType === 'error') {
              hourErrorCount = Math.round(errorCount * (hourDistribution[hour].error / totalErrorsInSample));
            }
            
            if (logType === 'all' || logType === 'warn') {
              hourWarnCount = Math.round(warnCount * (hourDistribution[hour].warn / totalWarnsInSample));
            }
            
            if (logType === 'all' || logType === 'info') {
              hourInfoCount = Math.round(infoCount * (hourDistribution[hour].info / totalInfosInSample));
            }
            
            // 添加数据点
            hourlyData.push({
              time: `${hour.toString().padStart(2, '0')}:00`,
              错误: hourErrorCount,
              警告: hourWarnCount,
              信息: hourInfoCount
            });
            
            // 调试输出
            console.log(`小时${hour}数据:`, {
              错误: hourErrorCount,
              警告: hourWarnCount,
              信息: hourInfoCount
            });
          });
          
          // 按时间排序
          hourlyData.sort((a, b) => {
            return parseInt(a.time) - parseInt(b.time);
          });
          
          // 调试输出
          console.log('生成的小时数据:', hourlyData);
          
          setHourlyLogData(hourlyData);
          
          // 计算用户活跃度数据
          const userCounts = {};
          
          // 使用后端API获取的总日志数据来计算各用户的日志数量
          // 先尝试从当前页面的日志样本中获取用户比例
          logsResponse.logs.forEach(log => {
            const user = log.user || '未知用户';
            if (!userCounts[user]) {
              userCounts[user] = 0;
            }
            userCounts[user]++;
          });
          
          // 计算每个用户在样本中的比例
          const totalSampleLogs = Object.values(userCounts).reduce((sum, count) => sum + count, 0) || 1;
          const userRatios = {};
          Object.entries(userCounts).forEach(([user, count]) => {
            userRatios[user] = count / totalSampleLogs;
          });
          
          // 按照这个比例分配总日志数
          const totalLogsCount = logsResponse.pagination.total;
          const adjustedUserCounts = {};
          Object.entries(userRatios).forEach(([user, ratio]) => {
            adjustedUserCounts[user] = Math.round(totalLogsCount * ratio);
          });
          
          // 按活跃度排序
          const sortedUsers = Object.entries(adjustedUserCounts)
            .sort(([, countA], [, countB]) => countB - countA)
            .map(([user, count]) => ({
              name: `用户: ${user}`,
              value: count
            }));
          
          // 如果数据太多，只保留前8个用户，其余归为"其他用户"
          let sourceData = sortedUsers;
          if (sourceData.length > 8) {
            const topUsers = sourceData.slice(0, 8);
            const otherUsers = sourceData.slice(8);
            const otherUsersTotal = otherUsers.reduce((sum, item) => sum + item.value, 0);
            
            sourceData = [
              ...topUsers,
              { name: '用户: 其他用户', value: otherUsersTotal }
            ];
          }
          
          if (sourceData.length === 0) {
            sourceData.push({ name: '暂无数据', value: 1 });
          }
          
          setLogSourceData(sourceData);
        } else {
          console.log('没有获取到日志数据');
          setDebugInfo(prev => ({ ...prev, logsInfo: '没有获取到日志数据' }));
          setLogs([]);
          
          // 清空统计数据
          setLogStats([
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
              title: '警告日志',
              value: '0',
              icon: AlertCircle,
              color: 'bg-amber-100 text-amber-600',
            },
            {
              title: '信息日志',
              value: '0',
              icon: Info,
              color: 'bg-blue-100 text-blue-600',
            },
          ]);
          
          // 清空图表数据
          setHourlyLogData([]);
          setLogSourceData([]);
        }
      } catch (err) {
        console.error('获取日志列表失败:', err);
        setDebugInfo(prev => ({ ...prev, logsError: err.message || '获取日志列表失败' }));
      }
      
      setError(null);
      setDataLoaded(true);
    } catch (err) {
      console.error('获取日志数据失败:', err);
      setError('获取日志数据失败，请稍后重试');
      setDebugInfo(prev => ({ ...prev, mainError: err.message || '获取日志数据失败' }));
    } finally {
      setLoading(false);
    }
  };

  // 页面初始化时加载数据
  useEffect(() => {
    // 初始加载时禁用缓存
    fetchAllLogData(true);
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 当分页参数或筛选条件变化时重新加载数据
  useEffect(() => {
    // 跳过初始渲染时的加载，避免重复请求
    if (dataLoaded) {
      fetchAllLogData(true); // 强制刷新，确保数据更新
    }
  }, [pagination.current, logType, timeRange]);

  // 处理刷新
  const handleRefresh = () => {
    // 刷新时禁用缓存
    fetchAllLogData(true);
  };

  // 处理导出
  const handleExport = async () => {
    try {
      const dateRange = getDateRangeFromTimeRange(timeRange);
      const blob = await exportLogs({ 
        level: logType !== 'all' ? logType : null,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
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

  // 处理分页变化
  const handlePageChange = (page) => {
    setPagination(prev => ({
      ...prev,
      current: page
    }));
  };

  // 处理日志类型筛选变化
  const handleLogTypeChange = (value) => {
    setLogType(value);
    setPagination(prev => ({
      ...prev,
      current: 1 // 切换筛选条件时重置到第一页
    }));
    // 数据会通过useEffect自动刷新
  };

  // 处理时间范围筛选变化
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
    setPagination(prev => ({
      ...prev,
      current: 1 // 切换筛选条件时重置到第一页
    }));
    // 数据会通过useEffect自动刷新
  };

  // 处理删除单个日志
  const handleDeleteLog = async () => {
    if (!selectedLogId) return;
    
    try {
      setActionLoading(true);
      const success = await deleteLog(selectedLogId);
      
      if (success) {
        // 关闭对话框
        setDeleteConfirmOpen(false);
        // 重新加载数据
        fetchAllLogData();
      } else {
        setError('删除日志失败，请稍后重试');
      }
    } catch (err) {
      console.error('删除日志失败:', err);
      setError('删除日志失败，请稍后重试');
    } finally {
      setActionLoading(false);
    }
  };

  // 处理清空所有日志
  const handleClearAllLogs = async () => {
    try {
      setActionLoading(true);
      const success = await clearAllLogs();
      
      if (success) {
        // 关闭对话框
        setClearConfirmOpen(false);
        // 重新加载数据
        fetchAllLogData();
      } else {
        setError('清空日志失败，请稍后重试');
      }
    } catch (err) {
      console.error('清空日志失败:', err);
      setError('清空日志失败，请稍后重试');
    } finally {
      setActionLoading(false);
    }
  };

  // 获取时间范围显示文本
  const getTimeRangeText = () => {
    switch(timeRange) {
      case 'today': return '今天';
      case 'yesterday': return '昨天';
      case 'week': return '最近7天';
      case 'month': return '最近30天';
      default: return '全部时间';
    }
  };

  // 饼图颜色
  const COLORS = ['#8b5cf6', '#6366f1', '#3b82f6', '#ec4899'];

  // 获取日志级别对应的样式
  const getLogLevelBadge = (level) => {
    switch(level?.toLowerCase()) {
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">错误</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">信息</Badge>;
      case 'warn':
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">警告</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">未知</Badge>;
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
          <Dialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={loading || !hasData}>
                <Trash2 className="h-4 w-4 mr-2" />
                清空日志
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>确认清空所有日志</DialogTitle>
                <DialogDescription>
                  此操作将删除所有系统日志记录，且无法恢复。确定要继续吗？
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setClearConfirmOpen(false)} disabled={actionLoading}>
                  取消
                </Button>
                <Button variant="destructive" onClick={handleClearAllLogs} disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <AlertOctagon className="h-4 w-4 mr-2" />}
                  确认清空
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 筛选条件区域 */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">日志类型</label>
              <Select value={logType} onValueChange={handleLogTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="日志类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部日志</SelectItem>
                  <SelectItem value="info">信息日志</SelectItem>
                  <SelectItem value="error">错误日志</SelectItem>
                  <SelectItem value="warn">警告日志</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">时间范围</label>
              <Select value={timeRange} onValueChange={handleTimeRangeChange}>
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
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>当前显示: {getTimeRangeText()}</span>
            </div>
          </div>
        </div>
      </Card>

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
                当前筛选条件下没有日志记录。您可以尝试更改筛选条件或时间范围。
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4">
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
              <p className="text-xs text-muted-foreground mt-1">{getTimeRangeText()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 日志活动图表 - 简化版 */}
        <Card>
          <CardHeader>
            <CardTitle>日志活动</CardTitle>
            <CardDescription>系统日志分布 ({getTimeRangeText()})</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { 
                      name: '信息日志', 
                      数量: parseInt(logStats[3]?.value || 0),
                      color: '#3b82f6'
                    },
                    { 
                      name: '警告日志', 
                      数量: parseInt(logStats[2]?.value || 0),
                      color: '#f59e0b'
                    },
                    { 
                      name: '错误日志', 
                      数量: parseInt(logStats[1]?.value || 0),
                      color: '#ef4444'
                    }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value} 条日志`]}
                  />
                  <Legend />
                  <Bar 
                    dataKey="数量" 
                    fill="#8884d8"
                    isAnimationActive={true}
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={`${index === 0 ? '#3b82f6' : index === 1 ? '#f59e0b' : '#ef4444'}`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* 用户活跃度图表 */}
        <Card>
          <CardHeader>
            <CardTitle>用户活跃度</CardTitle>
            <CardDescription>按用户统计的日志分布 ({getTimeRangeText()})</CardDescription>
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
                    data={logSourceData.filter(item => item.name.startsWith('用户:'))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name.replace('用户: ', '')}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {logSourceData.filter(item => item.name.startsWith('用户:')).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => {
                      // 返回实际日志数量和用户名
                      return [`${value} 条日志`, name.replace('用户: ', '')];
                    }} 
                  />
                  <Legend formatter={(value) => value.replace('用户: ', '')} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                暂无用户活跃度数据
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 最近日志表格 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>日志记录</CardTitle>
            <CardDescription>系统日志活动记录 ({getTimeRangeText()})</CardDescription>
          </div>
          <div className="text-sm text-muted-foreground">
            总计: {pagination.total} 条记录
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
                          <div className="h-[200px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
          ) : (
            <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>级别</TableHead>
                <TableHead className="w-[40%]">消息</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>IP地址</TableHead>
                <TableHead className="w-[80px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                        <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                        <TableCell className="max-w-[300px] truncate">{log.message}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                        <TableCell>
                          <Dialog open={deleteConfirmOpen && selectedLogId === log.id} onOpenChange={(open) => {
                            setDeleteConfirmOpen(open);
                            if (!open) setSelectedLogId(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setSelectedLogId(log.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>确认删除日志</DialogTitle>
                                <DialogDescription>
                                  您确定要删除这条日志记录吗？此操作无法撤销。
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={actionLoading}>
                                  取消
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteLog} disabled={actionLoading}>
                                  {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                  确认删除
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
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
              
              {/* 分页控件 */}
              {pagination.total > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <PaginationInfo 
                    currentPage={pagination.current}
                    pageSize={pagination.pageSize}
                    totalItems={pagination.total}
                  />
                  <Pagination
                    currentPage={pagination.current}
                    totalPages={Math.ceil(pagination.total / pagination.pageSize)}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 