'use client';

import { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  User, 
  ChevronLeft,
  BarChart4,
  TrendingUp,
  UserCog,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
  const [parentDepartment, setParentDepartment] = useState(null);
  const [childDepartments, setChildDepartments] = useState([]);

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
        
        // 如果有父部门，获取父部门信息
        if (departmentResponse.data.data.parentId) {
          try {
            const parentResponse = await api.get(`/departments/${departmentResponse.data.data.parentId}`);
            if (parentResponse.data && parentResponse.data.data) {
              setParentDepartment(parentResponse.data.data);
            }
          } catch (error) {
            console.error('获取父部门信息失败:', error);
          }
        }
        
        // 获取所有部门，找出子部门
        try {
          const allDepartmentsResponse = await api.get('/departments');
          if (allDepartmentsResponse.data && allDepartmentsResponse.data.data) {
            const children = allDepartmentsResponse.data.data.filter(
              dept => dept.parentId === parseInt(departmentId)
            );
            setChildDepartments(children);
          }
        } catch (error) {
          console.error('获取子部门信息失败:', error);
        }
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

  // 按职级/角色分组员工
  const groupEmployeesByRole = () => {
    const manager = employees.find(emp => emp.id === department?.managerId);
    const leaders = employees.filter(emp => 
      emp.id !== department?.managerId && 
      (emp.position?.includes('经理') || emp.position?.includes('主管') || emp.position?.includes('总监'))
    );
    const regularEmployees = employees.filter(emp => 
      emp.id !== department?.managerId && 
      !(emp.position?.includes('经理') || emp.position?.includes('主管') || emp.position?.includes('总监'))
    );
    
    return {
      manager: manager ? [manager] : [],
      leaders,
      regularEmployees
    };
  };

  const { manager, leaders, regularEmployees } = groupEmployeesByRole();

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 返回按钮和标题 */}
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" asChild>
          <a href="/executive/departments">
            <ChevronLeft className="h-5 w-5" />
          </a>
        </Button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
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
          <Card className="border-green-100 shadow-sm overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-green-500 to-teal-500"></div>
            <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xl font-medium">
                    {department.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-xl text-green-800">{department.name}</CardTitle>
                    <CardDescription className="text-green-700">
                      部门ID: {department.id}
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  {employees.length} 名员工
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    部门主管
                  </h3>
                  <p className="text-lg font-medium">
                    {department.managerId ? 
                      getDepartmentManager()?.name || `ID: ${department.managerId}` : 
                      '未指定'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Building className="h-4 w-4 text-green-600" />
                    上级部门
                  </h3>
                  <p className="text-lg font-medium">
                    {parentDepartment ? parentDepartment.name : '无上级部门'}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    创建时间
                  </h3>
                  <p className="text-lg font-medium">
                    {department.createdAt ? new Date(department.createdAt).toLocaleDateString('zh-CN') : '未知'}
                  </p>
                </div>
              </div>
              
              {department.description && (
                <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-green-600" />
                    部门描述
                  </h3>
                  <p className="text-gray-700">{department.description}</p>
                </div>
              )}

              {childDepartments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-green-600" />
                    下属部门
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {childDepartments.map(child => (
                      <Badge 
                        key={child.id} 
                        className="bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer"
                        onClick={() => window.location.href = `/executive/departments/${child.id}`}
                      >
                        {child.name}
                      </Badge>
                    ))}
                  </div>
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
                <Card className="border-green-100 shadow-sm">
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
                
                <Card className="border-green-100 shadow-sm">
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
                
                <Card className="border-green-100 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="h-5 w-5 text-green-600 mr-2" />
                      部门历史
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">
                      {department.createdAt ? 
                        new Date().getFullYear() - new Date(department.createdAt).getFullYear() : 
                        '--'
                      }年
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">成立时间</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* 部门操作 */}
              <Card className="border-green-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    部门操作
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700" asChild>
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
              {/* 部门主管 */}
              {manager.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2 text-green-800">
                    <User className="h-5 w-5 text-green-600" />
                    部门主管
                  </h3>
                  <Card className="border-green-100 shadow-sm overflow-hidden">
                    <div className="h-2 bg-green-600"></div>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-xl font-medium">
                          {manager[0].name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-medium">{manager[0].name}</h3>
                          <p className="text-green-600">{manager[0].position}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {manager[0].phone}
                            </span>
                            <Badge className={
                              manager[0].status === '在职' ? 'bg-green-100 text-green-800' :
                              manager[0].status === '离职' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {manager[0].status}
                            </Badge>
                          </div>
                        </div>
                        <div className="ml-auto">
                          <Button className="bg-green-600 hover:bg-green-700" asChild>
                            <a href={`/executive/employees/${manager[0].id}`}>
                              查看详情
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* 部门领导 */}
              {leaders.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium flex items-center gap-2 text-green-800">
                    <Users className="h-5 w-5 text-green-600" />
                    部门领导
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leaders.map(leader => (
                      <Card key={leader.id} className="border-green-100 shadow-sm overflow-hidden">
                        <div className="h-1 bg-teal-500"></div>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-green-400 flex items-center justify-center text-white text-lg font-medium">
                              {leader.name.charAt(0)}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-medium">{leader.name}</h4>
                              <p className="text-sm text-teal-600">{leader.position}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Phone className="h-3 w-3" />
                                {leader.phone}
                              </div>
                            </div>
                            <div className="ml-auto">
                              <Button size="sm" className="bg-teal-600 hover:bg-teal-700" asChild>
                                <a href={`/executive/employees/${leader.id}`}>
                                  查看
                                </a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* 普通员工 */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium flex items-center gap-2 text-green-800">
                  <Users className="h-5 w-5 text-green-600" />
                  部门成员
                </h3>
                {regularEmployees.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regularEmployees.map((employee) => (
                      <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow border-green-100">
                        <div className="p-4 flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-300 flex items-center justify-center text-white text-base font-medium">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium">{employee.name}</h3>
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
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">暂无其他员工</p>
                  </div>
                )}
              </div>
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