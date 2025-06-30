"use client";

import EmployeePerformanceForm from "@/components/hr/EmployeePerformanceForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteEmployeePerformance,
  getAllEmployeePerformances,
  getPerformanceById,
} from "@/lib/services/performanceService";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle2,
  FileEdit,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PerformanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("全部");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [employeePerformances, setEmployeePerformances] = useState([]);
  const [isEmployeePerformanceFormOpen, setIsEmployeePerformanceFormOpen] =
    useState(false);
  const [selectedEmployeePerformance, setSelectedEmployeePerformance] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 获取绩效数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!id || id === "undefined") {
        setError("无效的绩效考核ID");
        return;
      }
      const performanceData = await getPerformanceById(id);
      setPerformance(performanceData);
      const employeePerformanceData = await getAllEmployeePerformances();
      const numericId = parseInt(id);
      const filteredData = employeePerformanceData.filter((item) => {
        const itemPerfId = item.performanceId || item.perId || null;
        return itemPerfId === numericId;
      });
      setEmployeePerformances(filteredData);
    } catch (err) {
      setError("获取绩效数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && id !== "undefined") {
      fetchData();
    }
    // eslint-disable-next-line
  }, [id]);

  // 过滤员工绩效数据
  const filteredPerformances = employeePerformances
    .filter((item) => {
      const empName = item.employeeName || "";
      const state = item.state || "";
      const matchesSearch =
        empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "全部" || item.state === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          const scoreA = a.score === "-" ? 0 : parseFloat(a.score);
          const scoreB = b.score === "-" ? 0 : parseFloat(b.score);
          return scoreB - scoreA;
        case "name":
          return (a.employeeName || "").localeCompare(b.employeeName || "");
        default:
          return 0;
      }
    });

  // 分页
  const totalItems = filteredPerformances.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredPerformances.slice(startIndex, endIndex);

  // 状态徽章
  const getStatusBadge = (status) => {
    switch (status) {
      case "已完成":
        return {
          variant: "outline",
          className: "border-green-200 text-green-700",
          icon: <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />,
        };
      case "未完成":
        return {
          variant: "outline",
          className: "border-amber-200 text-amber-700",
          icon: <AlertCircle className="mr-1 h-4 w-4 text-amber-500" />,
        };
      default:
        return {
          variant: "outline",
          className: "border-gray-200 text-gray-700",
          icon: null,
        };
    }
  };

  // 事件处理
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    const newTotalPages = Math.ceil(filteredPerformances.length / newPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };
  const handleBack = () => router.back();
  const handleAddEmployeePerformance = () => {
    setSelectedEmployeePerformance(null);
    setIsEmployeePerformanceFormOpen(true);
  };
  const handleEditEmployeePerformance = (employeePerformance) => {
    setSelectedEmployeePerformance({
      ...employeePerformance,
      performanceId: parseInt(id),
    });
    setIsEmployeePerformanceFormOpen(true);
  };
  const handleDeleteEmployeePerformance = async (id) => {
    if (window.confirm("确定要删除该绩效评估吗？")) {
      try {
        await deleteEmployeePerformance(id);
        fetchData();
      } catch {
        alert("删除失败，请稍后重试");
      }
    }
  };
  const handleFormSuccess = () => {
    setIsEmployeePerformanceFormOpen(false);
    fetchData();
  };
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "-";
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch {
      return dateString || "-";
    }
  };

  // 统计
  const completedCount = employeePerformances.filter(
    (item) => item.state === "已完成"
  ).length;
  const avgScore =
    employeePerformances.length > 0
      ? (
          employeePerformances
            .filter(
              (item) =>
                item.score !== "-" &&
                item.score !== undefined &&
                item.score !== null
            )
            .reduce((sum, item) => sum + parseFloat(item.score || 0), 0) /
          employeePerformances.filter(
            (item) =>
              item.score !== "-" &&
              item.score !== undefined &&
              item.score !== null
          ).length
        ).toFixed(1)
      : "-";

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      {/* 顶部标题和操作 */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="border border-gray-200"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {loading ? "加载中..." : performance?.name || "绩效考核详情"}
            </h1>
            <p className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="h-3 w-3" />
              {loading
                ? ""
                : `${formatDate(performance?.startDate)} - ${formatDate(performance?.endDate)}`}
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddEmployeePerformance}
          className="bg-primary text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> 添加
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="border bg-white">
          <CardContent className="flex flex-col items-center px-4 py-3">
            <span className="text-xs text-gray-500">员工数</span>
            <span className="text-lg font-bold text-gray-900">
              {employeePerformances.length}
            </span>
          </CardContent>
        </Card>
        <Card className="border bg-white">
          <CardContent className="flex flex-col items-center px-4 py-3">
            <span className="text-xs text-gray-500">完成率</span>
            <span className="text-lg font-bold text-gray-900">
              {employeePerformances.length > 0
                ? `${Math.round((completedCount / employeePerformances.length) * 100)}%`
                : "0%"}
            </span>
          </CardContent>
        </Card>
        <Card className="border bg-white">
          <CardContent className="flex flex-col items-center px-4 py-3">
            <span className="text-xs text-gray-500">平均分</span>
            <span className="text-lg font-bold text-gray-900">{avgScore}</span>
          </CardContent>
        </Card>
      </div>

      {/* 搜索/筛选/排序 */}
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <div className="relative w-full sm:w-64">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="搜索员工姓名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 border-gray-200 pl-9 text-sm"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="h-9 w-28 border-gray-200 text-sm">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部">全部</SelectItem>
            <SelectItem value="未完成">未完成</SelectItem>
            <SelectItem value="已完成">已完成</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="h-9 w-28 border-gray-200 text-sm">
            <SelectValue placeholder="排序" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">默认</SelectItem>
            <SelectItem value="score">分数</SelectItem>
            <SelectItem value="name">姓名</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 员工绩效表格 */}
      <Card className="border bg-white">
        <CardHeader className="border-b px-4 py-2">
          <CardTitle className="text-base font-semibold text-gray-900">
            员工绩效列表
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">加载中...</span>
            </div>
          ) : error ? (
            <div className="flex h-40 items-center justify-center text-red-500">
              <AlertCircle className="mr-2 h-6 w-6" />
              <span>{error}</span>
            </div>
          ) : currentPageData.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-gray-400">
              <User className="mb-2 h-10 w-10 opacity-20" />
              <p className="text-base font-medium">暂无数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>职位</TableHead>
                    <TableHead>评分</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>评估人</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.map((item) => (
                    <TableRow
                      key={
                        item.id ||
                        `emp-perf-${item.employeeId}-${item.performanceId}`
                      }
                    >
                      <TableCell>{item.employeeName}</TableCell>
                      <TableCell>{item.department || "-"}</TableCell>
                      <TableCell>{item.position || "-"}</TableCell>
                      <TableCell>{item.score || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadge(item.state).variant}
                          className={
                            getStatusBadge(item.state).className +
                            " px-2 py-0.5"
                          }
                        >
                          {getStatusBadge(item.state).icon}
                          {item.state}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.approverName || "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleEditEmployeePerformance(item)
                              }
                            >
                              <FileEdit className="mr-2 h-4 w-4 text-gray-500" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleDeleteEmployeePerformance(item.id)
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除
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
        <CardFooter className="flex items-center justify-between border-t bg-gray-50 px-4 py-2">
          <div className="text-xs text-gray-500">共 {totalItems} 条</div>
          <div className="flex items-center gap-4">
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-16 border-gray-200 text-xs">
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardFooter>
      </Card>

      {/* 表单抽屉 */}
      <Sheet
        open={isEmployeePerformanceFormOpen}
        onOpenChange={setIsEmployeePerformanceFormOpen}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <User className="text-primary h-5 w-5" />
              {selectedEmployeePerformance ? "编辑绩效" : "添加绩效"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-2 overflow-y-auto h-[calc(100vh-80px)]">
            <EmployeePerformanceForm
              employeePerformance={selectedEmployeePerformance}
              performanceId={parseInt(id)}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsEmployeePerformanceFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
