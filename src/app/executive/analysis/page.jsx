'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart4, PieChart, Building, Users } from 'lucide-react';
import { getAllDepartments } from '@/lib/services/departmentService';
import { getAllEmployees } from '@/lib/services/employeeService';
import api from '@/lib/api';

export default function AnalysisPage() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeDepartments, setEmployeeDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取部门数据
      const departmentsData = await getAllDepartments();
      setDepartments(departmentsData);
      
      // 获取员工数据
      const employeesData = await getAllEmployees();
      setEmployees(employeesData);
      
      // 获取员工-部门关系数据
      try {
        const response = await api.get('/employee-departments');
        if (response.data && response.data.data) {
          setEmployeeDepartments(response.data.data.filter(ed => ed.isCurrent === 1));
        }
      } catch (error) {
        console.error('获取员工-部门关系数据失败:', error);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 计算各部门员工数量
  const getDepartmentEmployeeCounts = () => {
    const counts = {};
    departments.forEach(dept => {
      counts[dept.id] = 0;
    });
    
    employeeDepartments.forEach(empDept => {
      if (counts[empDept.depId] !== undefined) {
        counts[empDept.depId]++;
      }
    });
    
    return counts;
  };

  // 计算员工状态分布
  const getEmployeeStatusDistribution = () => {
    const statusCounts = {
      '在职': 0,
      '离职': 0,
      '借调': 0
    };
    
    employees.forEach(emp => {
      if (statusCounts[emp.status] !== undefined) {
        statusCounts[emp.status]++;
      }
    });
    
    return statusCounts;
  };

  const departmentEmployeeCounts = getDepartmentEmployeeCounts();
  const employeeStatusDistribution = getEmployeeStatusDistribution();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">数据分析</h1>
        <p className="text-gray-500">查看公司人员和部门数据分析</p>
      </div>

      <Tabs defaultValue="departments">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            部门分析
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            员工分析
          </TabsTrigger>
        </TabsList>
        
        {/* 部门分析 */}
        <TabsContent value="departments" className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
            </div>
          ) : (
            <>
              {/* 部门人员分布 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    部门人员分布
                  </CardTitle>
                  <CardDescription>各部门员工数量统计</CardDescription>
                </CardHeader>
                <CardContent>
                  {departments.length > 0 ? (
                    <div className="space-y-4">
                      {departments.map(dept => (
                        <div key={dept.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{dept.name}</span>
                            <span className="text-sm text-gray-500">{departmentEmployeeCounts[dept.id] || 0} 人</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ 
                                width: `${Math.max(
                                  5, 
                                  Math.min(
                                    100, 
                                    ((departmentEmployeeCounts[dept.id] || 0) / Math.max(1, employees.length)) * 100
                                  )
                                )}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">暂无部门数据</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 部门结构分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-green-600" />
                    部门结构分析
                  </CardTitle>
                  <CardDescription>部门层级和结构统计</CardDescription>
                </CardHeader>
                <CardContent>
                  {departments.length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                          <div className="text-3xl font-bold text-green-700">{departments.length}</div>
                          <div className="text-sm text-green-600">总部门数</div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                          <div className="text-3xl font-bold text-green-700">
                            {departments.filter(d => d.parentId === null).length}
                          </div>
                          <div className="text-sm text-green-600">一级部门</div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                          <div className="text-3xl font-bold text-green-700">
                            {departments.filter(d => d.parentId !== null).length}
                          </div>
                          <div className="text-sm text-green-600">子部门</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">部门层级分布</h3>
                        <div className="flex gap-1">
                          {departments
                            .filter(d => d.parentId === null)
                            .map(dept => (
                              <div 
                                key={dept.id} 
                                className="flex-1 bg-green-600 h-8 rounded-md flex items-center justify-center text-xs text-white"
                                title={dept.name}
                              >
                                {dept.name.length > 4 ? `${dept.name.substring(0, 4)}...` : dept.name}
                              </div>
                            ))}
                        </div>
                        <div className="flex gap-1">
                          {departments
                            .filter(d => d.parentId !== null)
                            .map(dept => (
                              <div 
                                key={dept.id} 
                                className="flex-1 bg-teal-500 h-6 rounded-md flex items-center justify-center text-xs text-white"
                                title={dept.name}
                              >
                                {dept.name.length > 3 ? `${dept.name.substring(0, 3)}...` : dept.name}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">暂无部门数据</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        {/* 员工分析 */}
        <TabsContent value="employees" className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
            </div>
          ) : (
            <>
              {/* 员工状态分布 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    员工状态分布
                  </CardTitle>
                  <CardDescription>员工在职、离职等状态统计</CardDescription>
                </CardHeader>
                <CardContent>
                  {employees.length > 0 ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                          <div className="text-3xl font-bold text-green-700">{employeeStatusDistribution['在职'] || 0}</div>
                          <div className="text-sm text-green-600">在职员工</div>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-center">
                          <div className="text-3xl font-bold text-red-700">{employeeStatusDistribution['离职'] || 0}</div>
                          <div className="text-sm text-red-600">离职员工</div>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-center">
                          <div className="text-3xl font-bold text-yellow-700">{employeeStatusDistribution['借调'] || 0}</div>
                          <div className="text-sm text-yellow-600">借调员工</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">员工状态占比</h3>
                        <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-green-600 h-full" 
                            style={{ 
                              width: `${(employeeStatusDistribution['在职'] / employees.length) * 100}%` 
                            }}
                          ></div>
                          <div 
                            className="bg-red-500 h-full" 
                            style={{ 
                              width: `${(employeeStatusDistribution['离职'] / employees.length) * 100}%` 
                            }}
                          ></div>
                          <div 
                            className="bg-yellow-500 h-full" 
                            style={{ 
                              width: `${(employeeStatusDistribution['借调'] / employees.length) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>在职: {((employeeStatusDistribution['在职'] / employees.length) * 100).toFixed(1)}%</span>
                          <span>离职: {((employeeStatusDistribution['离职'] / employees.length) * 100).toFixed(1)}%</span>
                          <span>借调: {((employeeStatusDistribution['借调'] / employees.length) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">暂无员工数据</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 员工总体统计 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-green-600" />
                    员工总体统计
                  </CardTitle>
                  <CardDescription>员工数量和分布统计</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                      <div className="text-3xl font-bold text-green-700">{employees.length}</div>
                      <div className="text-sm text-green-600">总员工数</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                      <div className="text-3xl font-bold text-green-700">
                        {departments.length > 0 ? (employees.length / departments.length).toFixed(1) : 0}
                      </div>
                      <div className="text-sm text-green-600">平均部门人数</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                      <div className="text-3xl font-bold text-green-700">
                        {Object.values(departmentEmployeeCounts).length > 0 
                          ? Math.max(...Object.values(departmentEmployeeCounts)) 
                          : 0}
                      </div>
                      <div className="text-sm text-green-600">最大部门人数</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}