"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAI } from "@/hooks/ai/useAI";
import {
  AlertCircle,
  Brain,
  RefreshCw,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { useState } from "react";

export default function AISummary({
  employee,
  departmentHistory,
  projectsHistory,
  performanceHistory,
}) {
  const { completion, isSubmitting, showResult, getAiResponse } = useAI();
  const [hasGenerated, setHasGenerated] = useState(false);

  // 组装员工信息用于AI分析
  const employeeInfo = {
    基本信息: {
      姓名: employee.name,
      工号: employee.employeeId,
      职位: employee.position,
      部门: employee.department,
      入职时间: employee.hireDate,
      员工类型: employee.empType,
      状态: employee.status,
    },
    部门历史:
      departmentHistory?.map((dept) => ({
        部门: dept.department,
        职位: dept.position,
        开始时间: dept.startDate,
        结束时间: dept.endDate,
      })) || [],
    项目经历:
      projectsHistory?.map((project) => ({
        项目名称: project.projectName,
        角色: project.role,
        专业能力: project.professionalAbility,
        管理能力: project.managementAbility,
        协作能力: project.cooperationAbility,
        创新能力: project.innovativeAbility,
        学习能力: project.learningAbility,
      })) || [],
    绩效历史:
      performanceHistory?.map((perf) => ({
        评估期间: perf.period,
        总分: perf.score,
        评级: perf.rating,
        评价: perf.comments,
      })) || [],
  };

  const handleGenerateAI = async () => {
    setHasGenerated(true);
    await getAiResponse(JSON.stringify(employeeInfo, null, 2));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg">
              <Brain className="text-primary h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                AI 智能分析
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                基于多维度数据的人才评估
              </p>
            </div>
          </div>
          <Button onClick={handleGenerateAI} disabled={isSubmitting} size="sm">
            {isSubmitting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                分析中
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {hasGenerated ? "重新分析" : "开始分析"}
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {!hasGenerated && !isSubmitting && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Brain className="text-muted-foreground h-6 w-6" />
            </div>
            <p className="text-muted-foreground text-sm">
              点击上方按钮开始AI智能分析
            </p>
          </div>
        )}

        {isSubmitting && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <RefreshCw className="text-primary h-6 w-6 animate-spin" />
            </div>
            <p className="text-muted-foreground text-sm">
              AI正在分析员工数据，请稍候...
            </p>
          </div>
        )}

        {completion && showResult && (
          <div className="space-y-4">
            <div className="bg-card rounded-lg border p-4">
              <div className="prose prose-sm max-w-none">
                <div className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {completion}
                </div>
              </div>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <Brain className="h-3 w-3" />
              <span>此报告由AI智能分析生成，仅供参考</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
