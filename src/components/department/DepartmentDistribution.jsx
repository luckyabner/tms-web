"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart, TrendingUp, Users } from "lucide-react";

export function DepartmentDistribution({ departments }) {
  // 计算员工分布数据
  const employeeDistribution = departments
    .filter((dept) => dept.empCount > 0)
    .map((dept) => ({
      name: dept.name,
      count: dept.empCount,
      managerName: dept.managerName,
      parentDep: dept.parentDep,
    }))
    .sort((a, b) => b.count - a.count);

  const totalEmployees = employeeDistribution.reduce(
    (sum, dept) => sum + dept.count,
    0
  );

  // 生成颜色
  const generateColors = (count) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-cyan-500",
      "bg-emerald-500",
      "bg-violet-500",
      "bg-amber-500",
    ];
    return colors.slice(0, count);
  };

  const colors = generateColors(employeeDistribution.length);

  // 计算百分比
  const distributionWithPercentage = employeeDistribution.map(
    (dept, index) => ({
      ...dept,
      percentage:
        totalEmployees > 0
          ? ((dept.count / totalEmployees) * 100).toFixed(1)
          : 0,
      color: colors[index] || "bg-gray-500",
    })
  );

  // 简化的饼图可视化（使用CSS实现）
  const PieSegment = ({ percentage, color, name, count }) => {
    const angle = (percentage / 100) * 360;

    return (
      <div className="hover:bg-muted/50 flex items-center space-x-3 rounded-lg p-2 transition-colors">
        <div className={`h-4 w-4 rounded-full ${color}`}></div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="truncate text-sm font-medium">{name}</span>
            <span className="text-muted-foreground ml-2 text-xs">
              {percentage}%
            </span>
          </div>
          <div className="mt-1 flex items-center space-x-2">
            <Users className="text-muted-foreground h-3 w-3" />
            <span className="text-muted-foreground text-xs">{count} 人</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PieChart className="h-5 w-5" />
          <span>员工分布</span>
        </CardTitle>
        <CardDescription>各部门员工数量分布情况</CardDescription>
      </CardHeader>
      <CardContent>
        {employeeDistribution.length > 0 ? (
          <div className="space-y-6">
            {/* 总计信息 */}
            <div className="bg-muted/30 flex items-center justify-between rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="text-primary h-5 w-5" />
                <span className="font-medium">总员工数</span>
              </div>
              <Badge variant="default" className="font-medium">
                {totalEmployees} 人
              </Badge>
            </div>

            {/* 分布列表 */}
            <div className="space-y-2">
              {distributionWithPercentage.map((dept, index) => (
                <PieSegment
                  key={dept.name}
                  percentage={dept.percentage}
                  color={dept.color}
                  name={dept.name}
                  count={dept.count}
                />
              ))}
            </div>

            {/* 进度条可视化 */}
            <div className="mt-6">
              <div className="text-muted-foreground mb-2 flex items-center justify-between text-sm">
                <span>分布比例</span>
                <span>100%</span>
              </div>
              <div className="bg-muted flex h-3 w-full overflow-hidden rounded-full">
                {distributionWithPercentage.map((dept, index) => (
                  <div
                    key={dept.name}
                    className={`h-full ${dept.color} transition-all duration-300 hover:opacity-80`}
                    style={{ width: `${dept.percentage}%` }}
                    title={`${dept.name}: ${dept.count}人 (${dept.percentage}%)`}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>暂无员工分布数据</p>
            <p className="mt-1 text-xs">部门中还没有员工</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
