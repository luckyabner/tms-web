'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building, Users, ChevronRight } from 'lucide-react';
import { getAllDepartments } from '@/lib/services/departmentService';
import { getAllEmployees } from '@/lib/services/employeeService';
import api from '@/lib/api';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取部门数据
      const departmentsData = await getAllDepartments();
      
      // 获取员工-部门关系数据
      let employeeDepartments = [];
      try {
        const response = await api.get('/employee-departments');
        if (response.data && response.data.data) {
          employeeDepartments = response.data.data.filter(ed => ed.isCurrent === 1);
        }
      } catch (error) {
        console.error('获取员工-部门关系数据失败:', error);
      }
      
      // 计算每个部门的员工数量
      const enrichedDepartments = departmentsData.map(dept => {
        const employeeCount = employeeDepartments.filter(ed => ed.depId === dept.id).length;
        
        return {
          ...dept,
          employeeCount
        };
      });
      
      // 按层级排序部门
      const sortedDepartments = sortDepartmentsByHierarchy(enrichedDepartments);
      
      setDepartments(sortedDepartments);
    } catch (error) {
      console.error('获取部门数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 按层级排序部门
  const sortDepartmentsByHierarchy = (depts) => {
    // 创建部门ID到部门对象的映射
    const deptMap = {};
    depts.forEach(dept => {
      deptMap[dept.id] = { ...dept, level: 0, children: [] };
    });
    
    // 构建层级关系
    const rootDepts = [];
    depts.forEach(dept => {
      if (dept.parentId) {
        if (deptMap[dept.parentId]) {
          deptMap[dept.id].level = deptMap[dept.parentId].level + 1;
          deptMap[dept.parentId].children.push(deptMap[dept.id]);
        } else {
          rootDepts.push(deptMap[dept.id]);
        }
      } else {
        rootDepts.push(deptMap[dept.id]);
      }
    });
    
    // 将层级结构扁平化为带有层级信息的数组
    const flattenDepts = [];
    const flatten = (depts, level = 0) => {
      depts.forEach(dept => {
        flattenDepts.push({ ...dept, level });
        if (dept.children && dept.children.length > 0) {
          flatten(dept.children, level + 1);
        }
      });
    };
    
    flatten(rootDepts);
    return flattenDepts;
  };

  // 过滤部门
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">部门信息</h1>
          <p className="text-gray-500">查看公司部门结构</p>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="搜索部门..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* 部门列表 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <Card key={index} className="border border-gray-200">
              <div className="p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((department) => (
            <Card 
              key={department.id} 
              className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-green-500"
              style={{ marginLeft: `${department.level * 20}px` }}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Building className="h-5 w-5 text-green-600 mr-2" />
                  {department.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-600">员工数量: </span>
                    <span className="font-medium ml-1">{department.employeeCount || 0}</span>
                  </div>
                  
                  {department.parentId && (
                    <div className="text-sm text-gray-500">
                      上级部门: {departments.find(d => d.id === department.parentId)?.name || `ID: ${department.parentId}`}
                    </div>
                  )}
                  
                  <div className="flex justify-end mt-4">
                    <Button className="bg-green-600 hover:bg-green-700" asChild>
                      <a href={`/executive/departments/${department.id}`}>
                        查看详情 <ChevronRight className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">未找到部门</h3>
          <p className="text-gray-500">尝试调整搜索条件</p>
        </div>
      )}
    </div>
  );
} 