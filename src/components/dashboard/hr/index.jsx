"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RealTimeClock } from "@/components/ui/real-time-clock";
import { StatCard } from "@/components/ui/stat-card";
import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";

export default function HrPage() {
  const priorityConfig = {
    high: { color: "bg-destructive", textColor: "text-destructive-foreground" },
    medium: { color: "bg-warning", textColor: "text-warning-foreground" },
    low: { color: "bg-success", textColor: "text-success-foreground" },
  };

  const activityTypeConfig = {
    join: { bg: "bg-emerald-500", label: "入职" },
    training: { bg: "bg-blue-500", label: "培训" },
    recruitment: { bg: "bg-orange-500", label: "招聘" },
    award: { bg: "bg-purple-500", label: "奖励" },
  };

  const notificationTypeConfig = {
    warning: {
      bg: "bg-yellow-50",
      border: "border-l-yellow-400",
      icon: AlertTriangle,
    },
    info: { bg: "bg-blue-50", border: "border-l-blue-400", icon: Bell },
    success: {
      bg: "bg-green-50",
      border: "border-l-green-400",
      icon: CheckCircle,
    },
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
                  欢迎回来，张三丰
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
            title="总员工数"
            value="1,245"
            icon={Users}
            trend="up"
            trendValue="+12 本月"
            color="blue"
          />
          <StatCard
            title="在招职位"
            value="28"
            icon={UserPlus}
            trend="up"
            trendValue="+5 本周"
            color="green"
          />
          <StatCard
            title="绩效评估"
            value="892"
            icon={TrendingUp}
            trend="up"
            trendValue="+3.2% 提升"
            color="orange"
          />
          <StatCard
            title="培训进行中"
            value="156"
            icon={Calendar}
            trend="down"
            trendValue="-8 本周"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 待办事项 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                今日待办
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    task: "审批张三的转正申请",
                    priority: "high",
                    time: "09:00",
                  },
                  {
                    task: "面试UI设计师候选人",
                    priority: "medium",
                    time: "14:00",
                  },
                  { task: "评审Q4培训计划", priority: "low", time: "16:30" },
                  { task: "更新员工手册", priority: "medium", time: "待定" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          item.priority === "high"
                            ? "destructive"
                            : item.priority === "medium"
                              ? "secondary"
                              : "outline"
                        }
                        className="h-2 w-2 rounded-full p-0"
                      />
                      <span className="text-sm font-medium">{item.task}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-xs">
                        {item.time}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 快速操作 */}
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                添加新员工
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                发布招聘职位
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                创建绩效评估
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Star className="mr-2 h-4 w-4" />
                安排培训课程
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                {[
                  { action: "李四入职产品部", time: "2小时前", type: "join" },
                  {
                    action: "王五完成Java培训",
                    time: "4小时前",
                    type: "training",
                  },
                  {
                    action: "市场部招聘1名运营专员",
                    time: "1天前",
                    type: "recruitment",
                  },
                  {
                    action: "赵六获得优秀员工奖",
                    time: "2天前",
                    type: "award",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-3 transition-colors"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${activityTypeConfig[activity.type].bg}`}
                    >
                      {activityTypeConfig[activity.type].label}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-muted-foreground text-xs">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 系统通知 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                系统通知
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    message: "系统将于本周六进行维护升级",
                    type: "warning",
                    time: "1小时前",
                  },
                  {
                    message: "新版员工手册已发布",
                    type: "info",
                    time: "3小时前",
                  },
                  {
                    message: "月度绩效评估即将开始",
                    type: "info",
                    time: "1天前",
                  },
                  {
                    message: "培训系统更新完成",
                    type: "success",
                    time: "2天前",
                  },
                ].map((notification, index) => {
                  const config = notificationTypeConfig[notification.type];
                  const IconComponent = config.icon;
                  return (
                    <div
                      key={index}
                      className={`rounded-lg border-l-4 p-3 ${config.bg} ${config.border}`}
                    >
                      <div className="flex items-start gap-2">
                        <IconComponent className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">
                            {notification.message}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
