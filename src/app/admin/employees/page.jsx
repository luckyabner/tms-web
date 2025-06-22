'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Search, User, UserPlus, Filter, MoreHorizontal, Shield, UserCog, Phone, Building, Loader2, GraduationCap, Calendar } from 'lucide-react';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';
import { getAllEmployees, deleteEmployee, getEmployeeById, getRoleStats } from '@/lib/services/employeeService';
import EmployeeForm from '@/components/admin/EmployeeForm';

// 系统角色列表（作为后备数据）
const defaultRoles = [
  { id: 1, name: '系统管理员', description: '拥有系统最高权限', count: 0, color: 'red', icon: 'ShieldAlert' },
  { id: 2, name: '人事专员', description: '管理员工档案、招聘和绩效', count: 0, color: 'amber', icon: 'Users' },
  { id: 3, name: '公司高层', description: '查看所有数据，无修改权限', count: 0, color: 'blue', icon: 'Briefcase' },
  { id: 4, name: '普通员工', description: '基本系统访问权限', count: 0, color: 'green', icon: 'User' }
];

// 权限列表
const permissionGroups = [
  {
    name: '个人权限',
    permissions: [
      { id: 1, name: '查看个人信息', description: '查看自己的基本信息' },
      { id: 2, name: '编辑个人信息', description: '修改自己的基本信息' },
      { id: 3, name: '提交工作报告', description: '提交个人工作报告' }
    ]
  },
  {
    name: '部门权限',
    permissions: [
      { id: 4, name: '查看部门信息', description: '查看部门所有成员信息' },
      { id: 5, name: '审批工作报告', description: '审批部门成员工作报告' },
      { id: 6, name: '考勤管理', description: '管理部门成员考勤' }
    ]
  },
  {
    name: '系统权限',
    permissions: [
      { id: 7, name: '员工档案管理', description: '管理所有员工档案' },
      { id: 8, name: '招聘管理', description: '管理招聘流程和候选人' },
      { id: 9, name: '绩效管理', description: '管理员工绩效评估' },
      { id: 10, name: '系统管理', description: '管理系统基础设置' },
      { id: 11, name: '用户管理', description: '管理系统用户账号' },
      { id: 12, name: '权限分配', description: '分配和管理用户权限' },
      { id: 13, name: '日志查看', description: '查看系统操作日志' }
    ]
  }
];

// 模拟员工数据（作为API失败时的后备数据）
const mockEmployees = [
  {
    id: 1,
    name: '张三',
    position: '前端开发工程师',
    department: '技术部',
    phone: '138-1234-5678',
    role: '普通用户',
    status: '在职',
    gender: '男',
    hireDate: '2020-01-01',
    education: '本科生',
    school: '北京大学'
  },
  {
    id: 2,
    name: '李四',
    position: '产品经理',
    department: '产品部',
    email: 'lisi@company.com',
    phone: '139-8765-4321',
    role: '公司高层',
    status: 'active',
    permissions: ['查看部门信息', '审批工作报告', '考勤管理']
  },
  {
    id: 3,
    name: '王五',
    position: 'UI/UX设计师',
    department: '设计部',
    email: 'wangwu@company.com',
    phone: '156-2468-1357',
    role: '普通员工',
    status: 'active',
    permissions: ['查看个人信息', '提交工作报告']
  },
  {
    id: 4,
    name: '赵六',
    position: '后端开发工程师',
    department: '技术部',
    email: 'zhaoliu@company.com',
    phone: '177-3691-2580',
    role: '普通员工',
    status: 'inactive',
    permissions: ['查看个人信息']
  },
  {
    id: 5,
    name: '钱七',
    position: '数据分析师',
    department: '数据部',
    email: 'qianqi@company.com',
    phone: '188-7539-4826',
    role: '公司高层',
    status: 'active',
    permissions: ['查看部门信息', '审批工作报告', '考勤管理']
  },
  {
    id: 6,
    name: '孙八',
    position: '人事专员',
    department: '人事部',
    email: 'sunba@company.com',
    phone: '199-6482-7394',
    role: '人事专员',
    status: 'active',
    permissions: ['员工档案管理', '招聘管理', '考勤管理', '绩效管理']
  },
  {
    id: 7,
    name: '周九',
    position: '系统管理员',
    department: 'IT部',
    email: 'zhoujiu@company.com',
    phone: '133-5792-4680',
    role: '系统管理员',
    status: 'active',
    permissions: ['系统管理', '用户管理', '权限分配', '日志查看']
  }
];

export default function AdminEmployeesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('employees');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 每页显示5条数据
  
  // 员工数据状态
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 角色数据状态
  const [roles, setRoles] = useState(defaultRoles);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  // 表单状态
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // 获取员工数据
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log('正在获取员工数据...');
      const data = await getAllEmployees();
      console.log('获取到的员工数据:', data);
      
      // 确保data是数组
      if (Array.isArray(data)) {
        setEmployees(data);
        console.log(`成功设置${data.length}条员工数据`);
      } else {
        console.error('API返回的不是数组:', data);
        setEmployees([]);
        setError('API返回数据格式错误');
      }
    } catch (err) {
      console.error('获取员工数据失败:', err);
      setError('获取员工数据失败，请稍后重试');
      // 如果API失败，使用模拟数据作为后备
      setEmployees(mockEmployees);
      console.log('已加载模拟数据作为后备');
    } finally {
      setLoading(false);
    }
  };
  
  // 获取角色统计数据
  const fetchRoleStats = async () => {
    try {
      setRolesLoading(true);
      console.log('正在获取角色统计数据...');
      const data = await getRoleStats();
      console.log('获取到的角色统计数据:', data);
      
      // 确保data是数组
      if (Array.isArray(data)) {
        setRoles(data);
        console.log(`成功设置${data.length}条角色数据`);
      } else {
        console.error('API返回的角色数据不是数组:', data);
        setRoles(defaultRoles);
      }
    } catch (err) {
      console.error('获取角色统计数据失败:', err);
      // 使用默认数据作为后备
      setRoles(defaultRoles);
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRoleStats();
  }, []);
  
  // 处理标签切换
  const handleTabChange = (value) => {
    setActiveTab(value);
    // 如果切换到角色管理标签，重新获取角色统计数据
    if (value === 'roles') {
      fetchRoleStats();
    }
  };

  // 处理删除员工
  const handleDeleteEmployee = async (id) => {
    if (window.confirm('确定要删除该员工吗？此操作无法撤销。')) {
      try {
        await deleteEmployee(id);
        // 删除成功后更新列表
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
      } catch (err) {
        console.error('删除员工失败:', err);
        alert('删除员工失败，请稍后重试');
      }
    }
  };
  
  // 处理添加新员工
  const handleAddEmployee = () => {
    setCurrentEmployee(null);
    setIsFormOpen(true);
  };
  
  // 处理编辑员工
  const handleEditEmployee = async (id) => {
    try {
      setFormLoading(true);
      const employeeData = await getEmployeeById(id);
      setCurrentEmployee(employeeData);
      setIsFormOpen(true);
    } catch (err) {
      console.error('获取员工详情失败:', err);
      alert('获取员工详情失败，请稍后重试');
    } finally {
      setFormLoading(false);
    }
  };
  
  // 处理表单提交成功
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchEmployees(); // 重新获取员工列表
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
    const newTotalPages = Math.ceil(filteredEmployees.length / newPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  // 过滤员工数据
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.school && employee.school.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole =
      selectedRole === 'all' || employee.role === selectedRole;
    
    const matchesStatus =
      selectedStatus === 'all' || 
      (selectedStatus === 'active' && employee.status === '在职') ||
      (selectedStatus === 'inactive' && employee.status === '离职') ||
      (selectedStatus === 'borrowed' && employee.status === '借调');
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // 计算分页数据
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredEmployees.slice(startIndex, endIndex);

  // 获取员工状态对应的Badge样式
  const getStatusBadgeVariant = (status) => {
    switch(status) {
      case '在职': return 'success';
      case '离职': return 'secondary';
      case '借调': return 'warning';
      default: return 'outline';
    }
  };

  // 获取员工角色对应的Badge样式
  const getRoleBadgeVariant = (role) => {
    switch(role) {
      case '系统管理员': return 'destructive';
      case '人事专员': return 'purple';
      case '公司高层': return 'blue';
      case '普通员工': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            员工管理
          </h1>
          <p className="text-muted-foreground">管理员工账户和权限</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            onClick={handleAddEmployee}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            添加员工
          </Button>
        </div>
      </div>

      {/* 选项卡 */}
      <Tabs defaultValue="employees" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">员工列表</TabsTrigger>
          <TabsTrigger value="roles">角色管理</TabsTrigger>
          <TabsTrigger value="permissions">权限查看</TabsTrigger>
        </TabsList>

        {/* 员工列表选项卡 */}
        <TabsContent value="employees" className="space-y-4">
          {/* 搜索和筛选区域 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                              <Input
                placeholder="搜索员工姓名、职位、部门、电话或学校..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 搜索时重置到第一页
                }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={selectedRole} 
                onValueChange={(value) => {
                  setSelectedRole(value);
                  setCurrentPage(1); // 筛选时重置到第一页
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有角色</SelectItem>
                  <SelectItem value="系统管理员">系统管理员</SelectItem>
                  <SelectItem value="人事专员">人事专员</SelectItem>
                  <SelectItem value="公司高层">公司高层</SelectItem>
                  <SelectItem value="普通员工">普通员工</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={selectedStatus} 
                onValueChange={(value) => {
                  setSelectedStatus(value);
                  setCurrentPage(1); // 筛选时重置到第一页
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="active">在职</SelectItem>
                  <SelectItem value="inactive">离职</SelectItem>
                  <SelectItem value="borrowed">借调</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="每页条数" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5条/页</SelectItem>
                  <SelectItem value="10">10条/页</SelectItem>
                  <SelectItem value="20">20条/页</SelectItem>
                  <SelectItem value="50">50条/页</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 员工表格 */}
          <Card>
            <CardContent className="p-0">
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
                <Table className="border-collapse">
                  <TableHeader className="bg-gray-50">
                    <TableRow className="border-b border-gray-200 hover:bg-gray-50/50">
                      <TableHead className="py-2.5 font-medium text-gray-700 pl-4">员工</TableHead>
                      <TableHead className="py-2.5 font-medium text-gray-700">部门/职位</TableHead>
                      <TableHead className="py-2.5 font-medium text-gray-700 text-center">系统角色</TableHead>
                      <TableHead className="py-2.5 font-medium text-gray-700">联系方式</TableHead>
                      <TableHead className="py-2.5 font-medium text-gray-700">基本信息</TableHead>
                      <TableHead className="py-2.5 font-medium text-gray-700 text-center">状态</TableHead>
                      <TableHead className="text-right py-2.5 font-medium text-gray-700 pr-4">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPageData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          {filteredEmployees.length === 0 ? '暂无员工数据' : '没有匹配的搜索结果'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentPageData.map((employee, index) => (
                        <TableRow 
                          key={employee.id} 
                          className={`border-b border-gray-100 transition-colors hover:bg-gray-50/70 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                        >
                          <TableCell className="py-2.5 pl-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
                                {employee.name?.charAt(0) || '?'}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{employee.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1 text-gray-800">
                                <Building className="h-4 w-4 text-purple-500" />
                                <span className="font-medium">{employee.department || '未分配'}</span>
                              </div>
                              {employee.position && (
                                <div className="text-sm text-gray-500 ml-5">
                                  {employee.position}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 text-center">
                            <Badge variant={getRoleBadgeVariant(employee.role)} className="whitespace-nowrap px-2.5 py-1">
                              {employee.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2.5">
                            <div className="flex items-center space-x-1 text-gray-800">
                              <Phone className="h-4 w-4 text-purple-500" />
                              <span>{employee.phone}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Calendar className="h-3.5 w-3.5 text-purple-500" />
                                <span>入职: {employee.hireDate}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
                                <span>{employee.education || '未知'}</span>
                                {employee.school && <span className="text-xs text-gray-500 ml-1">({employee.school})</span>}
                              </div>
                              {employee.gender && (
                                <div className="text-sm text-gray-600 flex items-center space-x-1">
                                  <span className={`inline-block w-2 h-2 rounded-full ${employee.gender === '男' ? 'bg-blue-400' : 'bg-pink-400'}`}></span>
                                  <span>性别: {employee.gender}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 text-center">
                            <Badge variant={getStatusBadgeVariant(employee.status)}>
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right py-2.5 pr-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>操作</DropdownMenuLabel>
                                <DropdownMenuItem className="cursor-pointer">
                                  <User className="mr-2 h-4 w-4 text-purple-500" />
                                  查看详情
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditEmployee(employee.id)}>
                                  <UserCog className="mr-2 h-4 w-4 text-blue-500" />
                                  编辑信息
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Shield className="mr-2 h-4 w-4 text-amber-500" />
                                  权限设置
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                >
                                  {employee.status === '在职' ? '禁用账户' : '启用账户'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            {!loading && !error && filteredEmployees.length > 0 && (
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
        </TabsContent>

        {/* 角色管理选项卡 */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">系统角色</h2>
              <p className="text-sm text-muted-foreground">管理系统中的用户角色及其权限</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200">
              <UserPlus className="h-4 w-4 mr-2" />
              新增角色
            </Button>
          </div>

          {rolesLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <span className="ml-2 text-muted-foreground">加载中...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roles.map((role) => {
                // 根据角色选择图标
                let RoleIcon;
                switch(role.icon) {
                  case 'ShieldAlert': RoleIcon = Shield; break;
                  case 'Users': RoleIcon = UserCog; break;
                  case 'Briefcase': RoleIcon = Building; break;
                  case 'User': 
                  default: RoleIcon = User;
                }
                
                return (
                  <Card key={role.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${role.color}-100 text-${role.color}-600 mr-3`}>
                          <RoleIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold">{role.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                        </div>
                      </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <UserCog className="h-4 w-4 mr-2" />
                            编辑角色
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            配置权限
                          </DropdownMenuItem>
                        <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                            删除角色
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                    <CardContent className="pt-4 pb-6">
                      {/* 更突出显示角色人数 */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-muted-foreground mr-2" />
                          <span className="text-base font-medium">用户数量</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge variant="outline" className={`text-lg py-1.5 px-3 bg-${role.color}-50 text-${role.color}-700 border-${role.color}-200`}>
                            <span className="font-bold">{role.count}</span>
                            <span className="ml-1 text-sm">人</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground mt-1">
                            {role.count > 0 && employees.length > 0
                              ? `占比 ${Math.round((role.count / employees.length) * 100)}%` 
                              : '暂无用户'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">权限级别</span>
                          <span className={`text-xs font-medium text-${role.color}-600`}>
                            {role.name === '系统管理员' ? '最高权限' : 
                             role.name === '人事专员' ? '高级权限' : 
                             role.name === '公司高层' ? '中级权限' : '基础权限'}
                          </span>
                    </div>
                    
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-${role.color}-500 rounded-full`} 
                            style={{ 
                              width: role.name === '系统管理员' ? '100%' : 
                                     role.name === '人事专员' ? '80%' : 
                                     role.name === '公司高层' ? '60%' : '30%' 
                            }}
                          />
                      </div>
                    </div>
                    
                      <div className="mt-6">
                        <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50">
                      <Shield className="mr-2 h-4 w-4" />
                      管理权限
                    </Button>
                      </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* 权限查看选项卡 */}
        <TabsContent value="permissions" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">权限查看</h2>
            <p className="text-sm text-muted-foreground">查看系统各角色的权限分配情况</p>
          </div>

          {permissionGroups.map((group) => {
            // 根据权限组选择图标
            let GroupIcon;
            if (group.name === '个人权限') {
              GroupIcon = User;
            } else if (group.name === '部门权限') {
              GroupIcon = Building;
            } else {
              GroupIcon = Shield;
            }
            
            return (
              <Card key={group.name} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      group.name === '个人权限' ? 'bg-green-100 text-green-600' : 
                      group.name === '部门权限' ? 'bg-blue-100 text-blue-600' : 
                      'bg-purple-100 text-purple-600'
                    }`}>
                      <GroupIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{group.name}</CardTitle>
                      <CardDescription>查看{group.name}相关的系统权限</CardDescription>
                    </div>
                  </div>
              </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                <Table>
                      <TableHeader className="bg-gray-50">
                    <TableRow>
                          <TableHead className="w-[180px] font-medium">权限名称</TableHead>
                          <TableHead className="font-medium">描述</TableHead>
                          <TableHead className="w-[100px] text-center font-medium">
                            <div className="flex flex-col items-center">
                              <Shield className="h-4 w-4 text-red-500 mb-1" />
                              <span>系统管理员</span>
                            </div>
                          </TableHead>
                          <TableHead className="w-[100px] text-center font-medium">
                            <div className="flex flex-col items-center">
                              <UserCog className="h-4 w-4 text-amber-500 mb-1" />
                              <span>人事专员</span>
                            </div>
                          </TableHead>
                          <TableHead className="w-[100px] text-center font-medium">
                            <div className="flex flex-col items-center">
                              <Building className="h-4 w-4 text-blue-500 mb-1" />
                              <span>公司高层</span>
                            </div>
                          </TableHead>
                          <TableHead className="w-[100px] text-center font-medium">
                            <div className="flex flex-col items-center">
                              <User className="h-4 w-4 text-green-500 mb-1" />
                              <span>普通员工</span>
                            </div>
                          </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.permissions.map((permission) => (
                          <TableRow key={permission.id} className="hover:bg-gray-50/70">
                        <TableCell className="font-medium">{permission.name}</TableCell>
                        <TableCell>{permission.description}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {(permission.name.includes('员工档案') || 
                              permission.name.includes('招聘') || 
                              permission.name.includes('绩效') || 
                              permission.name.includes('考勤') || 
                              group.name === '个人权限') ? (
                                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </div>
                            ) : (
                                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                  </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {(permission.name.includes('部门') || 
                              group.name === '个人权限') ? (
                                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </div>
                            ) : (
                                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                  </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {(permission.name === '查看个人信息' || 
                              permission.name === '提交工作报告') ? (
                                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </div>
                            ) : (
                                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                                      <line x1="18" y1="6" x2="6" y2="18"></line>
                                      <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                  </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                  </div>
              </CardContent>
            </Card>
            );
          })}
        </TabsContent>
      </Tabs>
      
      {/* 员工表单抽屉 */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto p-0">
          {formLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-muted-foreground">加载中...</span>
            </div>
          ) : (
            <EmployeeForm 
              employee={currentEmployee} 
              onSuccess={handleFormSuccess} 
              onCancel={() => setIsFormOpen(false)} 
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}