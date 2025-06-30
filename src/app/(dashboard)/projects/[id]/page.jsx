"use client";

import EmployeeProjectForm from "@/components/hr/EmployeeProjectForm";
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
  deleteEmployeeProject,
  getEmployeeProjectsByProjectId,
  getProjectById,
} from "@/lib/services/projectService";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Eye,
  FileEdit,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 项目数据
  const [project, setProject] = useState(null);
  const [employeeProjects, setEmployeeProjects] = useState([]);

  // 表单状态
  const [isEmployeeProjectFormOpen, setIsEmployeeProjectFormOpen] =
    useState(false);
  const [selectedEmployeeProject, setSelectedEmployeeProject] = useState(null);

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 获取项目数据
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 确保id是有效的
      if (!id || id === "undefined") {
        setError("无效的项目ID");
        return;
      }

      // 获取项目详情
      const projectData = await getProjectById(id);
      setProject(projectData);
      console.log("获取到的项目详情:", projectData);

      // 获取该项目下的所有员工
      const employeeProjectData = await getEmployeeProjectsByProjectId(id);
      setEmployeeProjects(employeeProjectData);
      console.log("获取到的员工项目数据:", employeeProjectData);
    } catch (err) {
      console.error("获取项目数据失败:", err);
      setError("获取项目数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && id !== "undefined") {
      fetchData();
    }
  }, [id]);

  // 过滤员工项目数据
  const filteredEmployeeProjects = employeeProjects.filter((item) => {
    const empName = item.employeeName || "";
    const role = item.role || "";

    return (
      empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // 计算分页数据
  const totalItems = filteredEmployeeProjects.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = filteredEmployeeProjects.slice(startIndex, endIndex);

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
    const newTotalPages = Math.ceil(
      filteredEmployeeProjects.length / newPageSize
    );
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages));
    }
  };

  // 处理返回
  const handleBack = () => {
    router.back();
  };

  // 处理添加员工到项目
  const handleAddEmployeeProject = () => {
    setSelectedEmployeeProject(null);
    setIsEmployeeProjectFormOpen(true);
  };

  // 处理编辑员工项目记录
  const handleEditEmployeeProject = (employeeProject) => {
    setSelectedEmployeeProject({
      ...employeeProject,
      projectId: parseInt(id), // 确保编辑时也设置正确的项目ID
    });
    setIsEmployeeProjectFormOpen(true);
  };

  // 处理删除员工项目记录
  const handleDeleteEmployeeProject = async (id) => {
    if (window.confirm("确定要删除该员工项目记录吗？此操作无法撤销。")) {
      try {
        await deleteEmployeeProject(id);
        // 删除成功后更新列表
        fetchData();
      } catch (err) {
        console.error("删除员工项目记录失败:", err);
        alert("删除员工项目记录失败，请稍后重试");
      }
    }
  };

  // 处理表单成功提交
  const handleFormSuccess = () => {
    setIsEmployeeProjectFormOpen(false);
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

  // 计算平均能力分数
  const calculateAvgScore = (field) => {
    if (!employeeProjects || employeeProjects.length === 0) return "-";

    const sum = employeeProjects.reduce((acc, item) => {
      const score = parseFloat(item[field] || 0);
      return acc + (isNaN(score) ? 0 : score);
    }, 0);

    return (sum / employeeProjects.length).toFixed(1);
  };

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* 页面标题 */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="border-muted bg-background hover:bg-muted/50 border"
          >
            <ArrowLeft className="text-primary h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-primary text-2xl font-semibold">
              {loading ? "加载中..." : project?.name || "项目详情"}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              <Calendar className="text-primary mr-1 h-4 w-4" />
              {loading
                ? ""
                : `${formatDate(project?.startDate)} - ${formatDate(project?.endDate || "进行中")}`}
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddEmployeeProject}
          className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-white shadow-none"
        >
          <Plus className="mr-2 h-4 w-4" /> 新增成员
        </Button>
      </div>

      {/* 项目信息卡片 */}
      {!loading && project && (
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  项目状态
                </p>
                <div className="mt-2 flex items-center">
                  <Badge
                    className={
                      project.state === "已完成"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : project.state === "进行中"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                    }
                  >
                    {project.state}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  项目负责人
                </p>
                <div className="mt-2 flex items-center">
                  <User className="text-primary mr-2 h-4 w-4" />
                  <span>{project.leaderName || "未指定"}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  项目成员
                </p>
                <div className="mt-2 flex items-center">
                  <Users className="text-primary mr-2 h-4 w-4" />
                  <span>{employeeProjects.length} 名成员</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  创建时间
                </p>
                <div className="mt-2 flex items-center">
                  <Calendar className="text-primary mr-2 h-4 w-4" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
            {project.description && (
              <div className="mt-6">
                <p className="text-muted-foreground text-xs font-medium">
                  项目描述
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  {project.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 项目能力统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              专业能力
            </CardTitle>
            <Briefcase className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-primary text-xl font-bold">
              {calculateAvgScore("professionalAbility")}
            </div>
            <p className="text-muted-foreground text-xs">团队平均分</p>
          </CardContent>
        </Card>
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              管理能力
            </CardTitle>
            <Users className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-primary text-xl font-bold">
              {calculateAvgScore("managementAbility")}
            </div>
            <p className="text-muted-foreground text-xs">团队平均分</p>
          </CardContent>
        </Card>
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              合作能力
            </CardTitle>
            <User className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-primary text-xl font-bold">
              {calculateAvgScore("cooperationAbility")}
            </div>
            <p className="text-muted-foreground text-xs">团队平均分</p>
          </CardContent>
        </Card>
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              创新能力
            </CardTitle>
            <AlertCircle className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-primary text-xl font-bold">
              {calculateAvgScore("innovativeAbility")}
            </div>
            <p className="text-muted-foreground text-xs">团队平均分</p>
          </CardContent>
        </Card>
        <Card className="border-muted bg-background rounded-lg border shadow-none">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-xs font-medium">
              学习能力
            </CardTitle>
            <BookOpen className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-primary text-xl font-bold">
              {calculateAvgScore("learningAbility")}
            </div>
            <p className="text-muted-foreground text-xs">团队平均分</p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索 */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="relative w-64">
          <Search className="text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="搜索团队成员..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-muted h-9 rounded-md pl-9"
          />
        </div>
      </div>

      {/* 项目成员列表 */}
      <Card className="border-muted bg-background rounded-lg border shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-primary text-base font-semibold">
            项目团队成员
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs">
            查看和管理该项目的所有团队成员及其表现
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="text-muted-foreground flex h-60 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm">加载中...</span>
            </div>
          ) : error ? (
            <div className="text-destructive flex h-60 items-center justify-center">
              <AlertCircle className="mr-2 h-6 w-6" />
              <span>{error}</span>
            </div>
          ) : currentPageData.length === 0 ? (
            <div className="text-muted-foreground flex h-60 flex-col items-center justify-center">
              <Users className="mb-4 h-12 w-12 opacity-20" />
              <p className="text-base font-medium">暂无项目成员数据</p>
              <p className="text-xs">点击“新增成员”按钮添加团队成员</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>成员姓名</TableHead>
                    <TableHead>担任角色</TableHead>
                    <TableHead>专业能力</TableHead>
                    <TableHead>管理能力</TableHead>
                    <TableHead>合作能力</TableHead>
                    <TableHead>创新能力</TableHead>
                    <TableHead>学习能力</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentPageData.map((item) => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/30 group cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        {item.employeeName}
                      </TableCell>
                      <TableCell>{item.role || "-"}</TableCell>
                      <TableCell className="font-semibold">
                        {item.professionalAbility || "-"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {item.managementAbility || "-"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {item.cooperationAbility || "-"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {item.innovativeAbility || "-"}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {item.learningAbility || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary h-8 w-8 p-0"
                            onClick={() => handleEditEmployeeProject(item)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            onClick={() => handleDeleteEmployeeProject(item.id)}
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
            共 {totalItems} 条记录
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

      {/* 项目成员表单 */}
      <Sheet
        open={isEmployeeProjectFormOpen}
        onOpenChange={setIsEmployeeProjectFormOpen}
      >
        <SheetContent className="p-0 sm:max-w-md">
          <SheetHeader className="border-muted border-b px-6 py-4">
            <SheetTitle className="text-primary flex items-center gap-2 text-lg font-semibold">
              <User className="text-primary h-5 w-5" />
              {selectedEmployeeProject ? "编辑项目成员" : "新增项目成员"}
            </SheetTitle>
          </SheetHeader>
          <div className="px-6 py-6">
            <EmployeeProjectForm
              employeeProject={selectedEmployeeProject}
              projectId={parseInt(id)}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsEmployeeProjectFormOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
