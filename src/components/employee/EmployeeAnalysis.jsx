import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  BarChart3,
  Briefcase,
  Building,
  Clock,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";

export default function EmployeeAnalysis({
  employee,
  departmentHistory,
  projectsHistory,
  performanceHistory,
  formatDate,
  getStatusColor,
  getScoreColor,
  getScoreGrade,
  calculateAverageAbility,
  getAbilityWidth,
  calculateWorkYears,
}) {
  return (
    <div className="lg:col-span-2">
      <Tabs defaultValue="department" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            数据分析
          </TabsTrigger>
          <TabsTrigger value="department" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            部门历史
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            绩效历史
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            项目经历
          </TabsTrigger>
        </TabsList>

        {/* 部门变更历史 */}
        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>部门变更历史</CardTitle>
              <CardDescription>员工的部门调动和职位变更记录</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentHistory.map((record, index) => (
                  <div
                    key={record.id}
                    className="flex items-start space-x-4 rounded-lg border p-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="mt-2 h-3 w-3 rounded-full bg-blue-500"></div>
                      {index < departmentHistory.length - 1 && (
                        <div className="mt-2 ml-1 h-16 w-0.5 bg-gray-200"></div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{record.position}</h4>
                        <Badge variant={getStatusColor(record.state)}>
                          {record.state}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {record.description}
                      </p>
                      <div className="text-muted-foreground flex items-center gap-4 text-xs">
                        <span>创建: {formatDate(record.createdAt)}</span>
                        <span>更新: {formatDate(record.updatedAt)}</span>
                        {record.isCurrent && (
                          <Badge variant="success" className="text-xs">
                            当前职位
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 绩效历史 */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                绩效评估历史
              </CardTitle>
              <CardDescription>员工的绩效评估记录和趋势分析</CardDescription>
            </CardHeader>
            <CardContent>
              {performanceHistory && performanceHistory.length > 0 ? (
                <div className="space-y-6">
                  {/* 绩效概览统计 */}
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-purple-900">
                          平均分数
                        </h4>
                        <Star className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-700">
                        {Math.round(
                          performanceHistory.reduce(
                            (sum, p) => sum + p.score,
                            0
                          ) / performanceHistory.length
                        )}
                      </div>
                      <p className="text-sm text-purple-600">
                        基于 {performanceHistory.length} 次评估
                      </p>
                    </div>

                    <div className="rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-green-900">最高分数</h4>
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-700">
                        {Math.max(...performanceHistory.map((p) => p.score))}
                      </div>
                      <p className="text-sm text-green-600">
                        {getScoreGrade(
                          Math.max(...performanceHistory.map((p) => p.score))
                        )}
                      </p>
                    </div>

                    <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-blue-900">完成评估</h4>
                        <Award className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-700">
                        {
                          performanceHistory.filter((p) => p.state === "已完成")
                            .length
                        }
                      </div>
                      <p className="text-sm text-blue-600">
                        共 {performanceHistory.length} 次评估
                      </p>
                    </div>
                  </div>

                  {/* 绩效记录列表 */}
                  <div className="space-y-4">
                    <h4 className="mb-4 text-lg font-medium">评估记录</h4>
                    {performanceHistory.map((performance, index) => (
                      <div
                        key={performance.id}
                        className="flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`mt-2 h-4 w-4 rounded-full ${
                              performance.score >= 90
                                ? "bg-green-500"
                                : performance.score >= 80
                                  ? "bg-blue-500"
                                  : performance.score >= 70
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                            }`}
                          ></div>
                          {index < performanceHistory.length - 1 && (
                            <div className="mt-2 ml-2 h-16 w-0.5 bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium">
                                绩效评估 #{performance.perId}
                              </h4>
                              <Badge
                                variant={getStatusColor(performance.state)}
                              >
                                {performance.state}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-2xl font-bold ${getScoreColor(performance.score)}`}
                              >
                                {performance.score}
                              </span>
                              <span className="text-muted-foreground text-sm">
                                分
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <Badge
                              variant={
                                performance.score >= 90
                                  ? "success"
                                  : performance.score >= 80
                                    ? "blue"
                                    : performance.score >= 70
                                      ? "warning"
                                      : "destructive"
                              }
                            >
                              {getScoreGrade(performance.score)}
                            </Badge>
                            <div className="h-2 flex-1 rounded-full bg-gray-200">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  performance.score >= 90
                                    ? "bg-green-500"
                                    : performance.score >= 80
                                      ? "bg-blue-500"
                                      : performance.score >= 70
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                                style={{ width: `${performance.score}%` }}
                              ></div>
                            </div>
                          </div>

                          <p className="text-muted-foreground text-sm">
                            {performance.description}
                          </p>

                          <div className="text-muted-foreground flex items-center gap-4 text-xs">
                            <span>
                              创建: {formatDate(performance.createdAt)}
                            </span>
                            <span>
                              更新: {formatDate(performance.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="space-y-2 text-center">
                    <Award className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="font-medium text-gray-500">暂无绩效记录</p>
                    <p className="text-sm text-gray-400">
                      该员工还没有绩效评估记录
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 项目经历 */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                项目参与经历
              </CardTitle>
              <CardDescription>
                员工参与的项目列表和能力评估分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projectsHistory && projectsHistory.length > 0 ? (
                <div className="space-y-6">
                  {/* 项目概览统计 */}
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border bg-gradient-to-r from-indigo-50 to-blue-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-indigo-900">
                          参与项目
                        </h4>
                        <Target className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="text-2xl font-bold text-indigo-700">
                        {projectsHistory.length}
                      </div>
                      <p className="text-sm text-indigo-600">个项目</p>
                    </div>

                    <div className="rounded-lg border bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-orange-900">
                          平均能力
                        </h4>
                        <Star className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-700">
                        {Math.round(
                          projectsHistory.reduce(
                            (sum, p) => sum + calculateAverageAbility(p),
                            0
                          ) / projectsHistory.length
                        )}
                      </div>
                      <p className="text-sm text-orange-600">综合评分</p>
                    </div>

                    <div className="rounded-lg border bg-gradient-to-r from-emerald-50 to-green-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-medium text-emerald-900">
                          负责人经历
                        </h4>
                        <Award className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-700">
                        {
                          projectsHistory.filter((p) =>
                            p.role.includes("负责人")
                          ).length
                        }
                      </div>
                      <p className="text-sm text-emerald-600">次</p>
                    </div>
                  </div>

                  {/* 项目列表 */}
                  <div className="space-y-6">
                    <h4 className="mb-4 text-lg font-medium">项目详情</h4>
                    {projectsHistory.map((project, index) => (
                      <div
                        key={project.id}
                        className="rounded-lg border p-6 transition-shadow hover:shadow-md"
                      >
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-3 w-3 rounded-full ${
                                project.role.includes("负责人")
                                  ? "bg-purple-500"
                                  : "bg-blue-500"
                              }`}
                            ></div>
                            <div>
                              <h4 className="font-semibold">
                                项目 #{project.proId}
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                {project.role}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              project.role.includes("负责人")
                                ? "purple"
                                : "blue"
                            }
                          >
                            {project.role}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <p className="text-muted-foreground mb-2 text-sm">
                            项目描述
                          </p>
                          <p className="text-sm">{project.description}</p>
                        </div>

                        {/* 能力评估 */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">能力评估</h5>
                            <span className="text-muted-foreground text-sm font-medium">
                              综合评分: {calculateAverageAbility(project)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>专业能力</span>
                                <span className="font-medium">
                                  {project.professionalAbility}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                                  style={{
                                    width: `${getAbilityWidth(project.professionalAbility)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>管理能力</span>
                                <span className="font-medium">
                                  {project.managementAbility}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                                  style={{
                                    width: `${getAbilityWidth(project.managementAbility)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>协作能力</span>
                                <span className="font-medium">
                                  {project.cooperationAbility}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-green-500 transition-all duration-300"
                                  style={{
                                    width: `${getAbilityWidth(project.cooperationAbility)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>创新能力</span>
                                <span className="font-medium">
                                  {project.innovativeAbility}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-orange-500 transition-all duration-300"
                                  style={{
                                    width: `${getAbilityWidth(project.innovativeAbility)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <div className="flex justify-between text-sm">
                                <span>学习能力</span>
                                <span className="font-medium">
                                  {project.learningAbility}
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-gray-200">
                                <div
                                  className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
                                  style={{
                                    width: `${getAbilityWidth(project.learningAbility)}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-muted-foreground mt-4 flex items-center gap-4 border-t pt-4 text-xs">
                          <span>创建: {formatDate(project.createdAt)}</span>
                          <span>更新: {formatDate(project.updatedAt)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                  <div className="space-y-2 text-center">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="font-medium text-gray-500">暂无项目记录</p>
                    <p className="text-sm text-gray-400">
                      该员工还没有参与任何项目
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 数据分析 */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>数据可视化分析</CardTitle>
              <CardDescription>员工综合数据的图表化展示和分析</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {/* 基础统计 */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {/* 工作年限统计 */}
                  <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium text-blue-900">工作年限</h4>
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {calculateWorkYears(employee.hireDate)} 年
                    </div>
                    <p className="text-sm text-blue-600">
                      入职于 {new Date(employee.hireDate).getFullYear()} 年
                    </p>
                  </div>

                  {/* 部门变更次数 */}
                  <div className="rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium text-green-900">部门变更</h4>
                      <Building className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {departmentHistory.length} 次
                    </div>
                    <p className="text-sm text-green-600">
                      当前: {employee.position}
                    </p>
                  </div>

                  {/* 绩效评估次数 */}
                  <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium text-purple-900">绩效评估</h4>
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      {performanceHistory ? performanceHistory.length : 0} 次
                    </div>
                    <p className="text-sm text-purple-600">
                      {performanceHistory && performanceHistory.length > 0
                        ? `平均: ${Math.round(performanceHistory.reduce((sum, p) => sum + p.score, 0) / performanceHistory.length)}分`
                        : "暂无评估"}
                    </p>
                  </div>

                  {/* 项目参与 */}
                  <div className="rounded-lg border bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-medium text-orange-900">项目参与</h4>
                      <Target className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-700">
                      {projectsHistory ? projectsHistory.length : 0} 个
                    </div>
                    <p className="text-sm text-orange-600">
                      {projectsHistory && projectsHistory.length > 0
                        ? `负责人: ${projectsHistory.filter((p) => p.role.includes("负责人")).length}次`
                        : "暂无项目"}
                    </p>
                  </div>
                </div>

                {/* 能力雷达图数据展示 */}
                {projectsHistory && projectsHistory.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-lg border bg-gradient-to-br from-slate-50 to-gray-50 p-6">
                      <h4 className="mb-4 flex items-center gap-2 text-lg font-medium">
                        <Star className="h-5 w-5" />
                        平均能力评估
                      </h4>
                      <div className="space-y-4">
                        {[
                          {
                            name: "专业能力",
                            key: "professionalAbility",
                            color: "bg-blue-500",
                          },
                          {
                            name: "管理能力",
                            key: "managementAbility",
                            color: "bg-purple-500",
                          },
                          {
                            name: "协作能力",
                            key: "cooperationAbility",
                            color: "bg-green-500",
                          },
                          {
                            name: "创新能力",
                            key: "innovativeAbility",
                            color: "bg-orange-500",
                          },
                          {
                            name: "学习能力",
                            key: "learningAbility",
                            color: "bg-indigo-500",
                          },
                        ].map((ability) => {
                          const avgScore = Math.round(
                            projectsHistory.reduce(
                              (sum, p) => sum + p[ability.key],
                              0
                            ) / projectsHistory.length
                          );
                          return (
                            <div key={ability.key} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">
                                  {ability.name}
                                </span>
                                <span className="text-muted-foreground">
                                  {avgScore}/100
                                </span>
                              </div>
                              <div className="h-3 w-full rounded-full bg-gray-200">
                                <div
                                  className={`${ability.color} h-3 rounded-full transition-all duration-500`}
                                  style={{ width: `${avgScore}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                      <h4 className="mb-4 flex items-center gap-2 text-lg font-medium">
                        <TrendingUp className="h-5 w-5" />
                        绩效趋势
                      </h4>
                      {performanceHistory && performanceHistory.length > 0 ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">
                              绩效走势
                            </span>
                            <span className="text-sm font-medium">
                              {performanceHistory.length > 1 && (
                                <span
                                  className={`${
                                    performanceHistory[
                                      performanceHistory.length - 1
                                    ].score > performanceHistory[0].score
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {performanceHistory[
                                    performanceHistory.length - 1
                                  ].score > performanceHistory[0].score
                                    ? "↗ 上升趋势"
                                    : "↘ 需要改进"}
                                </span>
                              )}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {performanceHistory.map((perf, index) => (
                              <div
                                key={perf.id}
                                className="flex items-center justify-between rounded-lg border bg-white p-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`h-3 w-3 rounded-full ${
                                      perf.score >= 90
                                        ? "bg-green-500"
                                        : perf.score >= 80
                                          ? "bg-blue-500"
                                          : perf.score >= 70
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                    }`}
                                  ></div>
                                  <span className="text-sm">
                                    评估 #{perf.perId}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`font-bold ${getScoreColor(perf.score)}`}
                                  >
                                    {perf.score}
                                  </span>
                                  <span className="text-muted-foreground text-xs">
                                    {formatDate(perf.createdAt).split(" ")[0]}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-center">
                          <Award className="mx-auto mb-2 h-8 w-8 opacity-50" />
                          <p className="text-sm">暂无绩效数据</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 如果没有项目或绩效数据，显示占位符 */}
                {(!projectsHistory || projectsHistory.length === 0) &&
                  (!performanceHistory || performanceHistory.length === 0) && (
                    <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <div className="space-y-2 text-center">
                        <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="font-medium text-gray-500">
                          暂无详细分析数据
                        </p>
                        <p className="text-sm text-gray-400">
                          需要绩效和项目数据来生成详细分析
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
