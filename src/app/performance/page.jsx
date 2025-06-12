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
  Filter
} from "lucide-react";

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
  const handlePerformanceClick = (id) => {
    router.push(`/performance/${id}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">绩效管理</h1>
          <p className="text-muted-foreground mt-2">
            管理和追踪员工的绩效考核流程
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            导出数据
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建考核
          </Button>
        </div>
      </div>

      {/* 搜索和筛选区域 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理考核</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {mockPerformanceData.filter((item) => item.status === '待评估').length}
            </p>
            <p className="text-xs text-muted-foreground">需要您处理的绩效考核</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中考核</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {mockPerformanceData.filter((item) => item.status === '进行中').length}
            </p>
            <p className="text-xs text-muted-foreground">正在进行的绩效考核</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成考核</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {mockPerformanceData.filter((item) => item.status === '已完成').length}
            </p>
            <p className="text-xs text-muted-foreground">本季度已完成的考核</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>绩效考核列表</CardTitle>
              <CardDescription>
                显示所有绩效考核记录，可以查看详情和进行评估
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>员工姓名</TableHead>
                <TableHead>所属部门</TableHead>
                <TableHead>职位</TableHead>
                <TableHead>考核周期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>考核结果</TableHead>
                <TableHead>考核人</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPerformance.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handlePerformanceClick(item.id)}>
                  <TableCell className="font-medium">{item.employeeName}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.position}</TableCell>
                  <TableCell>{item.period}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusBadge(item.status).icon}
                      <Badge variant={getStatusBadge(item.status).variant}>
                        {item.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{item.score}</TableCell>
                  <TableCell>{item.evaluator}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        handlePerformanceClick(item.id);
                      }}>
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        // 处理编辑操作
                      }}>
                        <FileEdit className="h-4 w-4 text-yellow-500" />
                      </Button>
                    </div>
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