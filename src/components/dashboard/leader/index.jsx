"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RealTimeClock } from "@/components/ui/real-time-clock";
import { Separator } from "@/components/ui/separator";
import { StatCard } from "@/components/ui/stat-card";
import api from "@/lib/api";
import { getAllDepartments } from "@/lib/services/departmentService";
import { getAllEmployees } from "@/lib/services/employeeService";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Eye,
  LayoutDashboard,
  Network,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function LeaderPage() {
  const [stats, setStats] = useState([
    {
      title: "总员工数",
      value: "0",
      trend: "up",
      trendValue: "+0%",
      icon: Users,
      color: "default",
    },
    {
      title: "部门数量",
      value: "0",
      trend: "up",
      trendValue: "+0",
      icon: Building2,
      color: "default",
    },
    {
      title: "人事调动",
      value: "0",
      trend: "up",
      trendValue: "+0",
      icon: UserCog,
      color: "default",
    },
    {
      title: "项目进行中",
      value: "0",
      trend: "up",
      trendValue: "+0%",
      icon: Briefcase,
      color: "default",
    },
  ]);

  const [departments, setDepartments] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 获取员工数据
      const employees = await getAllEmployees();

      // 获取部门数据
      const departments = await getAllDepartments();

      // 获取人事调动数据（待审批）
      let pendingTransferData = [];
      try {
        const transferResponse = await api.get(
          "/employee-departments/pending-transfers"
        );
        if (transferResponse.data && transferResponse.data.data) {
          pendingTransferData = transferResponse.data.data.map((transfer) => {
            // 查找员工和部门名称
            const employee = employees.find((emp) => emp.id === transfer.empId);
            const department = departments.find(
              (dept) => dept.id === transfer.depId
            );
            const fromDepartment =
              employees.find((emp) => emp.id === transfer.empId)?.department ||
              "未知部门";

            return {
              id: transfer.id,
              employeeName: employee
                ? employee.name
                : `员工ID: ${transfer.empId}`,
              fromDepartment: fromDepartment,
              toDepartment: department
                ? department.name
                : `部门ID: ${transfer.depId}`,
              position: transfer.position || "未知职位",
              status: transfer.state || "待审批",
              date: new Date(transfer.createdAt).toLocaleDateString("zh-CN"),
            };
          });
        }
      } catch (error) {
        console.error("获取人事调动数据失败:", error);
        // 使用模拟数据作为备份
        pendingTransferData = [
          {
            id: 1,
            employeeName: "张三",
            fromDepartment: "研发部",
            toDepartment: "产品部",
            status: "待审批",
            date: "2025-06-25",
          },
          {
            id: 2,
            employeeName: "李四",
            fromDepartment: "市场部",
            toDepartment: "销售部",
            status: "待审批",
            date: "2025-06-24",
          },
        ];
      }

      // 获取项目数据
      let projectCount = 0;
      try {
        const projectResponse = await api.get("/projects");
        if (projectResponse.data && projectResponse.data.data) {
          const projects = projectResponse.data.data;
          projectCount = projects.filter(
            (project) =>
              project.endDate === null || new Date(project.endDate) > new Date()
          ).length;
        }
      } catch (error) {
        console.error("获取项目数据失败:", error);
        projectCount = 8; // 默认值
      }

      // 更新统计数据
      setStats([
        {
          title: "总员工数",
          value: employees.length.toString(),
          trend: "up",
          trendValue: `+${Math.floor(employees.length * 0.05)}%`,
          icon: Users,
          color: "default",
        },
        {
          title: "部门数量",
          value: departments.length.toString(),
          trend: "up",
          trendValue: "+1",
          icon: Building2,
          color: "default",
        },
        {
          title: "人事调动",
          value: pendingTransferData
            .filter((t) => t.status === "待审批")
            .length.toString(),
          trend: "up",
          trendValue: `+${pendingTransferData.filter((t) => t.status === "待审批").length}`,
          icon: UserCog,
          color: "default",
        },
        {
          title: "项目进行中",
          value: projectCount.toString(),
          trend: "up",
          trendValue: "+12%",
          icon: Briefcase,
          color: "default",
        },
      ]);

      // 更新部门数据
      setDepartments(departments);

      // 更新人事调动数据
      setPendingTransfers(pendingTransferData);
    } catch (error) {
      console.error("获取仪表盘数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">工作台</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>
        </div>
        <RealTimeClock />
      </div>

      <Separator />

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 待审批的人事调动 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              待审批的人事调动
            </CardTitle>
            <CardDescription>待人事审批的调动申请</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
              </div>
            ) : pendingTransfers.length > 0 ? (
              <div className="space-y-3">
                {pendingTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {transfer.employeeName}
                        </span>
                        <ArrowRight className="text-muted-foreground h-3 w-3" />
                        <span className="text-muted-foreground text-sm">
                          {transfer.fromDepartment} → {transfer.toDepartment}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        申请日期：{transfer.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{transfer.status}</Badge>
                      {transfer.status === "待审批" && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`transfers/new?transferId=${transfer.id}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            查看
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserCog className="text-muted-foreground mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-sm">
                  暂无待审批的人事调动
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 部门统计 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              部门人员分布
            </CardTitle>
            <CardDescription>各部门的人员配置情况</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
              </div>
            ) : departments.length > 0 ? (
              <div className="space-y-4">
                {departments.slice(0, 5).map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary h-2 w-2 rounded-full"></div>
                      <span className="text-sm font-medium">{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-muted h-2 w-24 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(10, dept.empCount * 5))}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-muted-foreground w-8 text-right text-sm">
                        {dept.empCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Building2 className="text-muted-foreground mb-2 h-8 w-8" />
                <p className="text-muted-foreground text-sm">暂无部门数据</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
