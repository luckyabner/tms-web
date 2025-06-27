'use client';

import { useState, useEffect } from 'react';
import { Building, Users, Search, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllDepartments } from '@/lib/services/departmentService';
import api from '@/lib/api';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [departmentEmployees, setDepartmentEmployees] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      // 获取部门数据
      const departmentsData = await getAllDepartments();
      
      // 获取部门员工数据
      const departmentEmployeesMap = {};
      
      try {
        // 获取所有员工-部门关系
        const response = await api.get('/employee-departments');
        if (response.data && response.data.data) {
          // 筛选出当前有效的员工-部门关系
          const currentEmployeeDepartments = response.data.data.filter(ed => ed.isCurrent === 1);
          
          // 按部门ID分组，计算每个部门的员工数量
          currentEmployeeDepartments.forEach(ed => {
            if (!departmentEmployeesMap[ed.depId]) {
              departmentEmployeesMap[ed.depId] = [];
            }
            departmentEmployeesMap[ed.depId].push(ed);
          });
        }
      } catch (error) {
        console.error('获取员工-部门关系数据失败:', error);
      }
      
      // 为每个部门添加员工数量
      const enrichedDepartments = departmentsData.map(dept => ({
        ...dept,
        employeeCount: departmentEmployeesMap[dept.id]?.length || 0,
        employees: departmentEmployeesMap[dept.id] || []
      }));
      
      setDepartments(enrichedDepartments);
      setDepartmentEmployees(departmentEmployeesMap);
    } catch (error) {
      console.error('获取部门数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // 处理排序
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 过滤和排序部门
  const filteredAndSortedDepartments = departments
    .filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'employeeCount') {
        return sortDirection === 'asc' 
          ? a.employeeCount - b.employeeCount
          : b.employeeCount - a.employeeCount;
      } else {
        return sortDirection === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 页面标题 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">部门管理</h1>
          <p className="text-gray-500">查看和管理公司所有部门</p>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="搜索部门名称..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* 部门列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // 加载中状态
          Array(6)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="overflow-hidden border border-gray-200">
                <div className="h-32 bg-gray-100 animate-pulse"></div>
                <CardHeader className="animate-pulse">
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                </CardHeader>
                <CardContent className="animate-pulse">
                  <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                </CardContent>
              </Card>
            ))
        ) : filteredAndSortedDepartments.length > 0 ? (
          filteredAndSortedDepartments.map((department) => (
            <Card key={department.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-12 bg-gradient-to-r from-green-600 to-teal-600 flex items-center px-4">
                <Building className="h-6 w-6 text-white" />
                <h3 className="ml-2 text-lg font-medium text-white">{department.name}</h3>
              </div>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">员工数量</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {department.employeeCount} 人
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">部门主管</span>
                    <span className="font-medium">
                      {department.managerId ? `ID: ${department.managerId}` : '未指定'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">上级部门</span>
                    <span className="font-medium">
                      {department.parentId ? 
                        departments.find(d => d.id === department.parentId)?.name || `ID: ${department.parentId}` 
                        : '无'}
                    </span>
                  </div>
                  
                  <Button className="w-full mt-2 bg-green-600 hover:bg-green-700" asChild>
                    <a href={`/executive/departments/${department.id}`}>
                      查看详情 <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Building className="h-12 w-12 text-gray-300 mb-2" />
            <h3 className="text-lg font-medium text-gray-900">未找到部门</h3>
            <p className="text-gray-500">没有符合搜索条件的部门</p>
          </div>
        )}
      </div>
    </div>
  );
} 