'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Calendar, Filter, Download, RefreshCw, X, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { getAllLogs } from '@/lib/services/logService';

export default function LogsSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLevels, setSelectedLevels] = useState(['info', 'warn', 'error']);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState('50');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  
  // 日志数据状态
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取日志数据
  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      // 构建API请求参数
      const params = {
        pageNum: page,
        pageSize: parseInt(resultsPerPage),
        startDate: dateRange.start || null,
        endDate: dateRange.end || null
      };
      
      // 如果只选择了一种日志级别，则添加筛选条件
      if (selectedLevels.length === 1) {
        params.level = selectedLevels[0];
      }
      
      const response = await getAllLogs(params);
      setLogs(response.logs);
      setPagination(response.pagination);
    } catch (error) {
      console.error('获取日志数据失败:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和筛选条件变化时获取数据
  useEffect(() => {
    fetchLogs(1);
  }, [resultsPerPage, selectedLevels, dateRange.start, dateRange.end]);

  // 处理日志级别选择
  const handleLevelChange = (level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter(l => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  // 清除所有筛选条件
  const clearFilters = () => {
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
    setSelectedLevels(['info', 'warn', 'error']);
  };

  // 获取日志级别对应的样式
  const getLogLevelBadge = (level) => {
    switch(level) {
      case 'error':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">错误</Badge>;
      case 'warn':
      case 'warning':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">警告</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">信息</Badge>;
      default:
        return <Badge variant="outline">未知</Badge>;
    }
  };

  // 过滤日志数据
  const filteredLogs = logs.filter(log => {
    // 根据搜索词过滤
    const matchesSearch = searchQuery === '' || 
      log.message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // 根据排序顺序排序
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else {
      return new Date(a.timestamp) - new Date(b.timestamp);
    }
  });

  // 处理分页
  const handlePageChange = (page) => {
    fetchLogs(page);
  };

  // 处理刷新
  const handleRefresh = () => {
    fetchLogs(pagination.current);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            日志查询
          </h1>
          <p className="text-muted-foreground">搜索和筛选系统日志记录</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出结果
          </Button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <Card>
        <CardHeader>
          <CardTitle>日志搜索</CardTitle>
          <CardDescription>输入关键词或使用筛选条件查找特定日志</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 主搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索日志消息..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 快速筛选条件 */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Label>日志级别:</Label>
              <div className="flex space-x-1">
                <Button 
                  variant={selectedLevels.includes('info') ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleLevelChange('info')}
                  className={selectedLevels.includes('info') ? "bg-blue-600" : ""}
                >
                  信息
                </Button>
                <Button 
                  variant={selectedLevels.includes('warn') ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleLevelChange('warn')}
                  className={selectedLevels.includes('warn') ? "bg-amber-600" : ""}
                >
                  警告
                </Button>
                <Button 
                  variant={selectedLevels.includes('error') ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleLevelChange('error')}
                  className={selectedLevels.includes('error') ? "bg-red-600" : ""}
                >
                  错误
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <Label>时间范围:</Label>
              <div className="flex space-x-2">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="date"
                    placeholder="开始日期"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="pl-10 w-40"
                  />
                </div>
                <span className="text-muted-foreground">至</span>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="date"
                    placeholder="结束日期"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="pl-10 w-40"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 高级筛选切换 */}
          <div>
            <Button 
              variant="ghost" 
              className="text-sm"
              onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
            >
              {isAdvancedFilterOpen ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  隐藏高级筛选
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  显示高级筛选
                </>
              )}
            </Button>
          </div>

          {/* 高级筛选选项 */}
          {isAdvancedFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* 其他选项 */}
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">每页结果数</Label>
                  <Select value={resultsPerPage} onValueChange={setResultsPerPage}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择每页显示数量" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10条/页</SelectItem>
                      <SelectItem value="25">25条/页</SelectItem>
                      <SelectItem value="50">50条/页</SelectItem>
                      <SelectItem value="100">100条/页</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">排序方式</Label>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择排序方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">最新优先</SelectItem>
                      <SelectItem value="asc">最早优先</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            清除筛选
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={() => fetchLogs(1)}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            搜索日志
          </Button>
        </CardFooter>
      </Card>

      {/* 搜索结果 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>搜索结果</CardTitle>
            <CardDescription>找到 {pagination.total} 条匹配的日志记录</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>级别</TableHead>
                <TableHead>消息</TableHead>
                <TableHead>用户</TableHead>
                <TableHead>IP地址</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">加载中...</p>
                  </TableCell>
                </TableRow>
              ) : sortedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">没有找到匹配的日志记录</p>
                  </TableCell>
                </TableRow>
              ) : (
                sortedLogs.map((log) => (
                  <TableRow key={log.id} className="group cursor-pointer hover:bg-gray-50">
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate">{log.message}</div>
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span>{log.ip}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={() => navigator.clipboard.writeText(log.ip)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* 分页 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              显示 {pagination.total > 0 ? (pagination.current - 1) * pagination.pageSize + 1 : 0} - 
              {Math.min(pagination.current * pagination.pageSize, pagination.total)} 条，
              共 {pagination.total} 条
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.current <= 1 || loading}
                onClick={() => handlePageChange(pagination.current - 1)}
              >
                上一页
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-purple-50"
              >
                {pagination.current}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.current * pagination.pageSize >= pagination.total || loading}
                onClick={() => handlePageChange(pagination.current + 1)}
              >
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 