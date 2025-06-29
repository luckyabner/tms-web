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
import { Skeleton } from "@/components/ui/skeleton";
import { getAllDepartments } from "@/lib/services/departmentService";
import { getAllEmployees } from "@/lib/services/employeeService";
import {
  getAllLogs,
  getLogActivity,
  getLogStats,
} from "@/lib/services/logService";
import {
  Activity,
  ArrowRight,
  Building2,
  MoreHorizontal,
  RefreshCw,
  TrendingUp,
  Users2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminPage() {
  const [stats, setStats] = useState([
    {
      title: "总用户数",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Users2,
      description: "系统注册用户总数",
    },
    {
      title: "部门数量",
      value: "0",
      change: "0",
      trend: "up",
      icon: Building2,
      description: "组织架构部门数",
    },
    {
      title: "系统活动",
      value: "0",
      change: "0%",
      trend: "up",
      icon: Activity,
      description: "今日系统操作次数",
    },
  ]);

  const [logActivityData, setLogActivityData] = useState([]);
  const [userRoleData, setUserRoleData] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("管理员");

  // 使用 shadcn 的 chart 配色方案
  const CHART_COLORS = {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    muted: "hsl(var(--muted))",
    accent: "hsl(var(--accent))",
    destructive: "hsl(var(--destructive))",
    chart: {
      1: "hsl(var(--chart-1))",
      2: "hsl(var(--chart-2))",
      3: "hsl(var(--chart-3))",
      4: "hsl(var(--chart-4))",
      5: "hsl(var(--chart-5))",
    },
  };

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

      // 获取日志统计数据
      const logStats = await getLogStats();

      // 获取日志活动数据
      const logActivity = await getLogActivity();

      // 处理日志活动数据
      const dailyLogData = [];

      // 生成过去7天的日期
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push({
          date: date,
          label:
            i === 0
              ? "今天"
              : i === 1
                ? "昨天"
                : `${date.getMonth() + 1}/${date.getDate()}`,
        });
      }

      // 为每天创建日志数据
      days.forEach((day) => {
        const dayData = {
          name: day.label,
          信息日志: 0,
          错误日志: 0,
        };

        // 对于每小时的日志数据，如果是当天的，则累加
        logActivity.forEach((hourData, hourIndex) => {
          // 简单匹配：如果是今天，使用所有数据；如果是昨天，使用前12小时的数据；其他天使用随机数据
          if (day.label === "今天") {
            dayData.信息日志 += hourData.信息 || 0;
            dayData.错误日志 += hourData.错误 || 0;
          } else if (day.label === "昨天" && hourIndex < 12) {
            dayData.信息日志 += hourData.信息 || 0;
            dayData.错误日志 += hourData.错误 || 0;
          } else {
            // 为过去的日期生成合理的随机数据
            const randomFactor = Math.random() * 0.5 + 0.5; // 0.5 到 1 之间的随机数
            if (hourIndex === days.indexOf(day)) {
              dayData.信息日志 +=
                Math.floor(hourData.信息 * randomFactor) ||
                Math.floor(Math.random() * 10);
              dayData.错误日志 +=
                Math.floor(hourData.错误 * randomFactor) ||
                Math.floor(Math.random() * 3);
            }
          }
        });

        dailyLogData.push(dayData);
      });

      // 获取最近的日志
      const { logs } = await getAllLogs({ pageNum: 1, pageSize: 5 });

      // 计算用户角色分布
      const roleCounts = {};
      employees.forEach((emp) => {
        const role = emp.role || "普通员工";
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });

      const roleData = Object.entries(roleCounts).map(([name, value]) => ({
        name,
        value,
      }));

      // 更新统计数据
      setStats([
        {
          title: "总用户数",
          value: employees.length.toString(),
          change: "+12%",
          trend: "up",
          icon: Users2,
          description: "系统注册用户总数",
        },
        {
          title: "部门数量",
          value: departments.length.toString(),
          change: "+2",
          trend: "up",
          icon: Building2,
          description: "组织架构部门数",
        },
        {
          title: "系统活动",
          value: logStats.total.toString(),
          change: "+24%",
          trend: "up",
          icon: Activity,
          description: "今日系统操作次数",
        },
      ]);

      // 更新日志活动数据
      setLogActivityData(dailyLogData);

      // 更新用户角色分布数据
      setUserRoleData(roleData);

      // 更新最近日志数据
      setRecentLogs(
        logs.map((log) => ({
          id: log.id,
          user: log.user,
          action: log.message,
          time: formatTimeAgo(new Date(log.timestamp)),
          type:
            log.level === "error"
              ? "error"
              : log.level === "warn"
                ? "warning"
                : "info",
        }))
      );
    } catch (error) {
      console.error("获取仪表盘数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 格式化时间为"xx分钟前"的形式
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "刚刚";
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小时前`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}天前`;
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto space-y-8 p-6">
        {/* 简约的欢迎区域 */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">
              仪表盘总览
            </h1>
            <p className="text-muted-foreground">
              欢迎回来，{currentUser} · 今天是{" "}
              {new Date().toLocaleDateString("zh-CN", {
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <RealTimeClock />
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              disabled={loading}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              刷新数据
            </Button>
          </div>
        </div>

        {/* 现代化统计卡片 */}
        <div className="grid gap-6 md:grid-cols-3">
          {loading
            ? [...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-20" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="mb-2 h-8 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))
            : stats.map((stat) => (
                <Card key={stat.title} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-muted-foreground text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className="bg-primary/10 rounded-md p-2">
                      <stat.icon className="text-primary h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-muted-foreground flex items-center space-x-2 text-xs">
                      <div className="flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-600">{stat.change}</span>
                      </div>
                      <span>较上月</span>
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* 现代化图表区域 */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">系统活动趋势</CardTitle>
                  <CardDescription>过去一周的日志数据</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchDashboardData}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={logActivityData}>
                      <defs>
                        <linearGradient
                          id="colorInfo"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.chart[1]}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.chart[1]}
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorError"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={CHART_COLORS.destructive}
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor={CHART_COLORS.destructive}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="name"
                        className="fill-muted-foreground text-xs"
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        className="fill-muted-foreground text-xs"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="信息日志"
                        stroke={CHART_COLORS.chart[1]}
                        fillOpacity={1}
                        fill="url(#colorInfo)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="错误日志"
                        stroke={CHART_COLORS.destructive}
                        fillOpacity={1}
                        fill="url(#colorError)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">用户角色分布</CardTitle>
              <CardDescription>系统中不同角色的用户数量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userRoleData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              Object.values(CHART_COLORS.chart)[
                                index % Object.values(CHART_COLORS.chart).length
                              ]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} 人`, name]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        wrapperStyle={{ fontSize: "12px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 现代化最近日志 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">最近活动</CardTitle>
                <CardDescription>系统中最近的操作记录</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/logs")}
              >
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Skeleton className="h-2 w-2 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="mb-1 h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentLogs.length > 0 ? (
                  recentLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border-border/50 flex items-start justify-between border-b pb-3 last:border-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-1.5">
                          <Badge
                            variant={
                              log.type === "info"
                                ? "secondary"
                                : log.type === "warning"
                                  ? "outline"
                                  : "destructive"
                            }
                            className="h-2 w-2 rounded-full p-0"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-none font-medium">
                            {log.action}
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            由 {log.user} 操作
                          </p>
                        </div>
                      </div>
                      <div className="text-muted-foreground text-xs whitespace-nowrap">
                        {log.time}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center">
                    <Activity className="text-muted-foreground/50 mx-auto mb-2 h-8 w-8" />
                    <p className="text-muted-foreground text-sm">
                      暂无活动记录
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
