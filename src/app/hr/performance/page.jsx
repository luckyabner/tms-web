'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
  MoreHorizontal
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

// 模拟绩效数据
const mockPerformanceData = [
  {
    id: 1,
    employeeName: "张三",
    employeeId: 1,
    department: "技术部",
    position: "前端开发工程师",
    period: "2024年第一季度",
    status: "进行中",
    score: "-",
    evaluator: "李四",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: 2,
    employeeName: "王五",
    employeeId: 3,
    department: "设计部",
    position: "UI/UX设计师",
    period: "2023年第四季度",
    status: "已完成",
    score: "92",
    evaluator: "赵六",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
  },
  {
    id: 3,
    employeeName: "李四",
    employeeId: 2,
    department: "产品部",
    position: "产品经理",
    period: "2024年第一季度",
    status: "待评估",
    score: "-",
    evaluator: "张三",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: 4,
    employeeName: "赵六",
    employeeId: 4,
    department: "技术部",
    position: "后端开发工程师",
    period: "2023年第四季度",
    status: "已完成",
    score: "88",
    evaluator: "王五",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
  },
  {
    id: 5,
    employeeName: "钱七",
    employeeId: 5,
    department: "数据部",
    position: "数据分析师",
    period: "2024年第一季度",
    status: "进行中",
    score: "-",
    evaluator: "孙八",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    id: 6,
    employeeName: "孙八",
    employeeId: 6,
    department: "人事部",
    position: "人事专员",
    period: "2023年第四季度",
    status: "已完成",
    score: "95",
    evaluator: "钱七",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
  },
];

const departments = ['全部', '技术部', '产品部', '设计部', '数据部', '人事部'];
const statusOptions = ['全部', '待评估', '进行中', '已完成'];

export default function PerformancePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('全部');
  const [selectedStatus, setSelectedStatus] = useState('全部');
  const [sortBy, setSortBy] = useState('default');

  // 过滤绩效数据
  const filteredPerformance = mockPerformanceData.filter((item) => {
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === '全部' || item.department === selectedDepartment;
    const matchesStatus =
      selectedStatus === '全部' || item.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'score':
        if (a.score === '-') return 1;
        if (b.score === '-') return -1;
        return parseInt(b.score) - parseInt(a.score);
      case 'endDate':
        return new Date(b.endDate) - new Date(a.endDate);
      case 'department':
        return a.department.localeCompare(b.department);
      default:
        return 0;
    }
  });

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
      case '待评估':
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

  // 跳转到绩效详情页面
  const handleViewDetails = (id) => {
    router.push(`/performance/${id}`);
  };

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
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            新建考核
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理考核</CardTitle>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockPerformanceData.filter((item) => item.status === '待评估').length}
            </div>
            <div className="flex items-center mt-2">
              <div className="h-1 w-12 bg-gray-200 rounded-full">
                <div className="h-1 bg-yellow-500 rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-xs text-muted-foreground ml-2">较上月 +2</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中考核</CardTitle>
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockPerformanceData.filter((item) => item.status === '进行中').length}
            </div>
            <div className="flex items-center mt-2">
              <div className="h-1 w-12 bg-gray-200 rounded-full">
                <div className="h-1 bg-blue-500 rounded-full" style={{ width: '80%' }} />
              </div>
              <span className="text-xs text-muted-foreground ml-2">较上月 +5</span>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成考核</CardTitle>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockPerformanceData.filter((item) => item.status === '已完成').length}
            </div>
            <div className="flex items-center mt-2">
              <div className="h-1 w-12 bg-gray-200 rounded-full">
                <div className="h-1 bg-green-500 rounded-full" style={{ width: '40%' }} />
              </div>
              <span className="text-xs text-muted-foreground ml-2">较上月 -3</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="搜索员工姓名、部门或职位..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
        </div>
      </div>

      {/* 绩效列表 */}
      <Card>
        <CardContent className="p-0">
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
              {filteredPerformance.map((item) => (
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
                      <div>{item.period}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.startDate} ~ {item.endDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.evaluator}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusBadge(item.status).icon}
                      <span>{item.status}</span>
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
                        <DropdownMenuItem>
                          <FileEdit className="h-4 w-4 mr-2" />
                          编辑评估
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
    </div>
  );
} 