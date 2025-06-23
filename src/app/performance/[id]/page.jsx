'use client';

import { useState, useEffect } from 'react';
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
  FileEdit,
  Loader2
} from "lucide-react";
import { format } from 'date-fns';
import { getAllEmployeePerformances } from '@/lib/services/performanceService';

export default function PerformanceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const performanceId = parseInt(params.id);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        // 获取所有员工绩效评估
        const employeePerformances = await getAllEmployeePerformances();
        console.log('获取到的员工绩效数据:', employeePerformances);
        
        // 找到当前ID的绩效评估
        const currentPerformance = employeePerformances.find(item => item.id === performanceId);
        
        if (!currentPerformance) {
          setError('未找到该绩效记录');
          return;
        }
        
        // 处理API返回的数据格式，确保字段一致性
        const processedPerformance = {
          id: currentPerformance.id,
          employeeId: currentPerformance.employeeId,
          employeeName: currentPerformance.employeeName || '未知员工',
          department: currentPerformance.department || '未知部门',
          position: currentPerformance.position || '未知职位',
          performanceId: currentPerformance.performanceId,
          performanceName: currentPerformance.performanceName || '未知考核',
          approverId: currentPerformance.approverId,
          approverName: currentPerformance.approverName || '未知评估人',
          score: currentPerformance.score || '-',
          state: currentPerformance.state || '未完成',
          description: currentPerformance.description || '',
          startDate: currentPerformance.startDate || '',
          endDate: currentPerformance.endDate || '',
          createdAt: currentPerformance.createdAt || ''
        };
        
        // 构建详情数据结构
        const performanceWithDetails = {
          ...processedPerformance,
          details: {
            selfEvaluation: "员工尚未提交自我评价",
            evaluatorComments: processedPerformance.description || "暂无评估人评语",
            goals: [
              { 
                title: "工作质量", 
                description: "完成工作的质量和准确性", 
                weight: 40, 
                completion: processedPerformance.state || "未完成", 
                score: processedPerformance.score || "-" 
              },
              { 
                title: "工作效率", 
                description: "完成工作的速度和资源利用", 
                weight: 30, 
                completion: processedPerformance.state || "未完成", 
                score: processedPerformance.score || "-" 
              },
              { 
                title: "团队协作", 
                description: "与团队成员的协作能力", 
                weight: 30, 
                completion: processedPerformance.state || "未完成", 
                score: processedPerformance.score || "-" 
              },
            ]
          }
        };
        
        setPerformance(performanceWithDetails);
      } catch (err) {
        console.error('获取绩效详情失败:', err);
        setError('获取绩效详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [performanceId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">加载绩效详情中...</p>
        </div>
      </div>
    );
  }

  if (error || !performance) {
    return (
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error || '未找到该绩效记录'}</p>
        </div>
      </div>
    );
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
      case '未完成':
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

  // 格式化日期
  const formatDate = (dateString) => {
    try {
      if (!dateString) return '-';
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString || '-';
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
              总分：{performance.state === '已完成' ? totalScore.toFixed(1) : '-'}
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
              <span>{performance.performanceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">开始日期</span>
              <span>{formatDate(performance.startDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">结束日期</span>
              <span>{formatDate(performance.endDate)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">评估状态</CardTitle>
            {getStatusBadge(performance.state).icon}
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">当前状态</span>
              <Badge variant={getStatusBadge(performance.state).variant}>
                {performance.state}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">考核人</span>
              <span>{performance.approverName}</span>
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