'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Building2, Plus, Users, UserPlus, Search, MoreHorizontal, Pencil, Trash2, User } from 'lucide-react';

export default function AdminDepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟部门数据
  const departments = [
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

  // 过滤部门数据
  const filteredDepartments = departments.filter((department) => {
    return (
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 计算统计数据
  const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
  const totalOpenPositions = departments.reduce((sum, dept) => sum + dept.openPositions, 0);

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
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            添加部门
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总部门数</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <Building2 className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">公司现有部门总数</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总员工数</CardTitle>
            <div className="p-2 bg-indigo-100 rounded-full">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground mt-1">所有部门员工总数</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在招职位</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <UserPlus className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOpenPositions}</div>
            <p className="text-xs text-muted-foreground mt-1">当前开放招聘职位数</p>
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
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索部门名称或主管..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>部门名称</TableHead>
                <TableHead>部门主管</TableHead>
                <TableHead>员工数量</TableHead>
                <TableHead>在招职位</TableHead>
                <TableHead>创建时间</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                        {department.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{department.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">{department.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{department.manager}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{department.employeeCount}</span>
                      <div className="h-1 w-12 bg-gray-200 rounded-full">
                        <div 
                          className="h-1 bg-indigo-600 rounded-full" 
                          style={{ width: `${(department.employeeCount / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {department.openPositions > 0 ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {department.openPositions} 个职位
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        暂无职位
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{department.createdAt}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      正常运营
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
                        <DropdownMenuLabel>部门操作</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Building2 className="mr-2 h-4 w-4" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          编辑部门
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          管理成员
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除部门
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 部门结构图 */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>部门结构</CardTitle>
          <CardDescription>公司组织架构图</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="bg-gray-50 p-6 rounded-lg w-full text-center">
            <p className="text-muted-foreground">此处可以放置组织架构图表</p>
            <p className="text-sm text-muted-foreground mt-2">可以使用树形图或其他可视化组件展示部门层级关系</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 