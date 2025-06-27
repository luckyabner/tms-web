'use client';

import { useState, useEffect } from 'react';
import { Search, User, Filter, ChevronRight, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllEmployees } from '@/lib/services/employeeService';
import { getAllDepartments } from '@/lib/services/departmentService';
import api from '@/lib/api';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取所有员工
      const employeesData = await getAllEmployees();
      
      // 获取所有部门
      const departmentsData = await getAllDepartments();
      
      // 获取员工-部门关系
      let employeeDepartments = [];
      try {
        const response = await api.get('/employee-departments');
        if (response.data && response.data.data) {
          employeeDepartments = response.data.data.filter(ed => ed.isCurrent === 1);
        }
      } catch (error) {
        console.error('获取员工-部门关系数据失败:', error);
      }
      
      // 为员工添加部门信息
      const enrichedEmployees = employeesData.map(emp => {
        const employeeDept = employeeDepartments.find(ed => ed.empId === emp.id);
        const department = employeeDept ? departmentsData.find(d => d.id === employeeDept.depId) : null;
        
        return {
          ...emp,
          departmentId: employeeDept?.depId || null,
          departmentName: department?.name || '未分配',
          position: employeeDept?.position || '未设置职位'
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

  // 处理搜索
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 处理部门筛选
  const handleDepartmentFilter = (e) => {
    setFilterDepartment(e.target.value);
  };

  // 处理状态筛选
  const handleStatusFilter = (e) => {
    setFilterStatus(e.target.value);
  };

  // 筛选员工
  const filteredEmployees = employees.filter(emp => {
    // 搜索条件
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone.includes(searchTerm) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 部门筛选
    const matchesDepartment = !filterDepartment || emp.departmentId === parseInt(filterDepartment);
    
    // 状态筛选
    const matchesStatus = !filterStatus || emp.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">员工管理</h1>
          <p className="text-gray-500">查看和管理公司所有员工</p>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="搜索员工姓名、电话或职位..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <select
            className="w-full h-10 pl-8 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filterDepartment}
            onChange={handleDepartmentFilter}
          >
            <option value="">所有部门</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        
        <div className="relative">
          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <select
            className="w-full h-10 pl-8 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={filterStatus}
            onChange={handleStatusFilter}
          >
            <option value="">所有状态</option>
            <option value="在职">在职</option>
            <option value="离职">离职</option>
            <option value="借调">借调</option>
          </select>
        </div>
      </div>

      {/* 员工列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // 加载中状态
          Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden border border-gray-200">
                <div className="p-4 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
                <CardContent className="border-t border-gray-100 p-4 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-8 bg-gray-100 rounded w-full mt-4"></div>
                  </div>
                </CardContent>
              </Card>
            ))
        ) : filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-lg font-medium`}>
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
                <Badge className={`ml-auto ${
                  employee.status === '在职' ? 'bg-green-100 text-green-800' :
                  employee.status === '离职' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {employee.status}
                </Badge>
              </div>
              <CardContent className="border-t border-gray-100 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">部门</span>
                  <span className="font-medium text-sm">{employee.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">联系电话</span>
                  <span className="font-medium text-sm">{employee.phone}</span>
                </div>
                <Button className="w-full mt-2 bg-green-600 hover:bg-green-700" asChild>
                  <a href={`/executive/employees/${employee.id}`}>
                    查看详情 <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <User className="h-12 w-12 text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">未找到员工</h3>
            <p className="text-gray-500">没有符合搜索条件的员工</p>
          </div>
        )}
      </div>
    </div>
  );
} 