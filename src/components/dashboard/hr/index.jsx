"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RealTimeClock } from "@/components/ui/real-time-clock";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/hooks/auth";
import { getAllDepartments } from "@/lib/services/departmentService";
import { getAllEmployees } from "@/lib/services/employeeService";
import {
  getAllPendingTransfers,
  getAllTransfers,
} from "@/lib/services/transfersService";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import useSWR from "swr";

export default function HrPage() {
  const { userInfo } = useAuth();

  const { data: transfers } = useSWR("transfers", async () => {
    return await getAllPendingTransfers();
  });

  const { data: employees } = useSWR("employees", async () => {
    return await getAllEmployees();
  });

  const { data: departments } = useSWR("departments", async () => {
    return await getAllDepartments();
  });

  const { data: allTransfers } = useSWR("allTransfers", async () => {
    return await getAllTransfers();
  });
  console.log(
    "所有的调动信息",
    allTransfers,
    "待审批的调动",
    transfers,
    "员工信息",
    employees,
    "部门信息",
    departments
  );

  // 获取员工姓名
  const getEmployeeName = (empId) => {
    const employee = employees?.find((emp) => emp.id === empId);
    return employee?.name || `员工ID: ${empId}`;
  };

  // 获取部门名称
  const getDepartmentName = (depId) => {
    const department = departments?.find((dep) => dep.id === depId);
    return department?.name || `部门ID: ${depId}`;
  };

  // 获取待审批的转职申请
  const getPendingTransfers = () => {
    if (!transfers) return [];
    return transfers.filter((transfer) => transfer.state === "待审批");
  };

  // 格式化创建时间
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return "刚刚";
    if (diffHours < 24) return `${diffHours}小时前`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}天前`;

    return date.toLocaleDateString("zh-CN");
  };

  return (
    <div className="bg-background min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* 欢迎区域 */}
        <Card className="from-primary to-primary/80 text-primary-foreground border-0 bg-gradient-to-r">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  欢迎回来，{userInfo.name}
                </h1>
                <p className="text-primary-foreground/80">
                  今天是{" "}
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
          </CardContent>
        </Card>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="在职员工数"
            value={
              employees
                ? employees.filter((e) => e.status === "在职").length
                : 0
            }
            icon={Users}
            iconClassName="h-6 w-6 text-blue-500"
            description="当前在职员工总数"
          />
          <StatCard
            title="部门总数"
            value={departments ? departments.length : 0}
            icon={Calendar}
            iconClassName="h-6 w-6 text-green-500"
            description="公司下属部门数量"
          />
          <StatCard
            title="今年新入职"
            value={
              employees
                ? employees.filter(
                    (e) =>
                      e.hireDate &&
                      new Date(e.hireDate).getFullYear() ===
                        new Date().getFullYear()
                  ).length
                : 0
            }
            icon={UserPlus}
            iconClassName="h-6 w-6 text-emerald-500"
            description="本年度新入职员工"
          />
          <StatCard
            title="本月调动次数"
            value={
              allTransfers
                ? allTransfers.filter(
                    (t) =>
                      new Date(t.updatedAt).getFullYear() ===
                        new Date().getFullYear() &&
                      new Date(t.updatedAt).getMonth() === new Date().getMonth()
                  ).length
                : 0
            }
            icon={TrendingUp}
            iconClassName="h-6 w-6 text-purple-500"
            description="本月所有调动记录数"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 待办事项 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                待审批转职申请
                {getPendingTransfers().length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {getPendingTransfers().length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getPendingTransfers().length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="text-muted-foreground mb-4 h-12 w-12" />
                    <p className="text-muted-foreground text-sm">
                      暂无待审批的转职申请
                    </p>
                  </div>
                ) : (
                  getPendingTransfers().map((transfer) => (
                    <div
                      key={transfer.id}
                      className="hover:bg-muted/50 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                    >
                      <Badge
                        variant="secondary"
                        className="border-orange-300 bg-orange-100 text-orange-800"
                      >
                        待审批
                      </Badge>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {getEmployeeName(transfer.empId)}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            →
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {getDepartmentName(transfer.depId)} ·{" "}
                            {transfer.position}
                          </span>
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {formatTime(transfer.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          {/* 近期活动 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                近期活动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allTransfers && employees && departments ? (
                  [...allTransfers]
                    .sort(
                      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
                    )
                    .slice(0, 6)
                    .map((item) => {
                      // 类型判断
                      let type = "调动";
                      if (item.description && item.description.includes("入职"))
                        type = "入职";
                      else if (
                        item.description &&
                        item.description.includes("信息更新")
                      )
                        type = "信息更新";
                      // 配色
                      const typeColor =
                        type === "入职"
                          ? "bg-emerald-500"
                          : type === "信息更新"
                            ? "bg-blue-500"
                            : "bg-orange-500";
                      return (
                        <div
                          key={item.id}
                          className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-3 transition-colors"
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${typeColor}`}
                          >
                            {type}
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium">
                              {getEmployeeName(item.empId)}
                              <span className="text-muted-foreground mx-1">
                                ·
                              </span>
                              {getDepartmentName(item.depId)}
                              {item.position && (
                                <span className="text-muted-foreground ml-1">
                                  {item.position}
                                </span>
                              )}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {formatTime(item.updatedAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-muted-foreground py-6 text-center">
                    暂无活动
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
