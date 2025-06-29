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
    <div className="container mx-auto space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-3xl font-bold text-transparent">
            项目管理
          </h1>
          <p className="text-muted-foreground">管理公司项目和团队分配</p>
        </div>
        <Button
          onClick={handleAddProject}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
        >
          <Plus className="mr-2 h-4 w-4" /> 添加项目
        </Button>
      </div>

      {/* 项目统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总项目数</CardTitle>
            <Briefcase className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-muted-foreground text-xs">所有项目数量</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中项目</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.state === "进行中").length}
            </div>
            <p className="text-muted-foreground text-xs">当前正在进行的项目</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成项目</CardTitle>
            <CheckCircle2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.filter((p) => p.state === "已完成").length}
            </div>
            <p className="text-muted-foreground text-xs">已完成的项目数量</p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="搜索项目名称或负责人..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
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
      <Card>
        <CardHeader>
          <CardTitle>项目列表</CardTitle>
          <CardDescription>查看和管理所有项目</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="text-muted-foreground ml-2">加载中...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
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
                    <TableRow key={project.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">{project.name}</div>
                      </TableCell>
                      <TableCell>
                        {project.leaderName ? (
                          <div className="flex items-center space-x-2">
                            <User className="text-muted-foreground h-4 w-4" />
                            <span>{project.leaderName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">未指定</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(project.startDate)}</TableCell>
                      <TableCell>{formatDate(project.endDate)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadge(project.state).variant}
                          className={getStatusBadge(project.state).className}
                        >
                          {getStatusBadge(project.state).icon}
                          {project.state}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">打开菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewProject(project.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              查看详情
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditProject(project)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              编辑项目
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProject(project.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除项目
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {!loading && !error && filteredProjects.length > 0 && (
          <CardFooter className="flex flex-col items-center justify-between border-t px-6 py-4 sm:flex-row">
            <PaginationInfo
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={totalItems}
              className="mb-4 sm:mb-0"
            />
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">每页显示</p>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="h-8 w-[70px]">
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
              </div>
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
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="mb-2 flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-50 to-blue-100 p-2 text-2xl font-bold text-blue-800">
              <Briefcase className="h-6 w-6 text-blue-600" />
              {selectedProject ? "编辑项目" : "添加新项目"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-0">
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
