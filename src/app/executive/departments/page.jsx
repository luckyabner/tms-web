'use client';

import { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  User, 
  Search,
  ChevronRight,
  BarChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getAllDepartments } from '@/lib/services/departmentService';
import { getAllEmployees } from '@/lib/services/employeeService';

export default function ExecutiveDepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const deptData = await getAllDepartments();
        const empData = await getAllEmployees();
        
        // 为部门添加员工数量属性
        const departmentsWithCounts = deptData.map(dept => {
          const departmentEmployees = empData.filter(emp => 
            emp.departmentId === dept.id || emp.department === dept.name
          );
          
          // 找到部门经理
          const manager = empData.find(emp => emp.id === dept.managerId);
          
          return {
            ...dept,
            employeeCount: departmentEmployees.length,
            managerName: manager ? manager.name : '未分配',
            // 生成随机的百分比表示部门工作效率（实际项目中应该使用真实数据）
            efficiency: Math.floor(Math.random() * 40) + 60
          };
        });
        
        setDepartments(departmentsWithCounts);
        setFilteredDepartments(departmentsWithCounts);
        setEmployees(empData);
      } catch (error) {
        console.error('获取部门数据失败:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // 搜索部门
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredDepartments(departments);
      return;
    }
    
    const filtered = departments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(term.toLowerCase()) ||
        (dept.managerName && dept.managerName.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredDepartments(filtered);
  };

  // 生成部门类型的标签
  const getDepartmentTypeBadge = (name) => {
    if (name.includes('研发') || name.includes('技术') || name.includes('开发')) {
      return <Badge className="bg-blue-100 text-blue-800">技术</Badge>;
    } else if (name.includes('市场') || name.includes('销售')) {
      return <Badge className="bg-orange-100 text-orange-800">市场</Badge>;
    } else if (name.includes('人力') || name.includes('行政')) {
      return <Badge className="bg-purple-100 text-purple-800">行政</Badge>;
    } else if (name.includes('财务')) {
      return <Badge className="bg-yellow-100 text-yellow-800">财务</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">其他</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          部门管理
        </h1>
        <p className="text-muted-foreground">查看和管理所有部门信息</p>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索部门名称或负责人..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <BarChart className="mr-2 h-4 w-4" />
          部门分析
        </Button>
      </div>

      {/* 部门统计概览 */}
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
            <p className="text-sm text-muted-foreground mt-1">组织架构单元</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 text-green-600 mr-2" />
              平均部门规模
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {departments.length ? Math.round(employees.length / departments.length) : 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">人/部门</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 text-green-600 mr-2" />
              部门管理者
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {departments.filter(dept => dept.managerId).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">已分配负责人</p>
          </CardContent>
        </Card>
      </div>

      {/* 部门列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          // 加载状态
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredDepartments.length > 0 ? (
          // 部门卡片
          filteredDepartments.map((dept) => (
            <Card key={dept.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-2 font-medium">
                      {dept.name.charAt(0)}
                    </div>
                    <span>{dept.name}</span>
                  </div>
                  {getDepartmentTypeBadge(dept.name)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">负责人</div>
                    <div className="font-medium">{dept.managerName}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">员工数量</div>
                    <div className="font-medium">{dept.employeeCount} 人</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">效能指数</span>
                      <span className={`font-medium ${
                        dept.efficiency >= 80 ? 'text-green-600' :
                        dept.efficiency >= 70 ? 'text-blue-600' :
                        'text-amber-600'
                      }`}>{dept.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          dept.efficiency >= 80 ? 'bg-green-500' :
                          dept.efficiency >= 70 ? 'bg-blue-500' :
                          'bg-amber-500'
                        }`}
                        style={{ width: `${dept.efficiency}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 border-green-200 text-green-700 hover:bg-green-50"
                    asChild
                  >
                    <a href={`/executive/departments/${dept.id}`}>
                      查看详情
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // 无结果
          <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg">
            <Building className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">未找到匹配的部门</p>
          </div>
        )}
      </div>
    </div>
  );
} 