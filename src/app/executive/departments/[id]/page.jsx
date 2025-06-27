'use client';

import { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  User, 
  ChevronLeft,
  BarChart4,
  Network,
  TrendingUp,
  UserCog
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BasicTable } from '@/components/shared/tables/BasicTable';
import { getAllDepartments, getDepartmentById } from '@/lib/services/departmentService';
import { getAllEmployees } from '@/lib/services/employeeService';

// 部门员工表头
const departmentEmployeeColumns = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: '姓名',
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 font-medium">
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{employee.name}</div>
            <div className="text-xs text-gray-500">{employee.position || '未设置职位'}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'position',
    header: '职位',
  },
  {
    accessorKey: 'phone',
    header: '联系电话',
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge className={
          status === '在职' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
          status === '离职' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
          'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
        }>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'hireDate',
    header: '入职日期',
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" asChild>
          <a href={`/executive/employees/${row.original.id}`}>
            <User className="h-4 w-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" asChild>
          <a href={`/executive/transfers/new?employeeId=${row.original.id}`}>
            <UserCog className="h-4 w-4" />
          </a>
        </Button>
      </div>
    ),
  },
];

export default function DepartmentDetailPage({ params }) {
  const [department, setDepartment] = useState(null);
  const [departmentEmployees, setDepartmentEmployees] = useState([]);
  const [parentDepartment, setParentDepartment] = useState(null);
  const [childDepartments, setChildDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDepartmentData() {
      setLoading(true);
      try {
        // 获取部门数据
        const departments = await getAllDepartments();
        const targetDepartment = departments.find(d => d.id === parseInt(params.id));
        
        if (!targetDepartment) {
          throw new Error('未找到部门信息');
        }
        
        // 获取员工数据
        const employees = await getAllEmployees();
        
        // 筛选部门员工
        const deptEmployees = employees.filter(emp => 
          emp.departmentId === targetDepartment.id || emp.department === targetDepartment.name
        );
        
        // 查找父部门
        const parent = departments.find(d => d.id === targetDepartment.parentId);
        
        // 查找子部门
        const children = departments.filter(d => d.parentId === targetDepartment.id);
        
        // 查找部门经理
        const manager = employees.find(emp => emp.id === targetDepartment.managerId);
        
        setDepartment({
          ...targetDepartment,
          managerName: manager ? manager.name : '未分配',
          employeeCount: deptEmployees.length,
          // 模拟部门数据
          efficiency: Math.floor(Math.random() * 40) + 60,
          budget: Math.floor(Math.random() * 500) + 500,
          projects: Math.floor(Math.random() * 10) + 1,
        });
        
        setDepartmentEmployees(deptEmployees);
        setParentDepartment(parent || null);
        setChildDepartments(children);
        
      } catch (err) {
        console.error('获取部门数据失败:', err);
        setError(err.message || '获取部门数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    }

    fetchDepartmentData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
          <p className="text-green-600 font-medium">加载部门数据中...</p>
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 返回按钮 */}
      <div>
        <Button variant="outline" onClick={() => window.history.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          返回部门列表
        </Button>
      </div>

      {/* 部门基本信息卡片 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <CardTitle className="flex items-center text-green-800">
              <Building className="h-5 w-5 mr-2 text-green-600" />
              部门信息
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl font-bold mb-3">
                {department.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold text-center">{department.name}</h2>
              
              {parentDepartment && (
                <p className="text-sm text-gray-500 mt-1">
                  上级部门: {parentDepartment.name}
                </p>
              )}
              
              <Badge className="mt-2 bg-green-100 text-green-800">
                {childDepartments.length > 0 ? `${childDepartments.length}个下属部门` : '无下属部门'}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">部门负责人</p>
                  <p>{department.managerName}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">员工数量</p>
                  <p>{department.employeeCount} 人</p>
                </div>
              </div>

              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">部门效能</p>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          department.efficiency >= 80 ? 'bg-green-500' :
                          department.efficiency >= 70 ? 'bg-blue-500' :
                          'bg-amber-500'
                        }`}
                        style={{ width: `${department.efficiency}%` }}
                      ></div>
                    </div>
                    <span className={`text-sm ${
                      department.efficiency >= 80 ? 'text-green-600' :
                      department.efficiency >= 70 ? 'text-blue-600' :
                      'text-amber-600'
                    }`}>
                      {department.efficiency}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="bg-green-50 border-b border-green-100 px-6 py-4">
            <Tabs defaultValue="employees">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="employees" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  <Users className="h-4 w-4 mr-2" />
                  部门员工
                </TabsTrigger>
                <TabsTrigger value="structure" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  <Network className="h-4 w-4 mr-2" />
                  组织架构
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  部门绩效
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="employees">
              <TabsContent value="employees" className="p-0">
                <BasicTable
                  columns={departmentEmployeeColumns}
                  data={departmentEmployees}
                  loading={loading}
                />
              </TabsContent>

              <TabsContent value="structure" className="p-6">
                <div className="flex flex-col items-center space-y-6">
                  {parentDepartment && (
                    <div className="w-full flex flex-col items-center">
                      <div className="text-sm text-gray-500 mb-2">上级部门</div>
                      <Card className="w-48 bg-blue-50 border-blue-200">
                        <CardContent className="p-3 text-center">
                          <p className="font-medium">{parentDepartment.name}</p>
                        </CardContent>
                      </Card>
                      <div className="h-6 w-px bg-gray-300"></div>
                    </div>
                  )}
                  
                  <Card className="w-64 bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <p className="font-medium text-lg">{department.name}</p>
                      <p className="text-sm text-gray-500 mt-1">{department.employeeCount}人</p>
                    </CardContent>
                  </Card>
                  
                  {childDepartments.length > 0 && (
                    <div className="w-full">
                      <div className="h-6 w-px bg-gray-300 mx-auto"></div>
                      <div className="text-sm text-gray-500 text-center mb-4">下属部门</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-items-center">
                        {childDepartments.map(child => (
                          <Card key={child.id} className="w-40 bg-amber-50 border-amber-200 hover:shadow-md transition-shadow">
                            <CardContent className="p-3 text-center">
                              <a href={`/executive/departments/${child.id}`} className="block">
                                <p className="font-medium">{child.name}</p>
                              </a>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="performance" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Users className="h-5 w-5 text-green-600 mr-2" />
                        员工人数
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{department.employeeCount}</div>
                      <p className="text-sm text-muted-foreground mt-1">名员工</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <BarChart4 className="h-5 w-5 text-green-600 mr-2" />
                        效能指数
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{department.efficiency}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${
                            department.efficiency >= 80 ? 'bg-green-500' :
                            department.efficiency >= 70 ? 'bg-blue-500' :
                            'bg-amber-500'
                          }`}
                          style={{ width: `${department.efficiency}%` }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                        项目数量
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{department.projects}</div>
                      <p className="text-sm text-muted-foreground mt-1">个进行中项目</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>部门季度绩效趋势</CardTitle>
                    <CardDescription>最近四个季度的部门绩效变化</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 flex items-end space-x-6 pt-10 px-10">
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, index) => {
                        // 生成随机高度，但确保有一定的趋势
                        const baseHeight = 30 + index * 10; // 基础高度随季度增加
                        const randomFactor = Math.random() * 20 - 10; // -10到+10的随机值
                        const height = baseHeight + randomFactor;
                        const percentage = Math.min(100, Math.max(0, height)); // 确保在0-100之间
                        
                        return (
                          <div key={quarter} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-green-100 rounded-t-md" style={{ height: `${percentage}%` }}>
                              <div 
                                className="w-full h-full bg-green-500 rounded-t-md flex items-center justify-center text-white text-sm font-medium"
                                style={{ opacity: 0.3 + (index * 0.2) }} // 透明度随季度增加
                              >
                                {Math.round(percentage)}%
                              </div>
                            </div>
                            <div className="mt-2 text-sm font-medium">{quarter}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 