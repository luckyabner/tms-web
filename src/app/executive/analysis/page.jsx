'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart4, 
  PieChart, 
  LineChart as LineChartIcon, 
  Building, 
  Users, 
  Download,
  Filter,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as PieChartComponent,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { getAllDepartments } from '@/lib/services/departmentService';
import { getAllEmployees } from '@/lib/services/employeeService';

export default function DepartmentAnalysisPage() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const deptData = await getAllDepartments();
        const empData = await getAllEmployees();
        
        // 为部门添加一些模拟的分析数据
        const processedDepartments = deptData.map(dept => {
          const departmentEmployees = empData.filter(emp => 
            emp.departmentId === dept.id || emp.department === dept.name
          );
          
          return {
            ...dept,
            employeeCount: departmentEmployees.length,
            efficiency: Math.floor(Math.random() * 40) + 60,
            budget: Math.floor(Math.random() * 500) + 500,
            growth: Math.floor(Math.random() * 40) - 20,
            performance: Math.floor(Math.random() * 30) + 70,
          };
        });
        
        setDepartments(processedDepartments);
        setEmployees(empData);
      } catch (error) {
        console.error('获取分析数据失败:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 生成部门员工分布数据
  const departmentDistributionData = departments.map(dept => ({
    name: dept.name,
    value: dept.employeeCount || 0
  })).filter(item => item.value > 0);

  // 生成部门效能数据
  const departmentEfficiencyData = departments.map(dept => ({
    name: dept.name,
    效能指数: dept.efficiency || 0
  }));

  // 生成部门绩效数据
  const departmentPerformanceData = departments.map(dept => ({
    name: dept.name,
    绩效: dept.performance || 0,
    增长率: dept.growth || 0
  }));

  // 生成季度绩效趋势
  const generateQuarterlyData = () => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    return quarters.map(quarter => {
      const data = { name: quarter };
      departments.slice(0, 5).forEach(dept => {
        // 为每个部门生成一个随机的季度绩效数据，但保持一定的增长趋势
        const baseValue = quarters.indexOf(quarter) * 5 + (Math.random() * 10 - 5);
        data[dept.name] = Math.max(60, Math.min(95, dept.performance + baseValue));
      });
      return data;
    });
  };

  const quarterlyPerformanceData = generateQuarterlyData();

  // 饼图颜色
  const COLORS = ['#10b981', '#14b8a6', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  const renderDepartmentChart = () => {
    if (departments.length === 0) {
      return (
        <div className="flex items-center justify-center h-60 bg-gray-50 rounded-lg">
          <p className="text-gray-500">暂无部门数据</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart 
          data={departmentEfficiencyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="效能指数" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderEmployeeDistribution = () => {
    if (departmentDistributionData.length === 0) {
      return (
        <div className="flex items-center justify-center h-60 bg-gray-50 rounded-lg">
          <p className="text-gray-500">暂无员工分布数据</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChartComponent>
          <Pie
            data={departmentDistributionData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {departmentDistributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}人`, '员工数']} />
        </PieChartComponent>
      </ResponsiveContainer>
    );
  };

  const renderPerformanceTrend = () => {
    if (quarterlyPerformanceData.length === 0) {
      return (
        <div className="flex items-center justify-center h-60 bg-gray-50 rounded-lg">
          <p className="text-gray-500">暂无绩效趋势数据</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={quarterlyPerformanceData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {departments.slice(0, 5).map((dept, index) => (
            <Line 
              key={dept.id} 
              type="monotone" 
              dataKey={dept.name} 
              stroke={COLORS[index % COLORS.length]} 
              activeDot={{ r: 8 }} 
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const renderGrowthComparison = () => {
    if (departmentPerformanceData.length === 0) {
      return (
        <div className="flex items-center justify-center h-60 bg-gray-50 rounded-lg">
          <p className="text-gray-500">暂无增长率数据</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={departmentPerformanceData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="绩效" fill="#10b981" />
          <Bar dataKey="增长率" fill="#0ea5e9" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          部门分析
        </h1>
        <p className="text-muted-foreground">查看部门绩效与人员分布情况</p>
      </div>

      {/* 操作栏 */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            筛选
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            刷新数据
          </Button>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 gap-2">
          <Download className="h-4 w-4" />
          导出报表
        </Button>
      </div>

      {/* 分析内容 */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
            <BarChart4 className="h-4 w-4 mr-2" />
            总览
          </TabsTrigger>
          <TabsTrigger value="distribution" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
            <PieChart className="h-4 w-4 mr-2" />
            人员分布
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
            <LineChartIcon className="h-4 w-4 mr-2" />
            绩效趋势
          </TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
            <Building className="h-4 w-4 mr-2" />
            部门对比
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* 关键指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Building className="h-5 w-5 text-green-600 mr-2" />
                  总部门数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{departments.length}</div>
                <p className="text-sm text-muted-foreground mt-1">个组织单元</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 text-green-600 mr-2" />
                  总员工数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{employees.length}</div>
                <p className="text-sm text-muted-foreground mt-1">名在职员工</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart4 className="h-5 w-5 text-green-600 mr-2" />
                  平均效能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {departments.length > 0 
                    ? Math.round(departments.reduce((sum, dept) => sum + (dept.efficiency || 0), 0) / departments.length) 
                    : 0}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">部门平均效能指数</p>
              </CardContent>
            </Card>
          </div>

          {/* 部门效能对比图 */}
          <Card>
            <CardHeader>
              <CardTitle>部门效能对比</CardTitle>
              <CardDescription>各部门效能指数对比分析</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                renderDepartmentChart()
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>员工部门分布</CardTitle>
              <CardDescription>各部门人员占比情况</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                renderEmployeeDistribution()
              )}
            </CardContent>
          </Card>

          {/* 部门人员明细 */}
          <Card>
            <CardHeader>
              <CardTitle>部门人员明细</CardTitle>
              <CardDescription>各部门人员数量及占比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse flex items-center justify-between">
                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                          <div className="h-4 bg-gray-200 rounded w-12"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : departments.length > 0 ? (
                  departments
                    .sort((a, b) => (b.employeeCount || 0) - (a.employeeCount || 0))
                    .map(dept => {
                      const percentage = employees.length > 0 
                        ? ((dept.employeeCount || 0) / employees.length * 100).toFixed(1) 
                        : 0;
                      
                      return (
                        <div key={dept.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{dept.employeeCount || 0} 人</span>
                              <span className="text-xs text-gray-500">({percentage}%)</span>
                            </div>
                            <div className="w-24 bg-gray-100 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    暂无部门数据
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>季度绩效趋势</CardTitle>
              <CardDescription>各部门绩效季度变化趋势</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                renderPerformanceTrend()
              )}
            </CardContent>
          </Card>

          {/* 部门绩效明细 */}
          <Card>
            <CardHeader>
              <CardTitle>部门绩效明细</CardTitle>
              <CardDescription>各部门绩效评分</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse flex items-center justify-between">
                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                    ))}
                  </div>
                ) : departments.length > 0 ? (
                  departments
                    .sort((a, b) => (b.performance || 0) - (a.performance || 0))
                    .map(dept => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`font-medium ${
                            (dept.performance || 0) >= 85 ? 'text-green-600' : 
                            (dept.performance || 0) >= 75 ? 'text-blue-600' : 
                            'text-amber-600'
                          }`}>
                            {dept.performance || 0}分
                          </div>
                          <div className="w-24 bg-gray-100 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (dept.performance || 0) >= 85 ? 'bg-green-500' : 
                                (dept.performance || 0) >= 75 ? 'bg-blue-500' : 
                                'bg-amber-500'
                              }`}
                              style={{ width: `${dept.performance || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    暂无绩效数据
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>部门绩效与增长对比</CardTitle>
              <CardDescription>各部门绩效与增长率对比分析</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                renderGrowthComparison()
              )}
            </CardContent>
          </Card>

          {/* 部门增长率排名 */}
          <Card>
            <CardHeader>
              <CardTitle>部门增长率排名</CardTitle>
              <CardDescription>各部门增长率从高到低排序</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse flex items-center justify-between">
                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : departments.length > 0 ? (
                  departments
                    .sort((a, b) => (b.growth || 0) - (a.growth || 0))
                    .map(dept => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <div className={`font-medium ${
                          (dept.growth || 0) > 0 ? 'text-green-600' : 
                          (dept.growth || 0) === 0 ? 'text-gray-600' : 
                          'text-red-600'
                        }`}>
                          {(dept.growth || 0) > 0 ? '+' : ''}{dept.growth || 0}%
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    暂无增长率数据
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