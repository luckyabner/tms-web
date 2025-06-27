'use client';

import { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  User, 
  ChevronLeft,
  BarChart4,
  TrendingUp,
  UserCog
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';

export default function DepartmentDetailPage({ params }) {
  const departmentId = params.id;
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDepartmentData();
  }, [departmentId]);

  const fetchDepartmentData = async () => {
    setLoading(true);
    try {
      // 获取部门详情
      const departmentResponse = await api.get(`/departments/${departmentId}`);
      if (departmentResponse.data && departmentResponse.data.data) {
        setDepartment(departmentResponse.data.data);
      }
      
      // 获取部门员工
      const employeesResponse = await api.get(`/employee-departments/departments/${departmentId}`);
      if (employeesResponse.data && employeesResponse.data.data) {
        // 获取员工详情
        const employeeDetails = [];
        for (const empDept of employeesResponse.data.data) {
          try {
            const empResponse = await api.get(`/employees/${empDept.empId}`);
            if (empResponse.data && empResponse.data.data) {
              employeeDetails.push({
                ...empResponse.data.data,
                position: empDept.position || '未设置职位',
                isSuperior: empDept.superiorId === null
              });
            }
          } catch (error) {
            console.error(`获取员工 ${empDept.empId} 详情失败:`, error);
          }
        }
        setEmployees(employeeDetails);
      }
    } catch (error) {
      console.error('获取部门数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取部门经理
  const getDepartmentManager = () => {
    if (!department || !department.managerId) return null;
    return employees.find(emp => emp.id === department.managerId);
  };

  // 获取上级部门
  const getParentDepartment = async () => {
    if (!department || !department.parentId) return null;
    try {
      const response = await api.get(`/departments/${department.parentId}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (error) {
      console.error('获取上级部门失败:', error);
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 返回按钮和标题 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/executive/departments">
            <ChevronLeft className="h-5 w-5" />
          </a>
        </Button>
        <h1 className="text-2xl font-bold">
          {loading ? '加载中...' : department ? department.name : '部门详情'}
        </h1>
      </div>

      {loading ? (
        // 加载中状态
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
        </div>
      ) : department ? (
        <>
          {/* 部门基本信息卡片 */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6" />
                {department.name}
              </CardTitle>
              <CardDescription className="text-green-100">
                部门ID: {department.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">部门主管</h3>
                  <p className="text-lg font-medium">
                    {department.managerId ? 
                      getDepartmentManager()?.name || `ID: ${department.managerId}` : 
                      '未指定'
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">上级部门</h3>
                  <p className="text-lg font-medium">
                    {department.parentId ? `ID: ${department.parentId}` : '无'}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">员工数量</h3>
                  <p className="text-lg font-medium">{employees.length} 人</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">创建时间</h3>
                  <p className="text-lg font-medium">
                    {department.createdAt ? new Date(department.createdAt).toLocaleDateString('zh-CN') : '未知'}
                  </p>
                </div>
              </div>
              
              {department.description && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">部门描述</h3>
                  <p className="mt-1 text-gray-700">{department.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 标签页 */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4" />
                部门概览
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                部门成员
              </TabsTrigger>
            </TabsList>
            
            {/* 部门概览 */}
            <TabsContent value="overview" className="space-y-6">
              {/* 部门统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="h-5 w-5 text-green-600 mr-2" />
                      员工数量
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{employees.length}</div>
                    <p className="text-sm text-muted-foreground mt-1">部门成员</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 text-green-600 mr-2" />
                      部门主管
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">
                      {department.managerId ? 
                        getDepartmentManager()?.name || `ID: ${department.managerId}` : 
                        '未指定'
                      }
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">负责人</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                      部门绩效
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">--</div>
                    <p className="text-sm text-muted-foreground mt-1">暂无数据</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* 部门操作 */}
              <Card>
                <CardHeader>
                  <CardTitle>部门操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                    <a href={`/executive/transfers/new`}>
                      <UserCog className="mr-2 h-4 w-4" />
                      发起人事调动
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* 部门成员 */}
            <TabsContent value="employees" className="space-y-6">
              {employees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map((employee) => (
                    <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4 flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-lg font-medium">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium flex items-center gap-2">
                            {employee.name}
                            {employee.id === department.managerId && (
                              <Badge className="bg-green-100 text-green-800">主管</Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">{employee.position}</p>
                        </div>
                      </div>
                      <CardContent className="border-t border-gray-100 p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">联系电话</span>
                          <span className="font-medium text-sm">{employee.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">入职日期</span>
                          <span className="font-medium text-sm">
                            {new Date(employee.hireDate).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <Button className="w-full mt-2 bg-green-600 hover:bg-green-700" asChild>
                          <a href={`/executive/employees/${employee.id}`}>
                            查看详情
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">暂无员工</h3>
                  <p className="text-gray-500">该部门目前没有员工</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">部门不存在</h3>
          <p className="text-gray-500">未找到ID为 {departmentId} 的部门</p>
          <Button className="mt-4" variant="outline" asChild>
            <a href="/executive/departments">返回部门列表</a>
          </Button>
        </div>
      )}
    </div>
  );
} 