'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import {
  Search, Mail, Phone, MapPin, Calendar, User, Briefcase, Filter
} from 'lucide-react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

// 模拟员工数据
const mockEmployees = [
	{
		id: 1,
		name: '张三',
		position: '前端开发工程师',
		department: '技术部',
		email: 'zhangsan@company.com',
		phone: '138-1234-5678',
		location: '北京',
		joinDate: '2023-01-15',
		avatar: null,
		status: 'active',
	},
	{
		id: 2,
		name: '李四',
		position: '产品经理',
		department: '产品部',
		email: 'lisi@company.com',
		phone: '139-8765-4321',
		location: '上海',
		joinDate: '2022-08-20',
		avatar: null,
		status: 'active',
	},
	{
		id: 3,
		name: '王五',
		position: 'UI/UX设计师',
		department: '设计部',
		email: 'wangwu@company.com',
		phone: '156-2468-1357',
		location: '深圳',
		joinDate: '2023-03-10',
		avatar: null,
		status: 'active',
	},
	{
		id: 4,
		name: '赵六',
		position: '后端开发工程师',
		department: '技术部',
		email: 'zhaoliu@company.com',
		phone: '177-3691-2580',
		location: '广州',
		joinDate: '2022-12-05',
		avatar: null,
		status: 'active',
	},
	{
		id: 5,
		name: '钱七',
		position: '数据分析师',
		department: '数据部',
		email: 'qianqi@company.com',
		phone: '188-7539-4826',
		location: '杭州',
		joinDate: '2023-05-22',
		avatar: null,
		status: 'active',
	},
	{
		id: 6,
		name: '孙八',
		position: '人事专员',
		department: '人事部',
		email: 'sunba@company.com',
		phone: '199-6482-7394',
		location: '成都',
		joinDate: '2023-02-14',
		avatar: null,
		status: 'active',
	},
];

const departments = ['全部', '技术部', '产品部', '设计部', '数据部', '人事部'];

export default function EmployeesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('全部');

  // 过滤员工数据
  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment =
        selectedDepartment === '全部' || employee.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [searchTerm, selectedDepartment]);

  // 定义表格列
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: '姓名',
        cell: info => (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/employee/${info.row.original.id}`)}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-base">
              {info.row.original.name.charAt(0)}
            </div>
            <span className="hover:text-primary transition-colors">{info.row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'position',
        header: '职位',
      },
      {
        accessorKey: 'department',
        header: '部门',
      },
      {
        accessorKey: 'email',
        header: '邮箱',
        cell: info => (
          <span className="truncate block max-w-[140px]">{info.getValue()}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: '电话',
      },
      {
        accessorKey: 'location',
        header: '城市',
      },
      {
        accessorKey: 'joinDate',
        header: '入职日期',
      },
      {
        id: 'actions',
        header: '操作',
        cell: info => (
          <Button
            variant="outline"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              router.push(`/employee/${info.row.original.id}`);
            }}
          >
            查看详情
          </Button>
        ),
      },
    ],
    [router]
  );

  // react-table 实例
  const table = useReactTable({
    data: filteredEmployees,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            员工管理
          </h1>
          <p className="text-muted-foreground">管理和查看所有员工信息</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <User className="h-4 w-4 mr-2" />
            添加员工
          </Button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索员工姓名、职位或部门..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={selectedDepartment === dept ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDepartment(dept)}
            >
              {dept}
            </Button>
          ))}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总员工数</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEmployees.length}</div>
            <p className="text-xs text-muted-foreground">活跃员工数量</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">部门数量</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length - 1}</div>
            <p className="text-xs text-muted-foreground">不同部门类型</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">搜索结果</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredEmployees.length}</div>
            <p className="text-xs text-muted-foreground">匹配当前筛选条件</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table 员工列表 */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">暂无数据</TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/employee/${row.original.id}`)}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}