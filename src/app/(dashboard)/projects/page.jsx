"use client";

import ProjectForm from "@/components/hr/ProjectForm";
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
import { deleteProject, getAllProjects } from "@/lib/services/projectService";
import { format } from "date-fns";
import {
    Briefcase,
    Calendar,
    CheckCircle2,
    Eye,
    Loader2,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
    User,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function HrProjectsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("全部");

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 每页显示5条数据

  // 获取项目数据
  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log("正在获取项目数据...");
      const data = await getAllProjects();
      console.log("获取到的项目数据:", data);

      // 确保data是数组
      if (Array.isArray(data)) {
        setProjects(data);
        console.log(`成功设置${data.length}条项目数据`);
      } else {
        console.error("API返回的不是数组:", data);
        setProjects([]);
        setError("API返回数据格式错误");
      }
    } catch (err) {
      console.error("获取项目数据失败:", err);
      setError("获取项目数据失败，请稍后重试");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 处理删除项目
  const handleDeleteProject = async (id) => {
    if (window.confirm("确定要删除该项目吗？此操作无法撤销。")) {
      try {
        await deleteProject(id);
        // 删除成功后更新列表
        fetchProjects();
      } catch (err) {
        console.error("删除项目失败:", err);
        alert("删除项目失败，请稍后重试");
      }
    }
  };

  // 处理编辑项目
  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  // 处理添加项目
  const handleAddProject = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  // 处理表单成功提交
  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchProjects();
  };

  // 处理页码变化
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 处理每页显示数量变化
  const handlePageSizeChange = (value) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    // 调整当前页码，确保不会超出新的总页数
    const newTotalPages = Math.ceil(filteredProjects.length / newPageSize);
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
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

  // 过滤项目数据
  const filteredProjects = projects.filter((project) => {
    const projectName = project.name || "";
    const leaderName = project.leaderName || "";
    const state = project.state || "";

    const matchesSearch =
      projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leaderName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "全部" || project.state === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // 计算分页数据
  const totalItems = filteredProjects.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentPageData = filteredProjects.slice(startIndex, endIndex);

  // 获取状态对应的图标和颜色
  const getStatusBadge = (status) => {
    switch (status) {
      case "已完成":
        return {
          variant: "outline",
          className: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 className="mr-1 h-4 w-4 text-green-500" />,
        };
      case "进行中":
        return {
          variant: "outline",
          className: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <Calendar className="mr-1 h-4 w-4 text-blue-500" />,
        };
      case "未开始":
        return {
          variant: "outline",
          className: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <Briefcase className="mr-1 h-4 w-4 text-amber-500" />,
        };
      default:
        return {
          variant: "outline",
          className: "bg-gray-50 text-gray-700 border-gray-200",
          icon: null,
        };
    }
  };

  // 查看项目详情
  const handleViewProject = (id) => {
    router.push(`/projects/${id}`);
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* 页面标题 */}
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-primary text-2xl font-semibold">项目管理</h1>
          <p className="text-muted-foreground text-sm">
            管理公司项目和团队分配
          </p>
        </div>
        <Button
          onClick={handleAddProject}
          className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white shadow-none"
        >
          <Plus className="mr-2 h-4 w-4" /> 新建项目
        </Button>
      </div>

      {/* 项目统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              总项目数
            </CardTitle>
            <Briefcase className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              进行中
            </CardTitle>
            <Calendar className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold">
              {projects.filter((p) => p.state === "进行中").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              已完成
            </CardTitle>
            <CheckCircle2 className="text-muted-foreground h-5 w-5" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xl font-bold">
              {projects.filter((p) => p.state === "已完成").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选区 */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="relative w-64">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="搜索项目名称或负责人..."
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
            <SelectItem value="已完成">已完成</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 项目列表 */}
      <Card className="border-muted bg-background rounded-lg border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">项目列表</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="text-muted-foreground flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm">加载中...</span>
            </div>
          ) : error ? (
            <div className="text-destructive flex items-center justify-center py-10">
              <span>{error}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>项目名称</TableHead>
                    <TableHead>项目负责人</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-muted-foreground py-10 text-center"
                      >
                        {filteredProjects.length === 0
                          ? "暂无项目数据"
                          : "没有匹配的搜索结果"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentPageData.map((project) => (
                      <TableRow
                        key={project.id}
                        className="hover:bg-muted/30 group cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {project.name}
                        </TableCell>
                        <TableCell>
                          {project.leaderName ? (
                            <div className="flex items-center gap-2">
                              <User className="text-muted-foreground h-4 w-4" />
                              <span>{project.leaderName}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              未指定
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(project.startDate)}</TableCell>
                        <TableCell>{formatDate(project.endDate)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadge(project.state).variant}
                            className={
                              getStatusBadge(project.state).className +
                              " px-2 py-0.5 text-xs font-normal"
                            }
                          >
                            {getStatusBadge(project.state).icon}
                            {project.state}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
                              onClick={() => handleViewProject(project.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
                              onClick={() => handleEditProject(project)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {!loading && !error && filteredProjects.length > 0 && (
          <CardFooter className="flex items-center justify-between pt-2">
            <PaginationInfo
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              className="text-muted-foreground text-xs"
            />
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
        )}
      </Card>

      {/* 项目表单侧边抽屉 */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="p-0 sm:max-w-md">
          <SheetHeader className="border-muted border-b px-6 py-4">
            <SheetTitle className="text-primary flex items-center gap-2 text-lg font-semibold">
              <Briefcase className="text-primary h-5 w-5" />
              {selectedProject ? "编辑项目" : "新建项目"}
            </SheetTitle>
          </SheetHeader>
          <div className="px-6 py-6 overflow-y-auto h-[calc(100vh-80px)]">
            <ProjectForm
              project={selectedProject}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
