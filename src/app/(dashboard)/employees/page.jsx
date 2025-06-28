import { employeeColumns } from "@/components/employee/employeeColoums";
import { BasicTable } from "@/components/shared/tables/BasicTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { getAllEmployees } from "@/lib/data/employee";
import {
  Building2,
  Calendar,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import React from "react";

export default async function EmployeesPage() {
  const employees = await getAllEmployees();
  console.log("员工数据:", employees);

  // 计算统计数据
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(
    (emp) => emp.status === "在职"
  ).length;

  // 按员工类型分组
  const empTypeStats = employees.reduce((acc, emp) => {
    acc[emp.empType] = (acc[emp.empType] || 0) + 1;
    return acc;
  }, {});

  // 按学历分组
  const educationStats = employees.reduce((acc, emp) => {
    acc[emp.education] = (acc[emp.education] || 0) + 1;
    return acc;
  }, {});

  // 按性别分组
  const genderStats = employees.reduce((acc, emp) => {
    acc[emp.gender] = (acc[emp.gender] || 0) + 1;
    return acc;
  }, {});

  // 计算平均入职年限
  const currentYear = new Date().getFullYear();
  const avgYearsOfService =
    employees.reduce((acc, emp) => {
      const hireYear = new Date(emp.hireDate).getFullYear();
      return acc + (currentYear - hireYear);
    }, 0) / employees.length;

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* 页面标题 */}
      <div>
        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
          员工管理
        </h1>
        <p className="text-muted-foreground">管理和查看所有员工信息</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="员工总数"
          value={totalEmployees}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="在职员工"
          value={activeEmployees}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="平均工龄"
          value={`${avgYearsOfService.toFixed(1)}年`}
          icon={Calendar}
          color="orange"
        />
        <StatCard
          title="活跃度"
          value={`${((activeEmployees / totalEmployees) * 100).toFixed(1)}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* 数据可视化图表 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 员工类型分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              员工类型分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(empTypeStats).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(count / totalEmployees) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 学历分布 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              学历分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(educationStats).map(([education, count]) => (
                <div
                  key={education}
                  className="flex items-center justify-between"
                >
                  <span className="text-muted-foreground text-sm">
                    {education}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${(count / totalEmployees) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-sm font-medium">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 性别比例 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              性别比例
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(genderStats).map(([gender, count]) => {
                const percentage = ((count / totalEmployees) * 100).toFixed(1);
                return (
                  <div key={gender} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        {gender}
                      </span>
                      <span className="text-sm font-medium">
                        {count}人 ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className={`h-2 rounded-full ${gender === "男" ? "bg-blue-500" : "bg-pink-500"}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近加入的员工 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            最近加入的员工
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 6)
              .map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 font-medium text-white">
                    {employee.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {employee.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {employee.empType} • {employee.education}
                    </p>
                    <p className="text-xs text-blue-600">
                      加入于{" "}
                      {new Date(employee.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* 员工表格组件 */}

      <BasicTable columns={employeeColumns} data={employees} />
    </div>
  );
}
