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

export default function ExecutiveDashboardPage() {
  const [stats, setStats] = useState([
    { title: '总员工数', value: '0', trend: 'up', trendValue: '+0%', icon: Users, color: 'green' },
    { title: '部门数量', value: '0', trend: 'up', trendValue: '+0', icon: Building, color: 'teal' },
    { title: '人事调动', value: '0', trend: 'up', trendValue: '+0', icon: UserCog, color: 'emerald' },
    { title: '项目进行中', value: '0', trend: 'up', trendValue: '+0%', icon: Briefcase, color: 'lime' },
  ]);

  const [departments, setDepartments] = useState([]);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [recentEmployeeChanges, setRecentEmployeeChanges] = useState([]);
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
      
      // 模拟人事调动数据
      const mockTransfers = [
        { id: 1, employeeName: '张三', fromDepartment: '研发部', toDepartment: '产品部', status: '待审批', date: '2025-06-25' },
        { id: 2, employeeName: '李四', fromDepartment: '市场部', toDepartment: '销售部', status: '待审批', date: '2025-06-24' },
        { id: 3, employeeName: '王五', fromDepartment: '人力资源部', toDepartment: '行政部', status: '已通过', date: '2025-06-23' },
      ];

      // 模拟最近员工变动
      const mockEmployeeChanges = [
        { id: 1, name: '赵六', action: '新入职', department: '研发部', date: '2025-06-25' },
        { id: 2, name: '钱七', action: '离职', department: '销售部', date: '2025-06-24' },
        { id: 3, name: '孙八', action: '调动', fromDepartment: '市场部', toDepartment: '产品部', date: '2025-06-23' },
        { id: 4, name: '周九', action: '晋升', position: '高级工程师', department: '研发部', date: '2025-06-22' },
      ];

      // 更新统计数据
      setStats([
        { title: '总员工数', value: employees.length.toString(), trend: 'up', trendValue: '+5%', icon: Users, color: 'green' },
        { title: '部门数量', value: departments.length.toString(), trend: 'up', trendValue: '+1', icon: Building, color: 'teal' },
        { title: '人事调动', value: mockTransfers.filter(t => t.status === '待审批').length.toString(), trend: 'up', trendValue: '+2', icon: UserCog, color: 'emerald' },
        { title: '项目进行中', value: '8', trend: 'up', trendValue: '+12%', icon: Briefcase, color: 'lime' },
      ]);

      // 更新部门数据
      setDepartments(departments);
      
      // 更新人事调动数据
      setPendingTransfers(mockTransfers);
      
      // 更新最近员工变动
      setRecentEmployeeChanges(mockEmployeeChanges);
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
            {pendingTransfers.length > 0 ? (
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
                        <Button variant="outline" size="sm" className="text-xs border-green-500 text-green-600 hover:bg-green-50">
                          查看
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

        {/* 最近员工变动 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              最近员工变动
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentEmployeeChanges.length > 0 ? (
              <div className="space-y-4">
                {recentEmployeeChanges.map((change) => (
                  <div
                    key={change.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm ${
                      change.action === '新入职' ? 'bg-green-500' :
                      change.action === '离职' ? 'bg-red-500' :
                      change.action === '调动' ? 'bg-blue-500' :
                      'bg-purple-500'
                    }`}>
                      {change.name.slice(0, 1)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="font-medium">{change.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          change.action === '新入职' ? 'bg-green-100 text-green-700' :
                          change.action === '离职' ? 'bg-red-100 text-red-700' :
                          change.action === '调动' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>{change.action}</span>
                        {change.action === '调动' ? (
                          <span className="text-sm text-gray-600">
                            {change.fromDepartment} → {change.toDepartment}
                          </span>
                        ) : change.action === '晋升' ? (
                          <span className="text-sm text-gray-600">
                            晋升为{change.position}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600">
                            {change.department}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">变动日期：{change.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">暂无最近员工变动</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 部门统计 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              部门人员分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            {departments.length > 0 ? (
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
                            width: `${Math.floor(Math.random() * 100)}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.floor(Math.random() * 50)} 人
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">暂无部门数据</div>
            )}
            <div className="mt-4 text-right">
              <Button variant="outline" className="text-green-600 border-green-500 hover:bg-green-50">
                查看所有部门
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 快速操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start bg-green-600 hover:bg-green-700"
              variant="default"
            >
              <UserCog className="mr-2 h-4 w-4" />
              发起人事调动
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
            >
              <Building className="mr-2 h-4 w-4" />
              查看部门架构
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
            >
              <Users className="mr-2 h-4 w-4" />
              查看员工列表
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              部门绩效分析
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 