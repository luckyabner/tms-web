'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Building,
  UserCog,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { RealTimeClock } from '@/components/ui/real-time-clock';
import { getAllEmployees } from '@/lib/services/employeeService';
import { getAllDepartments } from '@/lib/services/departmentService';
import api from '@/lib/api';

export default function ExecutiveDashboardPage() {
  const [stats, setStats] = useState([
    { title: '总员工数', value: '0', trend: 'up', trendValue: '+0%', icon: Users, color: 'green' },
    { title: '部门数量', value: '0', trend: 'up', trendValue: '+0', icon: Building, color: 'teal' },
    { title: '人事调动', value: '0', trend: 'up', trendValue: '+0', icon: UserCog, color: 'emerald' },
    { title: '项目进行中', value: '0', trend: 'up', trendValue: '+0%', icon: Briefcase, color: 'lime' },
  ]);

  const [departments, setDepartments] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 获取员工数据
      const employees = await getAllEmployees();
      
      // 获取部门数据
      const departments = await getAllDepartments();
      
      // 获取人事调动数据（待审批）
      let pendingTransferData = [];
      try {
        const transferResponse = await api.get('/employee-departments/pending-transfers');
        if (transferResponse.data && transferResponse.data.data) {
          pendingTransferData = transferResponse.data.data.map(transfer => {
            // 查找员工和部门名称
            const employee = employees.find(emp => emp.id === transfer.empId);
            const department = departments.find(dept => dept.id === transfer.depId);
            const fromDepartment = employees.find(emp => emp.id === transfer.empId)?.department || '未知部门';
            
            return {
              id: transfer.id,
              employeeName: employee ? employee.name : `员工ID: ${transfer.empId}`,
              fromDepartment: fromDepartment,
              toDepartment: department ? department.name : `部门ID: ${transfer.depId}`,
              position: transfer.position || '未知职位',
              status: transfer.state || '待审批',
              date: new Date(transfer.createdAt).toLocaleDateString('zh-CN')
            };
          });
        }
      } catch (error) {
        console.error('获取人事调动数据失败:', error);
        // 使用模拟数据作为备份
        pendingTransferData = [
          { id: 1, employeeName: '张三', fromDepartment: '研发部', toDepartment: '产品部', status: '待审批', date: '2025-06-25' },
          { id: 2, employeeName: '李四', fromDepartment: '市场部', toDepartment: '销售部', status: '待审批', date: '2025-06-24' },
        ];
      }
      
      // 获取项目数据
      let projectCount = 0;
      try {
        const projectResponse = await api.get('/projects');
        if (projectResponse.data && projectResponse.data.data) {
          const projects = projectResponse.data.data;
          projectCount = projects.filter(project => project.endDate === null || new Date(project.endDate) > new Date()).length;
        }
      } catch (error) {
        console.error('获取项目数据失败:', error);
        projectCount = 8; // 默认值
      }

      // 更新统计数据
      setStats([
        { 
          title: '总员工数', 
          value: employees.length.toString(), 
          trend: 'up', 
          trendValue: `+${Math.floor(employees.length * 0.05)}%`, 
          icon: Users, 
          color: 'green' 
        },
        { 
          title: '部门数量', 
          value: departments.length.toString(), 
          trend: 'up', 
          trendValue: '+1', 
          icon: Building, 
          color: 'teal' 
        },
        { 
          title: '人事调动', 
          value: pendingTransferData.filter(t => t.status === '待审批').length.toString(), 
          trend: 'up', 
          trendValue: `+${pendingTransferData.filter(t => t.status === '待审批').length}`, 
          icon: UserCog, 
          color: 'emerald' 
        },
        { 
          title: '项目进行中', 
          value: projectCount.toString(), 
          trend: 'up', 
          trendValue: '+12%', 
          icon: Briefcase, 
          color: 'lime' 
        },
      ]);

      // 更新部门数据
      setDepartments(departments);
      
      // 更新人事调动数据
      setPendingTransfers(pendingTransferData);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">欢迎回来，公司高层！</h1>
            <p className="text-green-100">
              今天是{' '}
              {new Date().toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>
          <RealTimeClock />
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendValue={stat.trendValue}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待审批的人事调动 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-green-600" />
              待审批的人事调动
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
              </div>
            ) : pendingTransfers.length > 0 ? (
              <div className="space-y-4">
                {pendingTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border-l-4 border-green-500"
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium">{transfer.employeeName}</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{transfer.fromDepartment} → {transfer.toDepartment}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">申请日期：{transfer.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transfer.status === '待审批' ? 'bg-amber-100 text-amber-700' : 
                        transfer.status === '已通过' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>{transfer.status}</span>
                      {transfer.status === '待审批' && (
                        <Button variant="outline" size="sm" className="text-xs border-green-500 text-green-600 hover:bg-green-50" asChild>
                          <a href={`/executive/transfers/new?transferId=${transfer.id}`}>
                            查看
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">暂无待审批的人事调动</div>
            )}
          </CardContent>
        </Card>

        {/* 部门统计 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              部门人员分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
              </div>
            ) : departments.length > 0 ? (
              <div className="space-y-4">
                {departments.slice(0, 5).map((dept) => (
                  <div key={dept.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>{dept.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 w-48 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(5, dept.employeeCount * 5))}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-16 text-right">{dept.employeeCount || 0} 人</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">暂无部门数据</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* 快捷操作 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              快捷操作
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700" asChild>
                <a href="/executive/employees">
                  <Users className="mr-2 h-4 w-4" />
                  查看所有员工
                </a>
              </Button>
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700" asChild>
                <a href="/executive/departments">
                  <Building className="mr-2 h-4 w-4" />
                  查看所有部门
                </a>
              </Button>
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700" asChild>
                <a href="/executive/transfers/new">
                  <UserCog className="mr-2 h-4 w-4" />
                  发起人事调动
                </a>
              </Button>
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700" asChild>
                <a href="/executive/analysis">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  部门绩效分析
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 