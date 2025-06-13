'use client';

import { Building2, Plus, Users, UserPlus, Search, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // 模拟部门数据
  const departments = [
    { id: 1, name: '技术部', manager: '张三', employeeCount: 45, openPositions: 3, status: 'active' },
    { id: 2, name: '市场部', manager: '李四', employeeCount: 28, openPositions: 2, status: 'active' },
    { id: 3, name: '人力资源部', manager: '王五', employeeCount: 15, openPositions: 1, status: 'active' },
    { id: 4, name: '财务部', manager: '赵六', employeeCount: 12, openPositions: 0, status: 'active' },
    { id: 5, name: '产品部', manager: '钱七', employeeCount: 20, openPositions: 2, status: 'active' },
  ];

  // 过滤部门数据
  const filteredDepartments = departments.filter((department) => {
    return (
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            部门管理
          </h1>
          <p className="text-muted-foreground">管理和查看所有部门信息</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            添加部门
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总部门数</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">较上月增长 2 个</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总员工数</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">较上月增长 15 人</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在招职位</CardTitle>
            <div className="p-2 bg-purple-100 rounded-full">
              <UserPlus className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.reduce((sum, dept) => sum + dept.openPositions, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">较上月减少 3 个</p>
          </CardContent>
        </Card>
      </div>

      {/* 部门列表 */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>部门列表</CardTitle>
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
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((department) => (
                <TableRow key={department.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.manager}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{department.employeeCount}</span>
                      <div className="h-1 w-12 bg-gray-200 rounded-full">
                        <div 
                          className="h-1 bg-blue-600 rounded-full" 
                          style={{ width: `${(department.employeeCount / 50) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {department.openPositions > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {department.openPositions} 个职位
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        暂无职位
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      正常运营
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>查看详情</DropdownMenuItem>
                        <DropdownMenuItem>编辑部门</DropdownMenuItem>
                        <DropdownMenuItem>管理成员</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">删除部门</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 