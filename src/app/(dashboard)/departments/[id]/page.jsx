"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import {
  BarChart4,
  Briefcase,
  Building,
  Calendar,
  ChevronLeft,
  Clock,
  Mail,
  Phone,
  TrendingUp,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DepartmentDetailPage({ params }) {
  const departmentId = params.id;
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [parentDepartment, setParentDepartment] = useState(null);
  const [childDepartments, setChildDepartments] = useState([]);

  useEffect(() => {
    fetchDepartmentData();
  }, [departmentId]);

  const fetchDepartmentData = async () => {
    setLoading(true);
    try {
      // 获取部门详情
      const departmentResponse = await api.get(`/departments/${departmentId}`);
      if (departmentResponse.data && departmentResponse.data.data) {
        setDepartment(departmentResponse.data.data);

        // 如果有父部门，获取父部门信息
        if (departmentResponse.data.data.parentId) {
          try {
            const parentResponse = await api.get(
              `/departments/${departmentResponse.data.data.parentId}`
            );
            if (parentResponse.data && parentResponse.data.data) {
              setParentDepartment(parentResponse.data.data);
            }
          } catch (error) {
            console.error("获取父部门信息失败:", error);
          }
        }

        // 获取所有部门，找出子部门
        try {
          const allDepartmentsResponse = await api.get("/departments");
          if (allDepartmentsResponse.data && allDepartmentsResponse.data.data) {
            const children = allDepartmentsResponse.data.data.filter(
              (dept) => dept.parentId === parseInt(departmentId)
            );
            setChildDepartments(children);
          }
        } catch (error) {
          console.error("获取子部门信息失败:", error);
        }
      }

      // 获取部门员工
      const employeesResponse = await api.get(
        `/employee-departments/departments/${departmentId}`
      );
      if (employeesResponse.data && employeesResponse.data.data) {
        // 获取员工详情
        const employeeDetails = [];
        for (const empDept of employeesResponse.data.data) {
          try {
            const empResponse = await api.get(`/employees/${empDept.empId}`);
            if (empResponse.data && empResponse.data.data) {
              employeeDetails.push({
                ...empResponse.data.data,
                position: empDept.position || "未设置职位",
                isSuperior: empDept.superiorId === null,
              });
            }
          } catch (error) {
            console.error(`获取员工 ${empDept.empId} 详情失败:`, error);
          }
        }
        setEmployees(employeeDetails);
      }
    } catch (error) {
      console.error("获取部门数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 获取部门经理
  const getDepartmentManager = () => {
    if (!department || !department.managerId) return null;
    return employees.find((emp) => emp.id === department.managerId);
  };

  // 按职级/角色分组员工
  const groupEmployeesByRole = () => {
    const manager = employees.find((emp) => emp.id === department?.managerId);
    const leaders = employees.filter(
      (emp) =>
        emp.id !== department?.managerId &&
        (emp.position?.includes("经理") ||
          emp.position?.includes("主管") ||
          emp.position?.includes("总监"))
    );
    const regularEmployees = employees.filter(
      (emp) =>
        emp.id !== department?.managerId &&
        !(
          emp.position?.includes("经理") ||
          emp.position?.includes("主管") ||
          emp.position?.includes("总监")
        )
    );

    return {
      manager: manager ? [manager] : [],
      leaders,
      regularEmployees,
    };
  };

  const { manager, leaders, regularEmployees } = groupEmployeesByRole();

  return (
    <div className="container mx-auto max-w-7xl space-y-4 p-4">
      {/* 返回按钮和标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <a href="/departments">
              <ChevronLeft className="h-4 w-4" />
            </a>
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {loading
                ? "加载中..."
                : department
                  ? department.name
                  : "部门详情"}
            </h1>
            <p className="text-muted-foreground text-xs">查看和管理部门信息</p>
          </div>
        </div>
        {department && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              ID: {department.id}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {employees.length} 名员工
            </Badge>
          </div>
        )}
      </div>

      {loading ? (
        // 加载中状态
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
            正在加载部门信息...
          </div>
        </div>
      ) : department ? (
        <>
          {/* 部门基本信息和快速统计 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* 部门基本信息 */}
            <div className="lg:col-span-2">
              <Card className="h-fit">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                      <Building className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {department.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {parentDepartment
                          ? `隶属于 ${parentDepartment.name}`
                          : "顶级部门"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <User className="h-3 w-3" />
                        部门主管
                      </div>
                      <p className="text-sm font-medium">
                        {department.managerId
                          ? getDepartmentManager()?.name ||
                            `ID: ${department.managerId}`
                          : "未指定"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        创建时间
                      </div>
                      <p className="text-sm font-medium">
                        {department.createdAt
                          ? new Date(department.createdAt).toLocaleDateString(
                              "zh-CN"
                            )
                          : "未知"}
                      </p>
                    </div>
                  </div>

                  {department.description && (
                    <div className="space-y-1">
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Briefcase className="h-3 w-3" />
                        部门描述
                      </div>
                      <p className="text-muted-foreground bg-muted/30 rounded-sm p-2 text-xs">
                        {department.description}
                      </p>
                    </div>
                  )}

                  {childDepartments.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Building className="h-3 w-3" />
                        下属部门 ({childDepartments.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {childDepartments.map((child) => (
                          <Badge
                            key={child.id}
                            variant="outline"
                            className="hover:bg-primary hover:text-primary-foreground h-6 cursor-pointer text-xs transition-colors"
                            onClick={() =>
                              (window.location.href = `/executive/departments/${child.id}`)
                            }
                          >
                            {child.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* 数据统计可视化 */}
            <div className="space-y-4">
              {/* 员工分布统计 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    员工分布
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">
                        管理层
                      </span>
                      <span className="text-sm font-medium">
                        {manager.length + leaders.length}
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full rounded-full">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${employees.length > 0 ? ((manager.length + leaders.length) / employees.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">
                        普通员工
                      </span>
                      <span className="text-sm font-medium">
                        {regularEmployees.length}
                      </span>
                    </div>
                    <div className="bg-muted h-2 w-full rounded-full">
                      <div
                        className="bg-primary/60 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${employees.length > 0 ? (regularEmployees.length / employees.length) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="border-t pt-2 text-center">
                    <div className="text-primary text-2xl font-bold">
                      {employees.length}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      总员工数
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 标签页 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid h-9 w-full grid-cols-2">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-1 text-xs"
              >
                <BarChart4 className="h-3 w-3" />
                概览统计
              </TabsTrigger>
              <TabsTrigger
                value="employees"
                className="flex items-center gap-1 text-xs"
              >
                <Users className="h-3 w-3" />
                成员列表
              </TabsTrigger>
            </TabsList>

            {/* 部门概览 */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              {/* 详细统计 */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs">总员工</p>
                        <p className="text-lg font-bold">{employees.length}</p>
                      </div>
                      <Users className="text-muted-foreground h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs">管理层</p>
                        <p className="text-lg font-bold">
                          {manager.length + leaders.length}
                        </p>
                      </div>
                      <User className="text-muted-foreground h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          下属部门
                        </p>
                        <p className="text-lg font-bold">
                          {childDepartments.length}
                        </p>
                      </div>
                      <Building className="text-muted-foreground h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-xs">
                          成立年限
                        </p>
                        <p className="text-lg font-bold">
                          {department.createdAt
                            ? new Date().getFullYear() -
                              new Date(department.createdAt).getFullYear()
                            : "--"}
                        </p>
                      </div>
                      <Clock className="text-muted-foreground h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 组织架构预览 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">组织架构预览</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* 上级部门 */}
                    {parentDepartment && (
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        <div className="bg-muted h-2 w-2 rounded-full"></div>
                        上级: {parentDepartment.name}
                      </div>
                    )}

                    {/* 当前部门 */}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <div className="bg-primary h-3 w-3 rounded-full"></div>
                      {department.name} ({employees.length}人)
                    </div>

                    {/* 下级部门 */}
                    {childDepartments.map((child) => (
                      <div
                        key={child.id}
                        className="text-muted-foreground ml-4 flex items-center gap-2 text-xs"
                      >
                        <div className="bg-muted h-2 w-2 rounded-full"></div>
                        下属: {child.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 部门成员 */}
            <TabsContent value="employees" className="mt-4 space-y-4">
              {/* 部门主管 */}
              {manager.length > 0 && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    部门主管
                  </h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                          <span className="text-primary text-sm font-semibold">
                            {manager[0].name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <h3 className="text-sm font-semibold">
                            {manager[0].name}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            {manager[0].position}
                          </p>
                          <div className="text-muted-foreground flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {manager[0].phone}
                            </span>
                            <Badge
                              variant={
                                manager[0].status === "在职"
                                  ? "default"
                                  : manager[0].status === "离职"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="h-5 text-xs"
                            >
                              {manager[0].status}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" className="h-7 text-xs" asChild>
                          <a href={`/employees/${manager[0].id}`}>查看</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 部门领导 */}
              {leaders.length > 0 && (
                <div className="space-y-2">
                  <h3 className="flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    部门领导 ({leaders.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {leaders.map((leader) => (
                      <Card key={leader.id}>
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                              <span className="text-xs font-medium">
                                {leader.name.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <h4 className="truncate text-sm font-medium">
                                {leader.name}
                              </h4>
                              <p className="text-muted-foreground truncate text-xs">
                                {leader.position}
                              </p>
                              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                <Phone className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{leader.phone}</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              asChild
                            >
                              <a href={`/employees/${leader.id}`}>查看</a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* 普通员工 */}
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" />
                  普通员工 ({regularEmployees.length})
                </h3>
                {regularEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {regularEmployees.map((employee) => (
                      <Card
                        key={employee.id}
                        className="transition-shadow hover:shadow-sm"
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <div className="bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                              <span className="text-xs font-medium">
                                {employee.name.charAt(0)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate text-sm font-medium">
                                {employee.name}
                              </h3>
                              <p className="text-muted-foreground truncate text-xs">
                                {employee.position}
                              </p>
                              <div className="mt-2 space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    电话
                                  </span>
                                  <span className="ml-2 truncate">
                                    {employee.phone}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    入职
                                  </span>
                                  <span>
                                    {new Date(
                                      employee.hireDate
                                    ).toLocaleDateString("zh-CN")}
                                  </span>
                                </div>
                              </div>
                              <Button
                                className="mt-2 h-6 w-full text-xs"
                                variant="outline"
                                asChild
                              >
                                <a href={`/employees/${employee.id}`}>
                                  查看详情
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-6">
                      <Users className="text-muted-foreground/50 mb-2 h-8 w-8" />
                      <p className="text-muted-foreground text-xs">
                        暂无普通员工
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Building className="text-muted-foreground/50 mb-3 h-8 w-8" />
            <h3 className="text-sm font-medium">部门不存在</h3>
            <p className="text-muted-foreground mb-3 text-xs">
              未找到ID为 {departmentId} 的部门
            </p>
            <Button size="sm" variant="outline" asChild>
              <a href="/executive/departments">返回部门列表</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
