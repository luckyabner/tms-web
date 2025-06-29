"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Building2,
  TreePine,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

export function DepartmentStats({ departments }) {
  // 计算统计数据
  const totalDepartments = departments.length;
  const totalEmployees = departments.reduce(
    (sum, dept) => sum + dept.empCount,
    0
  );
  const topLevelDepartments = departments.filter((dept) => !dept.parentId);
  const departmentsWithManagers = departments.filter((dept) => dept.managerId);
  const avgEmployeesPerDept =
    totalEmployees > 0 ? (totalEmployees / totalDepartments).toFixed(1) : 0;

  // 找出员工最多的部门
  const largestDepartment = departments.reduce(
    (max, dept) => (dept.empCount > max.empCount ? dept : max),
    departments[0] || { name: "无", empCount: 0 }
  );

  const stats = [
    {
      title: "总部门数",
      value: totalDepartments,
      description: "当前组织架构中的部门总数",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "总员工数",
      value: totalEmployees,
      description: "所有部门员工总数",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "顶级部门",
      value: topLevelDepartments.length,
      description: "一级组织单位数量",
      icon: TreePine,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "有主管部门",
      value: departmentsWithManagers.length,
      description: "已分配部门主管的部门数",
      icon: UserCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "平均员工数",
      value: avgEmployeesPerDept,
      description: "每个部门平均员工数量",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "最大部门",
      value: largestDepartment.name,
      description: `${largestDepartment.empCount} 名员工`,
      icon: Activity,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-md p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-1 text-2xl font-bold">
                {typeof stat.value === "string"
                  ? stat.value
                  : stat.value.toLocaleString()}
              </div>
              <CardDescription className="text-xs">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
