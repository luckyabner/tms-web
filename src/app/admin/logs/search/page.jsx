'use client';

import { useState } from 'react';
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

export default function LogsSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedLevels, setSelectedLevels] = useState(['info', 'warning', 'error']);
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState('50');
  const [sortOrder, setSortOrder] = useState('desc');

  // 模拟日志数据
  const logData = [
    { 
      id: 1, 
      timestamp: '2023-09-15 15:45:23', 
      level: 'info', 
      message: '用户 admin 登录系统', 
      source: '认证服务',
      user: 'admin',
      ip: '192.168.1.100',
      details: '登录IP来自办公网络，使用Chrome浏览器'
    },
    { 
      id: 2, 
      timestamp: '2023-09-15 15:42:18', 
      level: 'warning', 
      message: '用户尝试访问未授权资源', 
      source: '权限服务',
      user: 'zhangsan',
      ip: '192.168.1.101',
      details: '尝试访问/admin/settings页面，权限不足'
    },
    { 
      id: 3, 
      timestamp: '2023-09-15 15:40:05', 
      level: 'error', 
      message: '数据库连接超时', 
      source: '数据服务',
      user: 'system',
      ip: '192.168.1.5',
      details: '连接到主数据库失败，尝试重连3次后失败'
    },
    { 
      id: 4, 
      timestamp: '2023-09-15 15:38:57', 
      level: 'info', 
      message: '新员工账户创建成功', 
      source: '用户管理',
      user: 'admin',
      ip: '192.168.1.100',
      details: '创建了新用户"lisi"，角色设置为"普通员工"'
    },
    { 
      id: 5, 
      timestamp: '2023-09-15 15:35:42', 
      level: 'info', 
      message: '系统备份完成', 
      source: '备份服务',
      user: 'system',
      ip: '192.168.1.5',
      details: '数据库完全备份成功，备份大小为2.3GB'
    },
    { 
      id: 6, 
      timestamp: '2023-09-15 15:32:19', 
      level: 'warning', 
      message: '服务器负载过高', 
      source: '监控服务',
      user: 'system',
      ip: '192.168.1.5',
      details: 'CPU使用率达到85%，内存使用率达到78%'
    },
    { 
      id: 7, 
      timestamp: '2023-09-15 15:30:08', 
      level: 'error', 
      message: 'API请求失败: 500 Internal Server Error', 
      source: 'API网关',
      user: 'system',
      ip: '192.168.1.5',
      details: '调用外部支付服务API失败，超时时间设置为30秒'
    },
    { 
      id: 8, 
      timestamp: '2023-09-15 15:28:45', 
      level: 'info', 
      message: '用户 zhangsan 更新了个人资料', 
      source: '用户服务',
      user: 'zhangsan',
      ip: '192.168.1.101',
      details: '更新了电话号码和邮箱地址'
    },
    { 
      id: 9, 
      timestamp: '2023-09-15 15:25:33', 
      level: 'info', 
      message: '定时任务执行成功', 
      source: '调度服务',
      user: 'system',
      ip: '192.168.1.5',
      details: '数据清理任务执行完毕，清理了30天前的临时数据'
    },
    { 
      id: 10, 
      timestamp: '2023-09-15 15:20:17', 
      level: 'warning', 
      message: '多次登录失败', 
      source: '认证服务',
      user: 'wangwu',
      ip: '192.168.1.102',
      details: '用户连续3次登录失败，可能需要重置密码'
    },
  ];

  // 可用的日志来源
  const availableSources = ['认证服务', '权限服务', '数据服务', '用户管理', '备份服务', '监控服务', 'API网关', '调度服务'];
  
  // 可用的用户
  const availableUsers = ['admin', 'zhangsan', 'lisi', 'wangwu', 'system'];

  // 处理日志级别选择
  const handleLevelChange = (level) => {
    if (selectedLevels.includes(level)) {
      setSelectedLevels(selectedLevels.filter(l => l !== level));
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  // 处理来源选择
  const handleSourceChange = (source) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  // 处理用户选择
  const handleUserChange = (user) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter(u => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  // 清除所有筛选条件
  const clearFilters = () => {
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
    setSelectedLevels(['info', 'warning', 'error']);
    setSelectedSources([]);
    setSelectedUsers([]);
  };

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

  // 过滤日志数据
  const filteredLogs = logData.filter(log => {
    // 根据搜索词过滤
    const matchesSearch = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 根据日志级别过滤
    const matchesLevel = selectedLevels.includes(log.level);
    
    // 根据来源过滤
    const matchesSource = selectedSources.length === 0 || selectedSources.includes(log.source);
    
    // 根据用户过滤
    const matchesUser = selectedUsers.length === 0 || selectedUsers.includes(log.user);
    
    // 根据日期范围过滤 (简化版，实际应用中应该使用日期比较)
    const matchesDateRange = true; // 简化处理，实际应用中需要比较日期
    
    return matchesSearch && matchesLevel && matchesSource && matchesUser && matchesDateRange;
  });

  // 根据排序顺序排序
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (sortOrder === 'desc') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else {
      return new Date(a.timestamp) - new Date(b.timestamp);
    }
  });

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
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
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
              placeholder="搜索日志消息或详情..."
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
                  variant={selectedLevels.includes('warning') ? "default" : "outline"} 
                  size="sm"
                  onClick={() => handleLevelChange('warning')}
                  className={selectedLevels.includes('warning') ? "bg-amber-600" : ""}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* 日志来源选择 */}
              <div>
                <Label className="mb-2 block">日志来源</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {availableSources.map(source => (
                    <div key={source} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`source-${source}`} 
                        checked={selectedSources.includes(source)}
                        onCheckedChange={() => handleSourceChange(source)}
                      />
                      <Label htmlFor={`source-${source}`} className="text-sm">{source}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 用户选择 */}
              <div>
                <Label className="mb-2 block">用户</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                  {availableUsers.map(user => (
                    <div key={user} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`user-${user}`} 
                        checked={selectedUsers.includes(user)}
                        onCheckedChange={() => handleUserChange(user)}
                      />
                      <Label htmlFor={`user-${user}`} className="text-sm">{user}</Label>
                    </div>
                  ))}
                </div>
              </div>

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
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Search className="h-4 w-4 mr-2" />
            搜索日志
          </Button>
        </CardFooter>
      </Card>

      {/* 搜索结果 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>搜索结果</CardTitle>
            <CardDescription>找到 {filteredLogs.length} 条匹配的日志记录</CardDescription>
          </div>
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
              {sortedLogs.map((log) => (
                <TableRow key={log.id} className="group cursor-pointer hover:bg-gray-50">
                  <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="truncate">{log.message}</div>
                    <div className="text-xs text-muted-foreground mt-1 hidden group-hover:block">{log.details}</div>
                  </TableCell>
                  <TableCell>{log.source}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <span>{log.ip}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* 分页 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              显示 {sortedLogs.length} 条结果中的 1-{Math.min(sortedLogs.length, parseInt(resultsPerPage))} 条
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled={true}>上一页</Button>
              <Button variant="outline" size="sm" className="bg-purple-50">1</Button>
              <Button variant="outline" size="sm" disabled={sortedLogs.length <= parseInt(resultsPerPage)}>下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 