'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Building,
  Calendar,
  Award,
  FileEdit
} from "lucide-react";

// 使用之前定义的模拟数据
const mockPerformanceData = [
  {
    id: 1,
    employeeName: "张三",
    employeeId: 1,
    department: "技术部",
    position: "前端开发工程师",
    period: "2024年第一季度",
    status: "进行中",
    score: "-",
    evaluator: "李四",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    details: {
      selfEvaluation: "在本季度中，我完成了前端项目的重构工作，提升了系统性能...",
      evaluatorComments: "张三在项目重构中表现出色，能够主动发现并解决问题...",
      goals: [
        {
          title: "系统重构",
          description: "完成前端系统的重构工作，提升性能和用户体验",
          weight: 40,
          completion: "进行中",
          score: "-",
        },
        {
          title: "代码质量",
          description: "提高代码质量，完善单元测试覆盖率",
          weight: 30,
          completion: "已完成",
          score: "95",
        },
        {
          title: "技术分享",
          description: "进行至少2次技术分享，促进团队技术交流",
          weight: 30,
          completion: "进行中",
          score: "-",
        },
      ],
    },
  },
  // ... 其他数据
];

export default function PerformanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const performanceId = parseInt(params.id);

  // 获取绩效数据
  const performance = mockPerformanceData.find(
    (item) => item.id === performanceId
  ) || mockPerformanceData[0]; // 使用第一条数据作为默认值

  // 获取状态对应的图标和颜色
  const getStatusBadge = (status) => {
    switch (status) {
      case '已完成':
        return {
          variant: 'success',
          icon: <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />,
        };
      case '进行中':
        return {
          variant: 'secondary',
          icon: <Clock className="h-4 w-4 text-blue-500 mr-1" />,
        };
      case '待评估':
        return {
          variant: 'warning',
          icon: <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />,
        };
      default:
        return {
          variant: 'secondary',
          icon: null,
        };
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">绩效详情</h1>
            <p className="text-muted-foreground mt-2">
              查看和管理具体的绩效考核信息
            </p>
          </div>
          <Button>
            <FileEdit className="h-4 w-4 mr-2" />
            编辑评估
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">基本信息</CardTitle>
            <User className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">员工姓名</span>
              <span className="font-medium">{performance.employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">所属部门</span>
              <span>{performance.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">职位</span>
              <span>{performance.position}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">考核信息</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">考核周期</span>
              <span>{performance.period}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">开始日期</span>
              <span>{performance.startDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">结束日期</span>
              <span>{performance.endDate}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">评估状态</CardTitle>
            {getStatusBadge(performance.status).icon}
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">当前状态</span>
              <Badge variant={getStatusBadge(performance.status).variant}>
                {performance.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">考核结果</span>
              <span className="font-medium">{performance.score || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">考核人</span>
              <span>{performance.evaluator}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>考核目标</CardTitle>
            <CardDescription>
              本次绩效考核的具体目标和完成情况
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {performance.details.goals.map((goal, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={goal.completion === '已完成' ? 'success' : 'secondary'}>
                        {goal.completion}
                      </Badge>
                      {goal.score !== '-' && (
                        <span className="font-medium text-sm">
                          得分：{goal.score}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">权重</span>
                      <span className="text-sm font-medium">{goal.weight}%</span>
                    </div>
                    {goal.score !== '-' && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">加权得分</span>
                        <span className="text-sm font-medium">
                          {(parseFloat(goal.score) * goal.weight / 100).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>自我评价</CardTitle>
              <CardDescription>
                员工的自我评价内容
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {performance.details.selfEvaluation}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>考核评语</CardTitle>
              <CardDescription>
                考核人的评价意见
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {performance.details.evaluatorComments}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 