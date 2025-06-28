import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEmployeeDepartmentHistory } from "@/lib/services/departmentService";
import { getEmployeeById } from "@/lib/services/employeeService";
import {
  BarChart3,
  Building,
  CalendarDays,
  Clock,
  GraduationCap,
  MapPin,
  Phone,
  Target,
  TrendingUp,
  User,
} from "lucide-react";

export default async function EmployeeDetailPage({ params }) {
  const { id } = params;
  const employee = await getEmployeeById(id);
  const departmentHistory = await getEmployeeDepartmentHistory(id);

  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 计算工龄
  const calculateWorkYears = (hireDate) => {
    const years = new Date().getFullYear() - new Date(hireDate).getFullYear();
    return years;
  };

  // 状态颜色映射
  const getStatusColor = (status) => {
    switch (status) {
      case "在职":
        return "success";
      case "离职":
        return "destructive";
      case "已通过":
        return "success";
      case "待审核":
        return "warning";
      case "已拒绝":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // 员工类型颜色映射
  const getEmpTypeColor = (empType) => {
    switch (empType) {
      case "管理员":
        return "purple";
      case "HR":
        return "blue";
      case "部门负责人":
        return "warning";
      case "普通用户":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">员工详情</h1>
          <p className="text-muted-foreground">查看员工的详细信息和历史记录</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusColor(employee.status)}>
            {employee.status}
          </Badge>
          <Badge variant={getEmpTypeColor(employee.empType)}>
            {employee.empType}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 基本信息卡片 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                基本信息
              </CardTitle>
              <CardDescription>员工的基础个人信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 头像占位 */}
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                  {employee.name.charAt(0)}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold">{employee.name}</h3>
                <p className="text-muted-foreground">{employee.position}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">性别: {employee.gender}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">{employee.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarDays className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    生日: {formatDate(employee.birthDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    {employee.education} · {employee.school}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-muted-foreground h-4 w-4" />
                  <span className="text-sm">
                    入职: {formatDate(employee.hireDate)} (
                    {calculateWorkYears(employee.hireDate)}年)
                  </span>
                </div>
              </div>

              {employee.description && (
                <>
                  <Separator />
                  <div>
                    <h4 className="mb-2 text-sm font-medium">个人描述</h4>
                    <p className="text-muted-foreground text-sm">
                      {employee.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 详细信息和历史记录 */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="department" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="department"
                className="flex items-center gap-2"
              >
                <Building className="h-4 w-4" />
                部门历史
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                绩效历史
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                项目经历
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                数据分析
              </TabsTrigger>
            </TabsList>

            {/* 部门变更历史 */}
            <TabsContent value="department">
              <Card>
                <CardHeader>
                  <CardTitle>部门变更历史</CardTitle>
                  <CardDescription>
                    员工的部门调动和职位变更记录
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentHistory.map((record, index) => (
                      <div
                        key={record.id}
                        className="flex items-start space-x-4 rounded-lg border p-4"
                      >
                        <div className="flex-shrink-0">
                          <div className="mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
                          {index < departmentHistory.length - 1 && (
                            <div className="mt-2 ml-1 h-16 w-0.5 bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{record.position}</h4>
                            <Badge variant={getStatusColor(record.state)}>
                              {record.state}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {record.description}
                          </p>
                          <div className="text-muted-foreground flex items-center gap-4 text-xs">
                            <span>创建: {formatDate(record.createdAt)}</span>
                            <span>更新: {formatDate(record.updatedAt)}</span>
                            {record.isCurrent && (
                              <Badge variant="success" className="text-xs">
                                当前职位
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 绩效历史 - 预留区域 */}
            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>绩效评估历史</CardTitle>
                  <CardDescription>
                    员工的绩效评估记录和趋势分析
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <div className="space-y-2 text-center">
                      <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="font-medium text-gray-500">
                        绩效数据开发中
                      </p>
                      <p className="text-sm text-gray-400">
                        将展示绩效评分趋势图、评估记录时间线等
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 项目经历 - 预留区域 */}
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>项目参与经历</CardTitle>
                  <CardDescription>
                    员工参与的项目列表和贡献度分析
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    <div className="space-y-2 text-center">
                      <Target className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="font-medium text-gray-500">
                        项目数据开发中
                      </p>
                      <p className="text-sm text-gray-400">
                        将展示项目参与时间线、角色分工、贡献度等
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 数据分析 - 预留区域 */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>数据可视化分析</CardTitle>
                  <CardDescription>
                    员工综合数据的图表化展示和分析
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* 工作年限统计 */}
                    <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-blue-900">工作年限</h4>
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {calculateWorkYears(employee.hireDate)} 年
                      </div>
                      <p className="text-sm text-blue-600">
                        入职于 {new Date(employee.hireDate).getFullYear()} 年
                      </p>
                    </div>

                    {/* 部门变更次数 */}
                    <div className="rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-green-900">部门变更</h4>
                        <Building className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {departmentHistory.length} 次
                      </div>
                      <p className="text-sm text-green-600">
                        当前: {employee.position}
                      </p>
                    </div>

                    {/* 预留图表区域 */}
                    <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 md:col-span-2">
                      <div className="space-y-2 text-center">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="font-medium text-gray-500">
                          详细图表开发中
                        </p>
                        <p className="text-sm text-gray-400">
                          将展示绩效趋势图、项目参与度、能力雷达图等
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
