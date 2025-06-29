import AISummary from "@/components/employee/AISummary";
import EmployeeAnalysis from "@/components/employee/EmployeeAnalysis";
import EmployeeDetail from "@/components/employee/EmployeeDetail";
import { Badge } from "@/components/ui/badge";
import { getEmployeeAISummery } from "@/lib/services/aiService";
import { getEmployeeDepartmentHistory } from "@/lib/services/departmentService";
import { getEmployeeById } from "@/lib/services/employeeService";
import { getEmployeePerformances } from "@/lib/services/performanceService";
import { getEmployeeProjects } from "@/lib/services/projectService";

export default async function EmployeeDetailPage({ params }) {
  const { id } = await params;
  const employee = await getEmployeeById(id);
  const departmentHistory = await getEmployeeDepartmentHistory(id);
  const projectsHistory = await getEmployeeProjects(id);
  const performanceHistory = await getEmployeePerformances(id);
  const aiSummary = await getEmployeeAISummery(id);
  console.log("AI Summary:", aiSummary);

  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 计算工龄
  const calculateWorkYears = (hireDate) => {
    const years = new Date().getFullYear() - new Date(hireDate).getFullYear();
    return years;
  };

  // 状态颜色映射
  const getStatusColor = (status) => {
    switch (status) {
      case "在职":
        return "success";
      case "离职":
        return "destructive";
      case "已通过":
        return "success";
      case "待审核":
        return "warning";
      case "已拒绝":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // 员工类型颜色映射
  const getEmpTypeColor = (empType) => {
    switch (empType) {
      case "管理员":
        return "purple";
      case "HR":
        return "blue";
      case "部门负责人":
        return "warning";
      case "普通用户":
        return "secondary";
      default:
        return "outline";
    }
  };

  // 获取绩效评分颜色
  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // 获取绩效评分等级
  const getScoreGrade = (score) => {
    if (score >= 90) return "优秀";
    if (score >= 80) return "良好";
    if (score >= 70) return "合格";
    return "待改进";
  };

  // 计算平均能力分数
  const calculateAverageAbility = (project) => {
    const abilities = [
      project.professionalAbility,
      project.managementAbility,
      project.cooperationAbility,
      project.innovativeAbility,
      project.learningAbility,
    ];
    return Math.round(
      abilities.reduce((sum, score) => sum + score, 0) / abilities.length
    );
  };

  // 获取能力评分的进度条宽度
  const getAbilityWidth = (score) => {
    return Math.min(score, 100);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">员工详情</h1>
          <p className="text-muted-foreground">查看员工的详细信息和历史记录</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={getStatusColor(employee.status)}>
            {employee.status}
          </Badge>
          <Badge variant={getEmpTypeColor(employee.empType)}>
            {employee.empType}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 基本信息卡片 */}
        <div className="lg:col-span-1">
          <EmployeeDetail employee={employee} />
        </div>

        <div className="space-y-6 lg:col-span-2">
          {/* AI 智能分析区域 */}
          <div className="w-full">
            <AISummary
              employee={employee}
              departmentHistory={departmentHistory}
              projectsHistory={projectsHistory}
              performanceHistory={performanceHistory}
              summary={aiSummary}
            />
          </div>

          {/* 详细信息和历史记录 */}
          <EmployeeAnalysis
            employee={employee}
            departmentHistory={departmentHistory}
            projectsHistory={projectsHistory}
            performanceHistory={performanceHistory}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            getScoreColor={getScoreColor}
            getScoreGrade={getScoreGrade}
            calculateAverageAbility={calculateAverageAbility}
            getAbilityWidth={getAbilityWidth}
            calculateWorkYears={calculateWorkYears}
          />
        </div>
      </div>
    </div>
  );
}
