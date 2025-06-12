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
  Calendar,
  FileEdit
} from "lucide-react";

// 完整模拟数据，每个人有独立details
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
        { title: "系统重构", description: "完成前端系统的重构工作，提升性能和用户体验", weight: 40, completion: "进行中", score: "-" },
        { title: "代码质量", description: "提高代码质量，完善单元测试覆盖率", weight: 30, completion: "已完成", score: "95" },
        { title: "技术分享", description: "进行至少2次技术分享，促进团队技术交流", weight: 30, completion: "进行中", score: "-" },
      ],
    },
  },
  {
    id: 2,
    employeeName: "王五",
    employeeId: 3,
    department: "设计部",
    position: "UI/UX设计师",
    period: "2023年第四季度",
    status: "已完成",
    score: "92",
    evaluator: "赵六",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    details: {
      selfEvaluation: "本季度参与了多个UI项目，提升了用户体验...",
      evaluatorComments: "王五设计思路新颖，能高效完成任务...",
      goals: [
        { title: "界面优化", description: "优化主产品界面，提升美观度", weight: 50, completion: "已完成", score: "90" },
        { title: "用户调研", description: "完成2次用户调研并输出报告", weight: 30, completion: "已完成", score: "95" },
        { title: "团队协作", description: "与开发团队高效协作，按时交付", weight: 20, completion: "已完成", score: "93" },
      ],
    },
  },
  {
    id: 3,
    employeeName: "李四",
    employeeId: 2,
    department: "产品部",
    position: "产品经理",
    period: "2024年第一季度",
    status: "待评估",
    score: "-",
    evaluator: "张三",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    details: {
      selfEvaluation: "推动了新产品的立项和需求分析...",
      evaluatorComments: "李四具备良好的产品规划能力...",
      goals: [
        { title: "需求分析", description: "完成新产品需求分析文档", weight: 40, completion: "已完成", score: "-" },
        { title: "项目推进", description: "推动项目按计划进行", weight: 40, completion: "进行中", score: "-" },
        { title: "团队管理", description: "带领团队完成季度目标", weight: 20, completion: "进行中", score: "-" },
      ],
    },
  },
  {
    id: 4,
    employeeName: "赵六",
    employeeId: 4,
    department: "技术部",
    position: "后端开发工程师",
    period: "2023年第四季度",
    status: "已完成",
    score: "88",
    evaluator: "王五",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    details: {
      selfEvaluation: "完成了核心接口的开发和优化...",
      evaluatorComments: "赵六技术扎实，能独立解决复杂问题...",
      goals: [
        { title: "接口开发", description: "开发高性能后端接口", weight: 60, completion: "已完成", score: "85" },
        { title: "系统优化", description: "优化数据库和缓存", weight: 25, completion: "已完成", score: "92" },
        { title: "文档完善", description: "完善技术文档", weight: 15, completion: "已完成", score: "90" },
      ],
    },
  },
  {
    id: 5,
    employeeName: "钱七",
    employeeId: 5,
    department: "数据部",
    position: "数据分析师",
    period: "2024年第一季度",
    status: "进行中",
    score: "-",
    evaluator: "孙八",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    details: {
      selfEvaluation: "参与了多个数据分析项目，提升了数据洞察力...",
      evaluatorComments: "钱七数据敏感度高，分析报告详实...",
      goals: [
        { title: "数据建模", description: "完成2个数据建模项目", weight: 50, completion: "进行中", score: "-" },
        { title: "报告撰写", description: "输出高质量分析报告", weight: 30, completion: "进行中", score: "-" },
        { title: "团队支持", description: "为其他部门提供数据支持", weight: 20, completion: "进行中", score: "-" },
      ],
    },
  },
  {
    id: 6,
    employeeName: "孙八",
    employeeId: 6,
    department: "人事部",
    position: "人事专员",
    period: "2023年第四季度",
    status: "已完成",
    score: "95",
    evaluator: "钱七",
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    details: {
      selfEvaluation: "本季度完成了招聘和培训任务...",
      evaluatorComments: "孙八工作认真，招聘效率高...",
      goals: [
        { title: "招聘", description: "完成季度招聘计划", weight: 50, completion: "已完成", score: "98" },
        { title: "培训", description: "组织2次员工培训", weight: 30, completion: "已完成", score: "92" },
        { title: "员工关怀", description: "开展员工关怀活动", weight: 20, completion: "已完成", score: "90" },
      ],
    },
  },
];

export default function PerformanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const performanceId = parseInt(params.id);

  // 精确查找该人的绩效数据
  const performance = mockPerformanceData.find(
    (item) => item.id === performanceId
  );
  if (!performance) {
    return <div className="container mx-auto p-6">未找到该绩效记录</div>;
  }

  // 计算总分（所有目标加权得分之和，忽略未评分目标）
  const totalScore = performance.details.goals.reduce((sum, goal) => {
    if (goal.score !== '-' && !isNaN(parseFloat(goal.score))) {
      return sum + (parseFloat(goal.score) * goal.weight / 100);
    }
    return sum;
  }, 0);

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
            <div className="mt-2 text-lg font-semibold text-blue-600">
              总分：{performance.status === '已完成' ? totalScore.toFixed(1) : '-'}
            </div>
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