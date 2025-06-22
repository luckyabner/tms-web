'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Award, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Filter,
  ChevronDown,
  BarChart3,
  TrendingUp,
  Users,
  MoreHorizontal,
  Trash2,
  Loader2
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
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import { format } from 'date-fns';
import { getAllEmployeePerformances, getAllPerformances, deleteEmployeePerformance, deletePerformance } from '@/lib/services/performanceService';
import PerformanceForm from '@/components/hr/PerformanceForm';
import EmployeePerformanceForm from '@/components/hr/EmployeePerformanceForm';

const statusOptions = ['全部', '未完成', '已完成'];

export default function PerformancePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 绩效数据
  const [performances, setPerformances] = useState([]);
  const [employeePerformances, setEmployeePerformances] = useState([]);
  
  // 表单状态
  const [isPerformanceFormOpen, setIsPerformanceFormOpen] = useState(false);
  const [isEmployeePerformanceFormOpen, setIsEmployeePerformanceFormOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [selectedEmployeePerformance, setSelectedEmployeePerformance] = useState(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 获取绩效数据
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 获取绩效考核列表
      const performanceData = await getAllPerformances();
      setPerformances(performanceData);
      
      // 获取员工绩效评估列表
      const employeePerformanceData = await getAllEmployeePerformances();
      setEmployeePerformances(employeePerformanceData);
      
      setError(null);
    } catch (err) {
      console.error('获取绩效数据失败:', err);
      setError('获取绩效数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 过滤绩效数据
  const filteredPerformances = employeePerformances.filter((item) => {
    const matchesSearch =
      (item.employeeName && item.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.department && item.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.position && item.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.performanceName && item.performanceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.approverName && item.approverName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      selectedStatus === '全部' || item.state === selectedStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'score':
        if (a.score === '-') return 1;
        if (b.score === '-') return -1;
        return parseFloat(b.score) - parseFloat(a.score);
      case 'endDate':
        return new Date(b.endDate) - new Date(a.endDate);
      case 'department':
        return (a.department || '').localeCompare(b.department || '');
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
          variant: 'success',
          icon: <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />,
        };
      case '进行中':
        return {
          variant: 'secondary',
          icon: <Clock className="h-4 w-4 text-blue-500 mr-1" />,
        };
      case '未完成':
        return {
          variant: 'warning',
          icon: <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />,
        };
      default:
        return {
          variant: 'secondary',
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

  // 跳转到绩效详情页面
  const handleViewDetails = (id) => {
    router.push(`/performance/${id}`);
  };

  // 处理添加绩效考核
  const handleAddPerformance = () => {
    setSelectedPerformance(null);
    setIsPerformanceFormOpen(true);
  };

  // 处理添加员工绩效评估
  const handleAddEmployeePerformance = () => {
    setSelectedEmployeePerformance(null);
    setIsEmployeePerformanceFormOpen(true);
  };

  // 处理编辑员工绩效评估
  const handleEditEmployeePerformance = (employeePerformance) => {
    setSelectedEmployeePerformance(employeePerformance);
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
  const pendingCount = employeePerformances.filter(item => item.state === '未完成').length;
  const completedCount = employeePerformances.filter(item => item.state === '已完成').length;
  const avgScore = employeePerformances.length > 0 
    ? (employeePerformances
        .filter(item => item.score !== '-')
        .reduce((sum, item) => sum + parseFloat(item.score || 0), 0) / 
        employeePerformances.filter(item => item.score !== '-').length).toFixed(1)
    : '-';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            绩效管理
          </h1>
          <p className="text-muted-foreground mt-1">
            管理和追踪员工的绩效考核流程
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleAddEmployeePerformance}
          >
            <Plus className="h-4 w-4 mr-2" />
            新建评估
          </Button>
          <Button 
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
            onClick={handleAddPerformance}
          >
            <Award className="h-4 w-4 mr-2" />
            新建考核
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理评估</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : pendingCount}
            </div>
            <div className="flex items-center mt-2">
              <div className="h-1 w-12 bg-gray-200 rounded-full">
                <div 
                  className="h-1 bg-yellow-500 rounded-full" 
                  style={{ width: employeePerformances.length > 0 ? `${(pendingCount / employeePerformances.length) * 100}%` : '0%' }} 
                />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {employeePerformances.length > 0 
                  ? `${Math.round((pendingCount / employeePerformances.length) * 100)}%` 
                  : '0%'}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成评估</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : completedCount}
            </div>
            <div className="flex items-center mt-2">
              <div className="h-1 w-12 bg-gray-200 rounded-full">
                <div 
                  className="h-1 bg-green-500 rounded-full" 
                  style={{ width: employeePerformances.length > 0 ? `${(completedCount / employeePerformances.length) * 100}%` : '0%' }} 
                />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {employeePerformances.length > 0 
                  ? `${Math.round((completedCount / employeePerformances.length) * 100)}%` 
                  : '0%'}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均分数</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : avgScore}
            </div>
            <div className="flex items-center mt-2">
              <div className="h-1 w-12 bg-gray-200 rounded-full">
                <div 
                  className="h-1 bg-blue-500 rounded-full" 
                  style={{ width: avgScore !== '-' ? `${(parseFloat(avgScore) / 100) * 100}%` : '0%' }} 
                />
              </div>
              <span className="text-xs text-muted-foreground ml-2">总体评分</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选区域 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>绩效评估列表</CardTitle>
            <CardDescription>管理和查看所有员工绩效评估</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <label htmlFor="pageSize" className="text-sm text-muted-foreground mr-2">
                每页显示:
              </label>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-[80px] h-9">
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜索员工姓名、部门或职位..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 搜索时重置到第一页
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={(value) => {
                setSelectedStatus(value);
                setCurrentPage(1); // 筛选时重置到第一页
              }}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">默认排序</SelectItem>
                  <SelectItem value="score">按分数排序</SelectItem>
                  <SelectItem value="endDate">按结束日期</SelectItem>
                  <SelectItem value="department">按部门排序</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 绩效列表 */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-muted-foreground">加载中...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>考核周期</TableHead>
                    <TableHead>评估人</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>得分</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        {filteredPerformances.length === 0 ? '暂无绩效评估数据' : '没有匹配的搜索结果'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageData.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.employeeName}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.position}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.department}</TableCell>
                        <TableCell>
                          <div>
                            <div>{item.performanceName}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(item.startDate)} ~ {formatDate(item.endDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.approverName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusBadge(item.state).icon}
                            <span>{item.state}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.score === '-' ? (
                            <span className="text-muted-foreground">-</span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.score}</span>
                              <div className="h-1 w-12 bg-gray-200 rounded-full">
                                <div
                                  className="h-1 bg-blue-600 rounded-full"
                                  style={{ width: `${parseInt(item.score)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(item.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditEmployeePerformance(item)}>
                                <FileEdit className="h-4 w-4 mr-2" />
                                编辑评估
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteEmployeePerformance(item.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                删除评估
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {!loading && !error && filteredPerformances.length > 0 && (
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t">
            <PaginationInfo 
              currentPage={currentPage} 
              pageSize={pageSize} 
              totalItems={totalItems}
              className="mb-4 sm:mb-0" 
            />
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </CardFooter>
        )}
      </Card>

      {/* 绩效考核表单侧边抽屉 */}
      <Sheet open={isPerformanceFormOpen} onOpenChange={setIsPerformanceFormOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-2">
              <Award className="h-6 w-6" />
              {selectedPerformance ? '编辑绩效考核' : '添加新绩效考核'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-0">
            <PerformanceForm 
              performance={selectedPerformance}
              onSuccess={() => {
                setIsPerformanceFormOpen(false);
                fetchData();
              }}
              onCancel={() => setIsPerformanceFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* 员工绩效评估表单侧边抽屉 */}
      <Sheet open={isEmployeePerformanceFormOpen} onOpenChange={setIsEmployeePerformanceFormOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-2">
              <BarChart3 className="h-6 w-6" />
              {selectedEmployeePerformance ? '编辑员工绩效评估' : '添加新员工绩效评估'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-0">
            <EmployeePerformanceForm 
              employeePerformance={selectedEmployeePerformance}
              onSuccess={() => {
                setIsEmployeePerformanceFormOpen(false);
                fetchData();
              }}
              onCancel={() => setIsEmployeePerformanceFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 