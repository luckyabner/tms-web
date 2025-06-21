'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, Plus, Users, UserPlus, Search, MoreHorizontal, Pencil, Trash2, User, Loader2 } from 'lucide-react';
import { getAllDepartments, deleteDepartment } from '@/lib/services/departmentService';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import DepartmentForm from '@/components/admin/DepartmentForm';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 每页显示5条数据

  // 模拟部门数据（作为API失败时的后备数据）
  const mockDepartments = [
    { 
      id: 1, 
      name: '技术部', 
      manager: '张三', 
      employeeCount: 45, 
      openPositions: 3, 
      status: 'active',
      description: '负责公司所有软件产品的开发和维护',
      createdAt: '2020-01-15'
    },
    { 
      id: 2, 
      name: '市场部', 
      manager: '李四', 
      employeeCount: 28, 
      openPositions: 2, 
      status: 'active',
      description: '负责产品营销、市场调研和品牌推广',
      createdAt: '2020-02-20'
    },
    { 
      id: 3, 
      name: '人力资源部', 
      manager: '王五', 
      employeeCount: 15, 
      openPositions: 1, 
      status: 'active',
      description: '负责员工招聘、培训和绩效管理',
      createdAt: '2020-03-10'
    },
    { 
      id: 4, 
      name: '财务部', 
      manager: '赵六', 
      employeeCount: 12, 
      openPositions: 0, 
      status: 'active',
      description: '负责公司财务规划、会计核算和资金管理',
      createdAt: '2020-04-05'
    },
    { 
      id: 5, 
      name: '产品部', 
      manager: '钱七', 
      employeeCount: 20, 
      openPositions: 2, 
      status: 'active',
      description: '负责产品规划、需求分析和产品设计',
      createdAt: '2020-05-12'
    },
    { 
      id: 6, 
      name: '设计部', 
      manager: '孙八', 
      employeeCount: 18, 
      openPositions: 1, 
      status: 'active',
      description: '负责产品UI/UX设计和品牌视觉设计',
      createdAt: '2020-06-18'
    },
    { 
      id: 7, 
      name: '客户服务部', 
      manager: '周九', 
      employeeCount: 25, 
      openPositions: 0, 
      status: 'active',
      description: '负责客户咨询、投诉处理和售后服务',
      createdAt: '2020-07-22'
    },
    { 
      id: 8, 
      name: '运营部', 
      manager: '吴十', 
      employeeCount: 22, 
      openPositions: 1, 
      status: 'active',
      description: '负责日常运营、活动策划和数据分析',
      createdAt: '2020-08-30'
    },
  ];

  // 获取部门数据
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      console.log('正在获取部门数据...');
      const data = await getAllDepartments();
      console.log('获取到的部门数据:', data);
      
      // 确保data是数组
      if (Array.isArray(data)) {
        setDepartments(data);
        console.log(`成功设置${data.length}条部门数据`);
      } else {
        console.error('API返回的不是数组:', data);
        setDepartments([]);
        setError('API返回数据格式错误');
      }
    } catch (err) {
      console.error('获取部门数据失败:', err);
      setError('获取部门数据失败，请稍后重试');
      // 如果API失败，使用模拟数据作为后备
      setDepartments(mockDepartments);
      console.log('已加载模拟数据作为后备');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 处理删除部门
  const handleDeleteDepartment = async (id) => {
    if (window.confirm('确定要删除该部门吗？此操作无法撤销。')) {
      try {
        await deleteDepartment(id);
        // 删除成功后更新列表
        setDepartments(prevDepartments => Array.isArray(prevDepartments) ? prevDepartments.filter(dept => dept.id !== id) : []);
      } catch (err) {
        console.error('删除部门失败:', err);
        alert('删除部门失败，请稍后重试');
      }
    }
  };

  // 处理编辑部门
  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setIsFormOpen(true);
  };

  // 处理添加部门
  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setIsFormOpen(true);
  };

  // 处理表单成功提交
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchDepartments();
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
    const newTotalPages = Math.ceil(filteredDepartments.length / newPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  // 确保departments是数组
  const departmentsArray = Array.isArray(departments) ? departments : [];

  // 过滤部门数据
  const filteredDepartments = departmentsArray.filter((department) => {
    return (
      department.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.managerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 计算分页数据
  const totalItems = filteredDepartments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredDepartments.slice(startIndex, endIndex);

  // 计算统计数据
  const totalEmployees = departmentsArray.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0);
  const totalOpenPositions = departmentsArray.reduce((sum, dept) => sum + (dept.openPositions || 0), 0);

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            部门管理
          </h1>
          <p className="text-muted-foreground">管理公司部门结构和人员配置</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={handleAddDepartment}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加部门
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总部门数</p>
                <h3 className="text-2xl font-bold mt-1">{departmentsArray.length}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-1 w-full bg-gray-100 rounded-full">
                <div 
                  className="h-1 bg-purple-600 rounded-full" 
                  style={{ width: `${Math.min(100, (departmentsArray.length / 10) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {departmentsArray.length > 0 
                  ? `上次更新: ${formatDate(departmentsArray[departmentsArray.length - 1].createdAt)}`
                  : '暂无部门数据'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总员工数</p>
                <h3 className="text-2xl font-bold mt-1">{totalEmployees}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-1 w-full bg-gray-100 rounded-full">
                <div 
                  className="h-1 bg-indigo-600 rounded-full" 
                  style={{ width: `${Math.min(100, (totalEmployees / 200) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                平均每个部门 {departmentsArray.length > 0 ? Math.round(totalEmployees / departmentsArray.length) : 0} 名员工
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">部门结构</p>
                <h3 className="text-2xl font-bold mt-1">
                  {departmentsArray.filter(d => !d.parentId).length} 个主部门
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600">
                  <path d="M3 3v18h18"></path>
                  <path d="M7 17V9"></path>
                  <path d="M11 17V5"></path>
                  <path d="M15 17v-5"></path>
                  <path d="M19 17v-2"></path>
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-1 w-full bg-gray-100 rounded-full">
                <div 
                  className="h-1 bg-green-600 rounded-full" 
                  style={{ width: `${departmentsArray.length > 0 ? (departmentsArray.filter(d => d.parentId).length / departmentsArray.length) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {departmentsArray.filter(d => d.parentId).length} 个子部门
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 部门列表 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>部门列表</CardTitle>
            <CardDescription>管理和查看所有部门信息</CardDescription>
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
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜索部门名称或主管..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 搜索时重置到第一页
                }}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-muted-foreground">加载中...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>部门名称</TableHead>
                  <TableHead>部门主管</TableHead>
                  <TableHead>上级部门</TableHead>
                  <TableHead>员工数量</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead className="text-center">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      {filteredDepartments.length === 0 ? '暂无部门数据' : '没有匹配的搜索结果'}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentPageData.map((department) => (
                    <TableRow key={department.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                            {department.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <div className="font-medium">{department.name}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{department.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {department.managerName ? (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{department.managerName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">未指定</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {department.parentName ? (
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{department.parentName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">无上级部门</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{department.employeeCount || 0}</span>
                          <div className="h-1 w-12 bg-gray-200 rounded-full">
                            <div 
                              className="h-1 bg-indigo-600 rounded-full" 
                              style={{ width: `${((department.employeeCount || 0) / 50) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(department.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            onClick={() => handleEditDepartment(department)}
                            title="编辑部门"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleDeleteDepartment(department.id)}
                            title="删除部门"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {!loading && !error && filteredDepartments.length > 0 && (
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

      {/* 部门表单侧边抽屉 */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-purple-800 flex items-center gap-2 mb-2">
              <Building2 className="h-6 w-6" />
              {selectedDepartment ? '编辑部门' : '添加新部门'}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-0">
            <DepartmentForm 
              department={selectedDepartment}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 