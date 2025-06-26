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
  Loader2,
  User,
  Calendar
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
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import { format } from 'date-fns';
import { getAllEmployeePerformances, getAllPerformances, deleteEmployeePerformance, deletePerformance } from '@/lib/services/performanceService';
import PerformanceForm from '@/components/hr/PerformanceForm';
import EmployeePerformanceForm from '@/components/hr/EmployeePerformanceForm';

export default function PerformancePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 绩效数据
  const [performances, setPerformances] = useState([]);
  
  // 表单状态
  const [isPerformanceFormOpen, setIsPerformanceFormOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 获取绩效数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 获取绩效考核列表
      let performanceData = [];
      try {
        performanceData = await getAllPerformances();
        setPerformances(performanceData);
        console.log('获取到的绩效考核数据:', performanceData);
      } catch (perfError) {
        console.error('获取绩效考核列表失败:', perfError);
        setError(prev => prev || '获取绩效考核数据失败');
      }
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
  const filteredPerformances = performances.filter((item) => {
    const perfName = item.name || '';
    const state = item.state || '';
    
    const matchesSearch =
      perfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus =
      selectedStatus === '全部' || item.state === selectedStatus;
      
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'endDate':
        return new Date(b.endDate || b.end_date || 0) - new Date(a.endDate || a.end_date || 0);
      case 'name':
        return (a.name || '').localeCompare(b.name || '');
      default:
        return 0;
    }
  });

  useEffect(() => {
    // 日志输出当前获取到的绩效数据，检查id字段
    console.log('当前绩效数据:', performances);
    if (performances.length > 0) {
      performances.forEach((perf, index) => {
        console.log(`绩效[${index}] - id:${perf.id}, name:${perf.name}`);
      });
    }
  }, [performances]);

  // 计算分页数据
  const totalItems = filteredPerformances.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredPerformances.slice(startIndex, endIndex);

  // 获取状态对应的图标和颜色
  const getStatusBadge = (status) => {
    switch (status) {
      case '已结束':
        return {
          variant: 'outline',
          className: 'bg-green-50 text-green-700 border-green-200',
          icon: <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />,
        };
      case '进行中':
        return {
          variant: 'outline',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: <Clock className="h-4 w-4 text-blue-500 mr-1" />,
        };
      case '未开始':
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

  // 跳转到绩效详情页面
  const handleViewDetails = (id) => {
    console.log('尝试跳转到绩效详情，原始ID:', id);
    
    // 确保id不是undefined或null
    if (!id) {
      console.error('无效的绩效考核ID:', id);
      alert('无法查看详情：无效的绩效考核ID');
      return;
    }
    
    // 确保id是数字或可以解析为数字的字符串
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      console.error('绩效考核ID不是有效数字:', id);
      alert('无法查看详情：无效的绩效考核ID格式');
      return;
    }
    
    console.log('跳转到绩效详情页，处理后ID:', numericId);
    router.push(`/performance/${numericId}`);
  };

  // 处理添加绩效考核
  const handleAddPerformance = () => {
    setSelectedPerformance(null);
    setIsPerformanceFormOpen(true);
  };

  // 处理编辑绩效考核
  const handleEditPerformance = (performance) => {
    setSelectedPerformance(performance);
    setIsPerformanceFormOpen(true);
  };

  // 处理删除绩效考核
  const handleDeletePerformance = async (id) => {
    if (window.confirm('确定要删除该绩效考核吗？此操作无法撤销。')) {
      try {
        await deletePerformance(id);
        // 删除成功后更新列表
        fetchData();
      } catch (err) {
        console.error('删除绩效考核失败:', err);
        alert('删除绩效考核失败，请稍后重试');
      }
    }
  };

  // 处理表单成功提交
  const handleFormSuccess = () => {
    setIsPerformanceFormOpen(false);
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">绩效考核管理</h1>
          <p className="text-muted-foreground">管理公司绩效考核计划和员工评估</p>
        </div>
        <Button onClick={handleAddPerformance} className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white">
          <Plus className="mr-2 h-4 w-4" /> 添加绩效考核
        </Button>
      </div>

      {/* 绩效考核统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总考核计划</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performances.length}</div>
            <p className="text-xs text-muted-foreground">
              所有绩效考核计划数量
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中考核</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performances.filter(p => p.state === '进行中').length}
            </div>
            <p className="text-xs text-muted-foreground">
              当前正在进行的考核计划
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">即将开始</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performances.filter(p => p.state === '未开始').length}
            </div>
            <p className="text-xs text-muted-foreground">
              计划中但尚未开始的考核
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索绩效考核..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部">全部状态</SelectItem>
            <SelectItem value="未开始">未开始</SelectItem>
            <SelectItem value="进行中">进行中</SelectItem>
            <SelectItem value="已结束">已结束</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">默认排序</SelectItem>
            <SelectItem value="endDate">结束日期</SelectItem>
            <SelectItem value="name">考核名称</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 绩效考核列表 */}
      <Card>
        <CardHeader>
          <CardTitle>绩效考核列表</CardTitle>
          <CardDescription>
            查看和管理所有绩效考核计划
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">加载中...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-60 text-red-500">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>{error}</span>
            </div>
          ) : currentPageData.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-60 text-muted-foreground">
              <Award className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">暂无绩效考核数据</p>
              <p className="text-sm">点击"添加绩效考核"按钮创建第一个考核计划</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>考核名称</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.map((performance, index) => (
                    <TableRow 
                      key={performance.id || `perf-${performance.name}-${performance.startDate}`} 
                      className="cursor-pointer hover:bg-muted/50" 
                      onClick={() => handleViewDetails(index + 1)}
                    >
                      <TableCell className="font-medium">{performance.name}</TableCell>
                      <TableCell>{formatDate(performance.startDate)}</TableCell>
                      <TableCell>{formatDate(performance.endDate)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(performance.state).variant} className={getStatusBadge(performance.state).className}>
                          {getStatusBadge(performance.state).icon}
                          {performance.state}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(performance.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">操作菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(index + 1);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEditPerformance(performance);
                            }}>
                              <FileEdit className="mr-2 h-4 w-4" />
                              编辑考核
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePerformance(performance.id);
                            }}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除考核
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
        <CardFooter className="flex items-center justify-between">
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
                <SelectTrigger className="h-8 w-[70px]">
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

      {/* 绩效考核表单 */}
      <Sheet open={isPerformanceFormOpen} onOpenChange={setIsPerformanceFormOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-2 bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-md">
              <Award className="h-6 w-6 text-blue-600" />
              {selectedPerformance ? '编辑绩效考核' : '添加绩效考核'}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <PerformanceForm 
              performance={selectedPerformance} 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsPerformanceFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 