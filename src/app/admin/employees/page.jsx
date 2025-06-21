'use client';

import React, { useState } from 'react';
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
import { Search, User, UserPlus, Filter, MoreHorizontal, Shield, UserCog, Mail, Phone, Building } from 'lucide-react';
import { Pagination, PaginationInfo } from '@/components/ui/pagination';

// 模拟员工数据
const mockEmployees = [
  {
    id: 1,
    name: '张三',
    position: '前端开发工程师',
    department: '技术部',
    email: 'zhangsan@company.com',
    phone: '138-1234-5678',
    role: '普通员工',
    status: 'active',
    permissions: ['查看个人信息', '提交工作报告']
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

// 系统角色列表
const roles = [
  { id: 1, name: '系统管理员', description: '拥有系统最高权限' },
  { id: 2, name: '人事专员', description: '管理员工档案、招聘和绩效' },
  { id: 3, name: '公司高层', description: '查看所有数据，无修改权限' },
  { id: 4, name: '普通员工', description: '基本系统访问权限' }
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

export default function AdminEmployeesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('employees');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 每页显示5条数据

  // 过滤员工数据
  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole =
      selectedRole === 'all' || employee.role === selectedRole;
    
    const matchesStatus =
      selectedStatus === 'all' || 
      (selectedStatus === 'active' && employee.status === 'active') ||
      (selectedStatus === 'inactive' && employee.status === 'inactive');
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // 计算分页数据
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredEmployees.slice(startIndex, endIndex);
  
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

  return (
    <div className="container mx-auto p-6 space-y-6">
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
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <UserPlus className="h-4 w-4 mr-2" />
            添加员工
          </Button>
        </div>
      </div>

      {/* 选项卡 */}
      <Tabs defaultValue="employees" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">员工列表</TabsTrigger>
          <TabsTrigger value="roles">角色管理</TabsTrigger>
          <TabsTrigger value="permissions">权限设置</TabsTrigger>
        </TabsList>

        {/* 员工列表选项卡 */}
        <TabsContent value="employees" className="space-y-4">
          {/* 搜索和筛选区域 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="搜索员工姓名、职位、部门或邮箱..."
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>员工</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>联系方式</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                        {filteredEmployees.length === 0 ? '暂无员工数据' : '没有匹配的搜索结果'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageData.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                              {employee.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">{employee.position}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{employee.department}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1 text-sm">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="truncate max-w-[150px]">{employee.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span>{employee.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            employee.role === '系统管理员' ? 'destructive' :
                            employee.role === '人事专员' ? 'purple' :
                            employee.role === '公司高层' ? 'blue' : 'outline'
                          }>
                            {employee.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={employee.status === 'active' ? 'success' : 'secondary'}>
                            {employee.status === 'active' ? '在职' : '离职'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>操作</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCog className="mr-2 h-4 w-4" />
                                编辑信息
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                权限设置
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                {employee.status === 'active' ? '禁用账户' : '启用账户'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {filteredEmployees.length > 0 && (
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
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">系统角色</h2>
              <p className="text-sm text-muted-foreground">管理系统中的用户角色及其权限</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              新增角色
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>编辑角色</DropdownMenuItem>
                      <DropdownMenuItem>配置权限</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">删除角色</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">用户数量</h4>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-full bg-gray-100 rounded-full">
                        <div 
                          className="h-2 bg-purple-600 rounded-full" 
                          style={{ width: role.name === '普通员工' ? '70%' : role.name === '公司高层' ? '20%' : '5%' }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {role.name === '系统管理员' ? '2' : 
                         role.name === '人事专员' ? '3' : 
                         role.name === '公司高层' ? '8' : '45'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">权限级别</h4>
                    <div className="flex space-x-1">
                      {Array.from({ length: role.name === '系统管理员' ? 5 : 
                                           role.name === '人事专员' ? 4 : 
                                           role.name === '公司高层' ? 3 : 1 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 flex-1 rounded-full ${
                            role.name === '系统管理员' ? 'bg-red-500' : 
                            role.name === '人事专员' ? 'bg-amber-500' : 
                            role.name === '公司高层' ? 'bg-blue-500' : 'bg-green-500'
                          }`} 
                        />
                      ))}
                      {Array.from({ length: 5 - (role.name === '系统管理员' ? 5 : 
                                                role.name === '人事专员' ? 4 : 
                                                role.name === '公司高层' ? 3 : 1) }).map((_, i) => (
                        <div key={i + 5} className="h-1.5 flex-1 rounded-full bg-gray-100" />
                      ))}
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    管理权限
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 权限设置选项卡 */}
        <TabsContent value="permissions" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">权限管理</h2>
            <p className="text-sm text-muted-foreground">配置系统权限和访问控制</p>
          </div>

          {permissionGroups.map((group) => (
            <Card key={group.name} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <CardDescription>管理{group.name}相关的系统权限</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>权限名称</TableHead>
                      <TableHead>描述</TableHead>
                      <TableHead>系统管理员</TableHead>
                      <TableHead>人事专员</TableHead>
                      <TableHead>公司高层</TableHead>
                      <TableHead>普通员工</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell className="font-medium">{permission.name}</TableCell>
                        <TableCell>{permission.description}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <div className="w-4 h-4 rounded-full bg-green-500"></div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {(permission.name.includes('员工档案') || 
                              permission.name.includes('招聘') || 
                              permission.name.includes('绩效') || 
                              permission.name.includes('考勤') || 
                              group.name === '个人权限') ? (
                              <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {(permission.name.includes('部门') || 
                              group.name === '个人权限') ? (
                              <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            {(permission.name === '查看个人信息' || 
                              permission.name === '提交工作报告') ? (
                              <div className="w-4 h-4 rounded-full bg-green-500"></div>
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-red-500"></div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}