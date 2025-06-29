'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  Trash2,
  Loader2,
  User,
  Calendar,
  Briefcase,
  Users,
  BookOpen
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Pagination } from '@/components/ui/pagination';
import { format } from 'date-fns';
import { getProjectById } from '@/lib/services/projectService';
import { getEmployeeProjectsByProjectId, deleteEmployeeProject } from '@/lib/services/projectService';
import EmployeeProjectForm from '@/components/hr/EmployeeProjectForm';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 项目数据
  const [project, setProject] = useState(null);
  const [employeeProjects, setEmployeeProjects] = useState([]);
  
  // 表单状态
  const [isEmployeeProjectFormOpen, setIsEmployeeProjectFormOpen] = useState(false);
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
      if (!id || id === 'undefined') {
        setError('无效的项目ID');
        return;
      }
      
      // 获取项目详情
      const projectData = await getProjectById(id);
      setProject(projectData);
      console.log('获取到的项目详情:', projectData);
      
      // 获取该项目下的所有员工
      const employeeProjectData = await getEmployeeProjectsByProjectId(id);
      setEmployeeProjects(employeeProjectData);
      console.log('获取到的员工项目数据:', employeeProjectData);
      
    } catch (err) {
      console.error('获取项目数据失败:', err);
      setError('获取项目数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchData();
    }
  }, [id]);

  // 过滤员工项目数据
  const filteredEmployeeProjects = employeeProjects.filter((item) => {
    const empName = item.employeeName || '';
    const role = item.role || '';
    
    return empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           role.toLowerCase().includes(searchTerm.toLowerCase());
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
    const newTotalPages = Math.ceil(filteredEmployeeProjects.length / newPageSize);
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
      projectId: parseInt(id)  // 确保编辑时也设置正确的项目ID
    });
    setIsEmployeeProjectFormOpen(true);
  };

  // 处理删除员工项目记录
  const handleDeleteEmployeeProject = async (id) => {
    if (window.confirm('确定要删除该员工项目记录吗？此操作无法撤销。')) {
      try {
        await deleteEmployeeProject(id);
        // 删除成功后更新列表
        fetchData();
      } catch (err) {
        console.error('删除员工项目记录失败:', err);
        alert('删除员工项目记录失败，请稍后重试');
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
      if (!dateString) return '-';
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString || '-';
    }
  };

  // 计算平均能力分数
  const calculateAvgScore = (field) => {
    if (!employeeProjects || employeeProjects.length === 0) return '-';
    
    const sum = employeeProjects.reduce((acc, item) => {
      const score = parseFloat(item[field] || 0);
      return acc + (isNaN(score) ? 0 : score);
    }, 0);
    
    return (sum / employeeProjects.length).toFixed(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack} className="border-blue-200 hover:bg-blue-50">
            <ArrowLeft className="h-4 w-4 text-blue-600" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">
              {loading ? '加载中...' : project?.name || '项目详情'}
            </h1>
            <p className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
              {loading ? '' : `${formatDate(project?.startDate)} - ${formatDate(project?.endDate || '进行中')}`}
            </p>
          </div>
        </div>
        <Button onClick={handleAddEmployeeProject} className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white">
          <Plus className="mr-2 h-4 w-4" /> 添加项目成员
        </Button>
      </div>

      {/* 项目信息卡片 */}
      {!loading && project && (
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-blue-700">项目状态</p>
                <div className="mt-2 flex items-center">
                  <Badge className={
                    project.state === '已完成' ? 'bg-green-100 text-green-800 border-green-300' :
                    project.state === '进行中' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                    'bg-amber-100 text-amber-800 border-amber-300'
                  }>
                    {project.state}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">项目负责人</p>
                <div className="mt-2 flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{project.leaderName || '未指定'}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">项目成员</p>
                <div className="mt-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{employeeProjects.length} 名成员</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">创建时间</p>
                <div className="mt-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
            {project.description && (
              <div className="mt-6">
                <p className="text-sm font-medium text-blue-700">项目描述</p>
                <p className="mt-2 text-gray-700">{project.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 项目能力统计卡片 */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-sm font-medium text-blue-800">专业能力</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">{calculateAvgScore('professionalAbility')}</div>
            <p className="text-xs text-muted-foreground">团队平均分</p>
          </CardContent>
        </Card>
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-sm font-medium text-blue-800">管理能力</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">{calculateAvgScore('managementAbility')}</div>
            <p className="text-xs text-muted-foreground">团队平均分</p>
          </CardContent>
        </Card>
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-sm font-medium text-blue-800">合作能力</CardTitle>
            <User className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">{calculateAvgScore('cooperationAbility')}</div>
            <p className="text-xs text-muted-foreground">团队平均分</p>
          </CardContent>
        </Card>
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-sm font-medium text-blue-800">创新能力</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">{calculateAvgScore('innovativeAbility')}</div>
            <p className="text-xs text-muted-foreground">团队平均分</p>
          </CardContent>
        </Card>
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <CardTitle className="text-sm font-medium text-blue-800">学习能力</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-700">{calculateAvgScore('learningAbility')}</div>
            <p className="text-xs text-muted-foreground">团队平均分</p>
          </CardContent>
        </Card>
      </div>

      {/* 搜索 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 h-4 w-4" />
          <Input
            placeholder="搜索团队成员..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 项目成员列表 */}
      <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
          <CardTitle className="text-blue-800">项目团队成员</CardTitle>
          <CardDescription>
            查看和管理该项目的所有团队成员及其表现
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2">加载中...</span>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-60 text-red-500">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>{error}</span>
            </div>
          ) : currentPageData.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-60 text-muted-foreground">
              <Users className="h-16 w-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">暂无项目成员数据</p>
              <p className="text-sm">点击"添加项目成员"按钮添加团队成员</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-blue-50">
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
                    <TableRow key={item.id} className="hover:bg-blue-50 transition-colors">
                      <TableCell className="font-medium">{item.employeeName}</TableCell>
                      <TableCell>{item.role || '-'}</TableCell>
                      <TableCell className="font-semibold">{item.professionalAbility || '-'}</TableCell>
                      <TableCell className="font-semibold">{item.managementAbility || '-'}</TableCell>
                      <TableCell className="font-semibold">{item.cooperationAbility || '-'}</TableCell>
                      <TableCell className="font-semibold">{item.innovativeAbility || '-'}</TableCell>
                      <TableCell className="font-semibold">{item.learningAbility || '-'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-blue-100">
                              <span className="sr-only">操作菜单</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>操作</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditEmployeeProject(item)} className="hover:bg-blue-50 cursor-pointer">
                              <FileEdit className="mr-2 h-4 w-4 text-blue-600" />
                              编辑记录
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer" onClick={() => handleDeleteEmployeeProject(item.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              删除记录
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
        <CardFooter className="flex items-center justify-between border-t border-blue-100 bg-gradient-to-r from-white to-blue-50 rounded-b-xl">
          <div className="text-sm text-muted-foreground">
            共 {totalItems} 条记录
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">每页显示</p>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px] border-blue-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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
      </Card>

      {/* 项目成员表单 */}
      <Sheet open={isEmployeeProjectFormOpen} onOpenChange={setIsEmployeeProjectFormOpen}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2 mb-2 bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-md">
              <User className="h-6 w-6 text-blue-600" />
              {selectedEmployeeProject ? '编辑项目成员' : '添加项目成员'}
            </SheetTitle>
          </SheetHeader>
          <div className="py-4 overflow-y-auto">
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