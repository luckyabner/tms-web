"use client";

import EmployeePerformanceForm from "@/components/hr/EmployeePerformanceForm";
import PerformanceForm from "@/components/hr/PerformanceForm";
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
import { Pagination, PaginationInfo } from "@/components/ui/pagination";
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
  deletePerformance,
  getAllEmployeePerformances,
  getAllPerformances,
} from "@/lib/services/performanceService";
import { format } from "date-fns";
import {
  AlertCircle,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Eye,
  FileEdit,
  Filter,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PerformancePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("全部");
  const [sortBy, setSortBy] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 绩效数据
  const [performances, setPerformances] = useState([]);

  // 表单状态
  const [isPerformanceFormOpen, setIsPerformanceFormOpen] = useState(false);
  const [selectedPerformance, setSelectedPerformance] = useState(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 获取绩效数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 获取绩效考核列表
      let performanceData = [];
      try {
        performanceData = await getAllPerformances();
        setPerformances(performanceData);
        console.log("获取到的绩效考核数据:", performanceData);
      } catch (perfError) {
        console.error("获取绩效考核列表失败:", perfError);
        setError((prev) => prev || "获取绩效考核数据失败");
      }
    } catch (err) {
      console.error("获取绩效数据失败:", err);
      setError("获取绩效数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 过滤绩效数据
  const filteredPerformances = performances
    .filter((item) => {
      const perfName = item.name || "";
      const state = item.state || "";

      const matchesSearch =
        perfName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "全部" || item.state === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "endDate":
          return (
            new Date(b.endDate || b.end_date || 0) -
            new Date(a.endDate || a.end_date || 0)
          );
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

  useEffect(() => {
    // 日志输出当前获取到的绩效数据，检查id字段
    console.log("当前绩效数据:", performances);
    if (performances.length > 0) {
      performances.forEach((perf, index) => {
        console.log(`绩效[${index}] - id:${perf.id}, name:${perf.name}`);
      });
    }
  }, [performances]);

  // 计算分页数据
  const totalItems = filteredPerformances.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredPerformances.slice(startIndex, endIndex);

  // 获取状态对应的图标和颜色
  const getStatusBadge = (status) => {
    switch (status) {
      case "已结束":
        return {
          variant: "outline",
          className: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />,
        };
      case "进行中":
        return {
          variant: "outline",
          className: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Clock className="mr-1 h-4 w-4 text-blue-500" />,
        };
      case "未开始":
        return {
          variant: "outline",
          className: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <AlertCircle className="mr-1 h-4 w-4 text-amber-500" />,
        };
      default:
        return {
          variant: "outline",
          className: "bg-gray-50 text-gray-700 border-gray-200",
          icon: null,
        };
    }
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
    const newTotalPages = Math.ceil(filteredPerformances.length / newPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  // 跳转到绩效详情页面
  const handleViewDetails = (id) => {
    console.log("尝试跳转到绩效详情，原始ID:", id);

    // 确保id不是undefined或null
    if (!id) {
      console.error("无效的绩效考核ID:", id);
      alert("无法查看详情：无效的绩效考核ID");
      return;
    }

    // 确保id是数字或可以解析为数字的字符串
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
      console.error("绩效考核ID不是有效数字:", id);
      alert("无法查看详情：无效的绩效考核ID格式");
      return;
    }

    console.log("跳转到绩效详情页，处理后ID:", numericId);
    router.push(`/performance/${numericId}`);
  };

  // 处理添加绩效考核
  const handleAddPerformance = () => {
    setSelectedPerformance(null);
    setIsPerformanceFormOpen(true);
  };

  // 处理编辑绩效考核
  const handleEditPerformance = (performance) => {
    setSelectedPerformance(performance);
    setIsPerformanceFormOpen(true);
  };

  // 处理删除绩效考核
  const handleDeletePerformance = async (id) => {
    if (window.confirm("确定要删除该绩效考核吗？此操作无法撤销。")) {
      try {
        await deletePerformance(id);
        // 删除成功后更新列表
        fetchData();
      } catch (err) {
        console.error("删除绩效考核失败:", err);
        alert("删除绩效考核失败，请稍后重试");
      }
    }
  };

  // 处理表单成功提交
  const handleFormSuccess = () => {
    setIsPerformanceFormOpen(false);
    fetchData();
  };

  // 格式化日期
  const formatDate = (dateString) => {
    try {
      if (!dateString) return "-";
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (error) {
      return dateString || "-";
    }
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* 页面标题 */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-primary text-2xl font-semibold">绩效考核管理</h1>
          <p className="text-muted-foreground text-sm">
            管理公司绩效考核计划和员工评估
          </p>
        </div>
        <Button
          onClick={handleAddPerformance}
          className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white shadow-none"
        >
          <Plus className="mr-2 h-4 w-4" /> 新建考核
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              总考核计划
            </CardTitle>
            <Award className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold">{performances.length}</div>
          </CardContent>
        </Card>
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              进行中
            </CardTitle>
            <Clock className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold">
              {performances.filter((p) => p.state === "进行中").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              未开始
            </CardTitle>
            <Calendar className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold">
              {performances.filter((p) => p.state === "未开始").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选区 */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="relative w-64">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="搜索绩效考核..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-muted h-9 rounded-md pl-9"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="border-muted h-9 w-32 rounded-md">
            <SelectValue placeholder="状态筛选" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="全部">全部状态</SelectItem>
            <SelectItem value="未开始">未开始</SelectItem>
            <SelectItem value="进行中">进行中</SelectItem>
            <SelectItem value="已结束">已结束</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="border-muted h-9 w-32 rounded-md">
            <SelectValue placeholder="排序方式" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">默认排序</SelectItem>
            <SelectItem value="endDate">结束日期</SelectItem>
            <SelectItem value="name">考核名称</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 绩效考核列表 */}
      <Card className="border-muted bg-background rounded-lg border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            绩效考核列表
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm">加载中...</span>
            </div>
          ) : error ? (
            <div className="text-destructive flex h-48 items-center justify-center">
              <AlertCircle className="mr-2 h-6 w-6" />
              <span>{error}</span>
            </div>
          ) : currentPageData.length === 0 ? (
            <div className="text-muted-foreground flex h-48 flex-col items-center justify-center">
              <Award className="mb-2 h-10 w-10 opacity-20" />
              <p className="text-base font-medium">暂无绩效考核数据</p>
              <p className="text-xs">点击“新建考核”创建第一个计划</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>考核名称</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.map((performance, index) => (
                    <TableRow
                      key={
                        performance.id ||
                        `perf-${performance.name}-${performance.startDate}`
                      }
                      className="hover:bg-muted/30 group cursor-pointer"
                      onClick={() => handleViewDetails(performance.id)}
                    >
                      <TableCell className="font-medium">
                        {performance.name}
                      </TableCell>
                      <TableCell>{formatDate(performance.startDate)}</TableCell>
                      <TableCell>{formatDate(performance.endDate)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadge(performance.state).variant}
                          className={
                            getStatusBadge(performance.state).className +
                            " px-2 py-0.5 text-xs font-normal"
                          }
                        >
                          {getStatusBadge(performance.state).icon}
                          {performance.state}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(performance.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(performance.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPerformance(performance);
                            }}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePerformance(performance.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-2">
          <div className="text-muted-foreground text-xs">
            共 {totalItems} 条
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="border-muted h-8 w-16 rounded-md text-xs">
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

      {/* 绩效考核表单 */}
      <Sheet
        open={isPerformanceFormOpen}
        onOpenChange={setIsPerformanceFormOpen}
      >
        <SheetContent className="p-0 sm:max-w-md">
          <SheetHeader className="border-muted border-b px-6 py-4">
            <SheetTitle className="text-primary flex items-center gap-2 text-lg font-semibold">
              <Award className="text-primary h-5 w-5" />
              {selectedPerformance ? "编辑绩效考核" : "新建绩效考核"}
            </SheetTitle>
          </SheetHeader>
          <div className="px-6 py-6">
            <PerformanceForm
              performance={selectedPerformance}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsPerformanceFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
