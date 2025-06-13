import { Building2, Plus, Users, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DepartmentsPage() {
  // 模拟部门数据
  const departments = [
    { id: 1, name: '技术部', manager: '张三', employeeCount: 45, openPositions: 3 },
    { id: 2, name: '市场部', manager: '李四', employeeCount: 28, openPositions: 2 },
    { id: 3, name: '人力资源部', manager: '王五', employeeCount: 15, openPositions: 1 },
    { id: 4, name: '财务部', manager: '赵六', employeeCount: 12, openPositions: 0 },
    { id: 5, name: '产品部', manager: '钱七', employeeCount: 20, openPositions: 2 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">部门管理</h1>
          <p className="text-muted-foreground">管理公司各部门信息</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          添加部门
        </Button>
      </div>

      {/* 部门统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总部门数</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总员工数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.reduce((sum, dept) => sum + dept.employeeCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在招职位</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departments.reduce((sum, dept) => sum + dept.openPositions, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 部门列表 */}
      <Card>
        <CardHeader>
          <CardTitle>部门列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>部门名称</TableHead>
                <TableHead>部门主管</TableHead>
                <TableHead>员工数量</TableHead>
                <TableHead>在招职位</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell>{department.manager}</TableCell>
                  <TableCell>{department.employeeCount}</TableCell>
                  <TableCell>{department.openPositions}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      编辑
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 