"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";
import { getAllDepartments } from "@/lib/services/departmentService";
import { getAllEmployees } from "@/lib/services/employeeService";
import {
  Activity,
  BarChart4,
  Building,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AnalysisPage() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeDepartments, setEmployeeDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取部门数据
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);

      // 获取员工数据
      const employeesData = await getAllEmployees();
      setEmployees(employeesData);

      // 获取员工-部门关系数据
      try {
        const response = await api.get("/employee-departments");
        if (response.data && response.data.data) {
          setEmployeeDepartments(
            response.data.data.filter((ed) => ed.isCurrent === 1)
          );
        }
      } catch (error) {
        console.error("获取员工-部门关系数据失败:", error);
      }
    } catch (error) {
      console.error("获取数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 计算各部门员工数量
  const getDepartmentEmployeeCounts = () => {
    const counts = {};
    departments.forEach((dept) => {
      counts[dept.id] = 0;
    });

    employeeDepartments.forEach((empDept) => {
      if (counts[empDept.depId] !== undefined) {
        counts[empDept.depId]++;
      }
    });

    return counts;
  };

  // 计算员工状态分布
  const getEmployeeStatusDistribution = () => {
    const statusCounts = {
      在职: 0,
      离职: 0,
      借调: 0,
    };

    employees.forEach((emp) => {
      if (statusCounts[emp.status] !== undefined) {
        statusCounts[emp.status]++;
      }
    });

    return statusCounts;
  };

  const departmentEmployeeCounts = getDepartmentEmployeeCounts();
  const employeeStatusDistribution = getEmployeeStatusDistribution();

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">数据分析</h1>
        <p className="text-muted-foreground">查看公司人员和部门数据分析</p>
      </div>

      <Separator />

      <Tabs defaultValue="departments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="departments" className="space-x-2">
            <Building className="h-4 w-4" />
            <span>部门分析</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="space-x-2">
            <Users className="h-4 w-4" />
            <span>员工分析</span>
          </TabsTrigger>
        </TabsList>

        {/* 部门分析 */}
        <TabsContent value="departments" className="space-y-6">
          {loading ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-[120px]" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-[60px]" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* 部门统计卡片 */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-muted-foreground text-sm font-medium">
                      总部门数
                    </CardTitle>
                    <Building className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {departments.length}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      包含一级和子部门
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-muted-foreground text-sm font-medium">
                      一级部门
                    </CardTitle>
                    <TrendingUp className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {departments.filter((d) => d.parentId === null).length}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      顶层组织架构
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-muted-foreground text-sm font-medium">
                      子部门
                    </CardTitle>
                    <Activity className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {departments.filter((d) => d.parentId !== null).length}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      下级组织单位
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 部门人员分布 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    部门人员分布
                  </CardTitle>
                  <CardDescription>各部门员工数量统计</CardDescription>
                </CardHeader>
                <CardContent>
                  {departments.length > 0 ? (
                    <div className="space-y-4">
                      {departments.map((dept) => {
                        const count = departmentEmployeeCounts[dept.id] || 0;
                        const percentage =
                          employees.length > 0
                            ? ((count / employees.length) * 100).toFixed(1)
                            : 0;

                        return (
                          <div key={dept.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{dept.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {count} 人
                                </Badge>
                              </div>
                              <span className="text-muted-foreground text-sm">
                                {percentage}%
                              </span>
                            </div>
                            <div className="bg-secondary h-2 w-full rounded-full">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.max(2, Math.min(100, percentage))}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Building className="text-muted-foreground mb-4 h-12 w-12" />
                      <h3 className="text-lg font-semibold">暂无部门数据</h3>
                      <p className="text-muted-foreground text-sm">
                        请先添加部门信息
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 部门层级分布 */}
              {departments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5" />
                      部门层级分布
                    </CardTitle>
                    <CardDescription>组织架构层级展示</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* 一级部门 */}
                      <div className="space-y-2">
                        <h4 className="text-muted-foreground text-sm font-medium">
                          一级部门
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {departments
                            .filter((d) => d.parentId === null)
                            .map((dept) => (
                              <Badge
                                key={dept.id}
                                variant="default"
                                className="px-3 py-1"
                              >
                                {dept.name}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      {/* 子部门 */}
                      {departments.filter((d) => d.parentId !== null).length >
                        0 && (
                        <div className="space-y-2">
                          <h4 className="text-muted-foreground text-sm font-medium">
                            子部门
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {departments
                              .filter((d) => d.parentId !== null)
                              .map((dept) => (
                                <Badge
                                  key={dept.id}
                                  variant="secondary"
                                  className="px-3 py-1"
                                >
                                  {dept.name}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* 员工分析 */}
        <TabsContent value="employees" className="space-y-6">
          {loading ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-[120px]" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-[60px]" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* 员工统计卡片 */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-muted-foreground text-sm font-medium">
                      在职员工
                    </CardTitle>
                    <Users className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {employeeStatusDistribution["在职"] || 0}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {employees.length > 0
                        ? `占比 ${((employeeStatusDistribution["在职"] / employees.length) * 100).toFixed(1)}%`
                        : "占比 0%"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-muted-foreground text-sm font-medium">
                      离职员工
                    </CardTitle>
                    <Activity className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {employeeStatusDistribution["离职"] || 0}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {employees.length > 0
                        ? `占比 ${((employeeStatusDistribution["离职"] / employees.length) * 100).toFixed(1)}%`
                        : "占比 0%"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-muted-foreground text-sm font-medium">
                      借调员工
                    </CardTitle>
                    <TrendingUp className="text-muted-foreground h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {employeeStatusDistribution["借调"] || 0}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {employees.length > 0
                        ? `占比 ${((employeeStatusDistribution["借调"] / employees.length) * 100).toFixed(1)}%`
                        : "占比 0%"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* 员工状态分布 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    员工状态分布
                  </CardTitle>
                  <CardDescription>员工在职、离职等状态统计</CardDescription>
                </CardHeader>
                <CardContent>
                  {employees.length > 0 ? (
                    <div className="space-y-6">
                      {/* 状态占比可视化 */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            状态分布
                          </span>
                          <span className="text-muted-foreground">
                            总计 {employees.length} 人
                          </span>
                        </div>
                        <div className="bg-secondary flex h-4 w-full overflow-hidden rounded-full">
                          <div
                            className="h-full bg-green-600 transition-all duration-300"
                            style={{
                              width: `${(employeeStatusDistribution["在职"] / employees.length) * 100}%`,
                            }}
                          />
                          <div
                            className="h-full bg-red-500 transition-all duration-300"
                            style={{
                              width: `${(employeeStatusDistribution["离职"] / employees.length) * 100}%`,
                            }}
                          />
                          <div
                            className="h-full bg-yellow-500 transition-all duration-300"
                            style={{
                              width: `${(employeeStatusDistribution["借调"] / employees.length) * 100}%`,
                            }}
                          />
                        </div>

                        {/* 图例 */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-600" />
                            <span>在职</span>
                            <Badge variant="outline" className="text-xs">
                              {(
                                (employeeStatusDistribution["在职"] /
                                  employees.length) *
                                100
                              ).toFixed(1)}
                              %
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <span>离职</span>
                            <Badge variant="outline" className="text-xs">
                              {(
                                (employeeStatusDistribution["离职"] /
                                  employees.length) *
                                100
                              ).toFixed(1)}
                              %
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <span>借调</span>
                            <Badge variant="outline" className="text-xs">
                              {(
                                (employeeStatusDistribution["借调"] /
                                  employees.length) *
                                100
                              ).toFixed(1)}
                              %
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users className="text-muted-foreground mb-4 h-12 w-12" />
                      <h3 className="text-lg font-semibold">暂无员工数据</h3>
                      <p className="text-muted-foreground text-sm">
                        请先添加员工信息
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 员工总体统计 */}
              {employees.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5" />
                      员工总体统计
                    </CardTitle>
                    <CardDescription>员工数量和分布统计</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm font-medium">
                          总员工数
                        </p>
                        <p className="text-3xl font-bold">{employees.length}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm font-medium">
                          平均部门人数
                        </p>
                        <p className="text-3xl font-bold">
                          {departments.length > 0
                            ? (employees.length / departments.length).toFixed(1)
                            : 0}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm font-medium">
                          最大部门人数
                        </p>
                        <p className="text-3xl font-bold">
                          {Object.values(departmentEmployeeCounts).length > 0
                            ? Math.max(
                                ...Object.values(departmentEmployeeCounts)
                              )
                            : 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
