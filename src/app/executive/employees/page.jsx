'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Filter, Building } from 'lucide-react';
import { getAllEmployees } from '@/lib/services/employeeService';
import { getAllDepartments } from '@/lib/services/departmentService';
import api from '@/lib/api';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取员工数据
      const employeesData = await getAllEmployees();
      
      // 获取部门数据
      const departmentsData = await getAllDepartments();
      
      // 获取员工-部门关系数据
      let employeeDepts = [];
      try {
        const response = await api.get('/employee-departments');
        if (response.data && response.data.data) {
          employeeDepts = response.data.data.filter(ed => ed.isCurrent === 1);
        }
      } catch (error) {
        console.error('获取员工-部门关系数据失败:', error);
      }
      
      // 为员工添加部门和职位信息
      const enrichedEmployees = employeesData.map(emp => {
        const empDept = employeeDepts.find(ed => ed.empId === emp.id);
        const department = empDept ? departmentsData.find(d => d.id === empDept.depId) : null;
        
        return {
          ...emp,
          departmentName: department ? department.name : '未分配',
          departmentId: empDept?.depId || null,
          position: empDept?.position || '未设置职位'
        };
      });
      
      setEmployees(enrichedEmployees);
      setDepartments(departmentsData);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤员工数据
  const filteredEmployees = employees.filter(employee => {
    // 搜索过滤
    const matchesSearch = 
      searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm) ||
      (employee.position && employee.position.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // 状态过滤
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    
    // 部门过滤
    const matchesDepartment = 
      departmentFilter === 'all' || 
      employee.departmentId === parseInt(departmentFilter);
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">员工信息</h1>
          <p className="text-gray-500">查看公司所有员工信息</p>
        </div>
      </div>

      {/* 筛选和搜索 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 text-green-600 mr-2" />
            筛选员工
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="搜索员工姓名、电话或职位..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="在职">在职</SelectItem>
                <SelectItem value="离职">离职</SelectItem>
                <SelectItem value="借调">借调</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="选择部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有部门</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 员工列表 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
        </div>
      ) : filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-lg font-medium">
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
              </div>
              <CardContent className="border-t border-gray-100 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">部门</span>
                  <span className="font-medium text-sm flex items-center">
                    <Building className="h-3 w-3 mr-1 text-gray-400" />
                    {employee.departmentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">联系电话</span>
                  <span className="font-medium text-sm">{employee.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">状态</span>
                  <Badge className={
                    employee.status === '在职' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                    employee.status === '离职' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                    'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                  }>
                    {employee.status}
                  </Badge>
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
          <h3 className="text-lg font-medium text-gray-900">未找到员工</h3>
          <p className="text-gray-500">尝试调整搜索条件或筛选器</p>
        </div>
      )}
    </div>
  );
} 