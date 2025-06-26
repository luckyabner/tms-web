'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  FileEdit, 
  Eye, 
  Search, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Trash2,
  Loader2,
  User,
  Calendar,
  BarChart3
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Pagination } from '@/components/ui/pagination';
import { format } from 'date-fns';
import { getPerformanceById, getAllEmployeePerformances, deleteEmployeePerformance } from '@/lib/services/performanceService';
import EmployeePerformanceForm from '@/components/hr/EmployeePerformanceForm';

export default function PerformanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 绩效数据
  const [performance, setPerformance] = useState(null);
  const [employeePerformances, setEmployeePerformances] = useState([]);
  
  // 表单状态
  const [isEmployeePerformanceFormOpen, setIsEmployeePerformanceFormOpen] = useState(false);
  const [selectedEmployeePerformance, setSelectedEmployeePerformance] = useState(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 获取绩效数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 确保id是有效的
      if (!id || id === 'undefined') {
        setError('无效的绩效考核ID');
        return;
      }
      
      // 获取绩效考核详情
      const performanceData = await getPerformanceById(id);
      setPerformance(performanceData);
      console.log('获取到的绩效考核详情:', performanceData);
      
      // 获取该绩效考核下的所有员工绩效评估
      const employeePerformanceData = await getAllEmployeePerformances();
      console.log('所有员工绩效评估数据:', employeePerformanceData);
      
      // 过滤出当前绩效考核的员工评估
      const numericId = parseInt(id);
      const filteredData = employeePerformanceData.filter(item => {
        // 检查所有可能的ID字段
        const itemPerfId = item.performanceId || item.perId || null;
        return itemPerfId === numericId;
      });
      
      console.log(`找到${filteredData.length}条绩效考核ID=${id}的员工评估:`, filteredData);
      setEmployeePerformances(filteredData);
      
    } catch (err) {
      console.error('获取绩效数据失败:', err);
      setError('获取绩效数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchData();
    }
  }, [id]);

  // 过滤员工绩效数据
  const filteredPerformances = employeePerformances.filter((item) => {
    const empName = item.employeeName || '';
    const state = item.state || '';
    
    const matchesSearch =
      empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus =
      selectedStatus === '全部' || item.state === selectedStatus;
      
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'score':
        const scoreA = a.score === '-' ? 0 : parseFloat(a.score);
        const scoreB = b.score === '-' ? 0 : parseFloat(b.score);
        return scoreB - scoreA;
      case 'name':
        return (a.employeeName || '').localeCompare(b.employeeName || '');
      default:
        return 0;
    }
  });

  // 计算分页数据
  const totalItems = filteredPerformances.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredPerformances.slice(startIndex, endIndex);

  // 获取状态对应的图标和颜色
  const getStatusBadge = (status) => {
    switch (status) {
      case '已完成':
        return {
          variant: 'outline',
          className: 'bg-green-50 text-green-700 border-green-200',
          icon: <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />,
        };
      case '未完成':
        return {
          variant: 'outline',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />,
        };
      default:
        return {
          variant: 'outline',
          className: 'bg-gray-50 text-gray-700 border-gray-200',
          icon: null,
        };
    }
  };

  // 处理页码变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 回到页面顶部
    window.scrollTo(0, 0);
  };

  // 处理每页显示数量变化
  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    // 调整当前页码，确保不会超出新的总页数
    const newTotalPages = Math.ceil(filteredPerformances.length / newPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理添加员工绩效评估
  const handleAddEmployeePerformance = () => {
    setSelectedEmployeePerformance(null);
    setIsEmployeePerformanceFormOpen(true);
  };

  // 处理编辑员工绩效评估
  const handleEditEmployeePerformance = (employeePerformance) => {
    setSelectedEmployeePerformance({
      ...employeePerformance,
      performanceId: parseInt(id)  // 确保编辑时也设置正确的绩效考核ID
    });
    setIsEmployeePerformanceFormOpen(true);
  };

  // 处理删除员工绩效评估
  const handleDeleteEmployeePerformance = async (id) => {
    if (window.confirm('确定要删除该绩效评估吗？此操作无法撤销。')) {
      try {
        await deleteEmployeePerformance(id);
        // 删除成功后更新列表
        fetchData();
      } catch (err) {
        console.error('删除绩效评估失败:', err);
        alert('删除绩效评估失败，请稍后重试');
      }
    }
  };

  // 处理表单成功提交
  const handleFormSuccess = () => {
    setIsEmployeePerformanceFormOpen(false);
    fetchData();
  };

  // 格式化日期
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '-';
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString || '-';
    }
  };

  // 计算统计数据
  const completedCount = employeePerformances.filter(item => item.state === '已完成').length;
  const pendingCount = employeePerformances.filter(item => item.state === '未完成').length;
  const avgScore = employeePerformances.length > 0 
    ? (employeePerformances
        .filter(item => item.score !== '-' && item.score !== undefined && item.score !== null)
        .reduce((sum, item) => sum + parseFloat(item.score || 0), 0) / 
        employeePerformances.filter(item => item.score !== '-' && item.score !== undefined && item.score !== null).length).toFixed(1)
    : '-';

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack} className="border-blue-200 hover:bg-blue-50">
            <ArrowLeft className="h-4 w-4 text-blue-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              {loading ? '加载中...' : performance?.name || '绩效考核详情'}
            </h1>
            <p className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
              {loading ? '' : `${formatDate(performance?.startDate)} - ${formatDate(performance?.endDate)}`}
            </p>
          </div>
        </div>
        <Button onClick={handleAddEmployeePerformance} className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white">
          <Plus className="mr-2 h-4 w-4" /> 添加员工评估
        </Button>
      </div>

      {/* 绩效考核统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-sm font-medium text-blue-800">总员工数</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">{employeePerformances.length}</div>
            <p className="text-xs text-muted-foreground">
              参与该考核的员工数量
            </p>
          </CardContent>
        </Card>
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-sm font-medium text-blue-800">完成率</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">
              {employeePerformances.length > 0 
                ? `${Math.round((completedCount / employeePerformances.length) * 100)}%` 
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              已完成 {completedCount}/{employeePerformances.length}
            </p>
          </CardContent>
        </Card>
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-sm font-medium text-blue-800">平均分数</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">
              {avgScore}
            </div>
            <p className="text-xs text-muted-foreground">
              所有已评分员工的平均分
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
          <Input
            placeholder="搜索员工姓名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px] border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部">全部状态</SelectItem>
            <SelectItem value="未完成">未完成</SelectItem>
            <SelectItem value="已完成">已完成</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">默认排序</SelectItem>
            <SelectItem value="score">按分数排序</SelectItem>
            <SelectItem value="name">按姓名排序</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 员工绩效列表 */}
      <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
          <CardTitle className="text-blue-800">员工绩效评估列表</CardTitle>
          <CardDescription>
            查看和管理该绩效考核下的所有员工评估
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">加载中...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-60 text-red-500">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>{error}</span>
            </div>
          ) : currentPageData.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-60 text-muted-foreground">
              <User className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">暂无员工绩效评估数据</p>
              <p className="text-sm">点击"添加员工评估"按钮添加员工绩效</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead>员工姓名</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>评分</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>评估人</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.map((item) => (
                    <TableRow key={item.id || `emp-perf-${item.employeeId}-${item.performanceId}`} className="hover:bg-blue-50 transition-colors">
                      <TableCell className="font-medium">{item.employeeName}</TableCell>
                      <TableCell>{item.department || '-'}</TableCell>
                      <TableCell>{item.position || '-'}</TableCell>
                      <TableCell className="font-semibold">{item.score || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(item.state).variant} className={getStatusBadge(item.state).className}>
                          {getStatusBadge(item.state).icon}
                          {item.state}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.approverName || '-'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                              <span className="sr-only">操作菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditEmployeePerformance(item)} className="hover:bg-blue-50 cursor-pointer">
                              <FileEdit className="mr-2 h-4 w-4 text-blue-600" />
                              编辑评估
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer" onClick={() => handleDeleteEmployeePerformance(item.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除评估
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-blue-100 bg-gradient-to-r from-white to-blue-50 rounded-b-xl">
          <div className="text-sm text-muted-foreground">
            共 {totalItems} 条记录
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">每页显示</p>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px] border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardFooter>
      </Card>

      {/* 员工绩效表单 */}
      <Sheet open={isEmployeePerformanceFormOpen} onOpenChange={setIsEmployeePerformanceFormOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-2 bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-md">
              <User className="h-6 w-6 text-blue-600" />
              {selectedEmployeePerformance ? '编辑员工绩效' : '添加员工绩效'}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <EmployeePerformanceForm 
              employeePerformance={selectedEmployeePerformance}
              performanceId={parseInt(id)}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsEmployeePerformanceFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 