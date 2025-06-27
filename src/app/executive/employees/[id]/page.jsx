'use client';

import { useState, useEffect } from 'react';
import { 
  User, Phone, Mail, Calendar, GraduationCap, Briefcase, 
  Award, UserCheck, Building, ChevronLeft, UserCog 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getEmployeeById } from '@/lib/services/employeeService';

export default function EmployeeDetailPage({ params }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEmployeeData() {
      setLoading(true);
      try {
        const data = await getEmployeeById(params.id);
        setEmployee(data);
      } catch (err) {
        console.error('获取员工数据失败:', err);
        setError('获取员工数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }

    fetchEmployeeData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
          <p className="text-green-600 font-medium">加载员工数据中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <p className="text-amber-600">未找到员工信息</p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>
      </div>
    );
  }

  // 模拟员工的工作经历数据
  const workHistory = [
    { 
      id: 1, 
      department: '研发部', 
      position: '初级工程师', 
      startDate: '2023-01-01', 
      endDate: '2023-06-30', 
      description: '负责前端开发工作'
    },
    { 
      id: 2, 
      department: '研发部', 
      position: '中级工程师', 
      startDate: '2023-07-01', 
      endDate: null, 
      description: '负责核心模块开发和维护'
    },
  ];

  // 模拟员工的项目经历数据
  const projectHistory = [
    { 
      id: 1, 
      name: '人力资源管理系统', 
      role: '前端开发', 
      startDate: '2023-01-15', 
      endDate: '2023-05-20',
      status: '已完成'
    },
    { 
      id: 2, 
      name: '绩效考核平台', 
      role: '全栈开发', 
      startDate: '2023-06-01', 
      endDate: null,
      status: '进行中'
    },
  ];

  // 模拟员工的绩效历史数据
  const performanceHistory = [
    { 
      id: 1, 
      name: '2023年Q1季度考核', 
      score: 85, 
      date: '2023-03-31',
      evaluator: '张经理',
      comment: '表现良好，但需要提高沟通能力'
    },
    { 
      id: 2, 
      name: '2023年Q2季度考核', 
      score: 92, 
      date: '2023-06-30',
      evaluator: '张经理',
      comment: '表现优秀，沟通能力有明显提升'
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 返回按钮 */}
      <div>
        <Button variant="outline" onClick={() => window.history.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          返回员工列表
        </Button>
      </div>

      {/* 员工基本信息卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="flex items-center text-green-800">
              <User className="h-5 w-5 mr-2 text-green-600" />
              员工信息
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-4xl font-bold mb-3">
                {employee.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold">{employee.name}</h2>
              <p className="text-gray-500">{employee.position || '未设置职位'}</p>
              <Badge className={
                employee.status === '在职' ? 'bg-green-100 text-green-800 mt-2' :
                employee.status === '离职' ? 'bg-red-100 text-red-800 mt-2' :
                'bg-yellow-100 text-yellow-800 mt-2'
              }>
                {employee.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">联系电话</p>
                  <p>{employee.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Building className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">所属部门</p>
                  <p>{employee.department || '未分配'}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">入职日期</p>
                  <p>{employee.hireDate}</p>
                </div>
              </div>

              <div className="flex items-start">
                <GraduationCap className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">学历</p>
                  <p>{employee.education}</p>
                </div>
              </div>

              {employee.school && (
                <div className="flex items-start">
                  <Award className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">毕业院校</p>
                    <p>{employee.school}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                <a href={`/executive/transfers/new?employeeId=${employee.id}`}>
                  <UserCog className="mr-2 h-4 w-4" />
                  发起人事调动
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="bg-green-50 border-b border-green-100 px-6 py-4">
            <Tabs defaultValue="work">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="work" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  <Briefcase className="h-4 w-4 mr-2" />
                  工作履历
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  <Calendar className="h-4 w-4 mr-2" />
                  项目经历
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  <Award className="h-4 w-4 mr-2" />
                  绩效记录
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="work">
              <TabsContent value="work" className="p-6 pt-4">
                <div className="space-y-6">
                  {workHistory.length > 0 ? (
                    workHistory.map((work) => (
                      <div key={work.id} className="border-l-2 border-green-500 pl-4 pb-6 relative">
                        <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1"></div>
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{work.department} - {work.position}</h3>
                            <p className="text-sm text-gray-500">{work.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{work.startDate} ~ {work.endDate || '至今'}</p>
                            <Badge variant="outline" className="mt-1">
                              {work.endDate ? '已结束' : '当前'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      暂无工作履历记录
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="p-6 pt-4">
                <div className="space-y-6">
                  {projectHistory.length > 0 ? (
                    projectHistory.map((project) => (
                      <Card key={project.id} className="border border-gray-200">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{project.name}</CardTitle>
                              <CardDescription>角色: {project.role}</CardDescription>
                            </div>
                            <Badge className={
                              project.status === '已完成' ? 'bg-green-100 text-green-800' :
                              project.status === '进行中' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }>
                              {project.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm">
                          <p className="text-gray-500">
                            {project.startDate} ~ {project.endDate || '至今'}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      暂无项目经历记录
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="p-6 pt-4">
                <div className="space-y-6">
                  {performanceHistory.length > 0 ? (
                    performanceHistory.map((performance) => (
                      <Card key={performance.id} className="border border-gray-200">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{performance.name}</CardTitle>
                            <div className="flex items-center">
                              <span className={`text-lg font-bold ${
                                performance.score >= 90 ? 'text-green-600' :
                                performance.score >= 80 ? 'text-blue-600' :
                                performance.score >= 70 ? 'text-amber-600' :
                                'text-red-600'
                              }`}>
                                {performance.score}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">分</span>
                            </div>
                          </div>
                          <CardDescription>评估日期: {performance.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="flex justify-between items-start">
                            <p className="text-sm">{performance.comment}</p>
                            <Badge variant="outline">评估人: {performance.evaluator}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      暂无绩效记录
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 