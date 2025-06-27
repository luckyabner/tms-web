'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BasicTable } from '@/components/shared/tables/BasicTable';
import { Badge } from '@/components/ui/badge';
import { Eye, UserCog, Search, Filter } from 'lucide-react';
import { getAllEmployees } from '@/lib/services/employeeService';

// 定义员工列表的表头
const executiveEmployeeColumns = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: '姓名',
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 font-medium">
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{employee.name}</div>
            <div className="text-xs text-gray-500">{employee.position || '未设置职位'}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'department',
    header: '部门',
    cell: ({ row }) => (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        {row.original.department || '未分配'}
      </Badge>
    ),
  },
  {
    accessorKey: 'phone',
    header: '联系电话',
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={
          status === '在职' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
          status === '离职' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
          'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
        }>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'hireDate',
    header: '入职日期',
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" asChild>
          <a href={`/executive/employees/${row.original.id}`}>
            <Eye className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" asChild>
          <a href={`/executive/transfers/new?employeeId=${row.original.id}`}>
            <UserCog className="h-4 w-4" />
          </a>
        </Button>
      </div>
    ),
  },
];

export default function ExecutiveEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      setLoading(true);
      try {
        const data = await getAllEmployees();
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (error) {
        console.error('获取员工列表失败:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  // 搜索员工
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredEmployees(employees);
      return;
    }
    
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(term.toLowerCase()) ||
        employee.department?.toLowerCase().includes(term.toLowerCase()) ||
        employee.position?.toLowerCase().includes(term.toLowerCase()) ||
        employee.phone.includes(term)
    );
    
    setFilteredEmployees(filtered);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          员工管理
        </h1>
        <p className="text-muted-foreground">查看和管理所有员工信息</p>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索员工姓名、部门或电话..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <a href="/executive/transfers/new">
            <UserCog className="mr-2 h-4 w-4" />
            发起人事调动
          </a>
        </Button>
      </div>

      {/* 员工卡片 */}
      <Card>
        <CardHeader className="bg-green-50 border-b border-green-100">
          <CardTitle className="text-green-800">员工列表</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <BasicTable
            columns={executiveEmployeeColumns}
            data={filteredEmployees}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
} 