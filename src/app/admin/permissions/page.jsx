'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Shield, 
  Users, 
  UserPlus, 
  Lock, 
  Unlock, 
  Check, 
  X, 
  ChevronDown, 
  MoreHorizontal,
  Plus,
  Search
} from 'lucide-react';

export default function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('roles');

  // 模拟角色数据
  const roles = [
    { 
      id: 1, 
      name: '系统管理员', 
      description: '拥有系统最高权限',
      userCount: 3,
      isSystem: true,
      permissions: ['all']
    },
    { 
      id: 2, 
      name: '公司高层', 
      description: '查看所有数据，无修改权限',
      userCount: 5,
      isSystem: true,
      permissions: ['employee.view', 'department.view', 'performance.view', 'recruitment.view', 'salary.view', 'reports.view', 'reports.finance', 'reports.hr']
    },
    { 
      id: 3, 
      name: '人事专员', 
      description: '管理员工档案、招聘和绩效',
      userCount: 12,
      isSystem: true,
      permissions: ['employee.view', 'employee.create', 'employee.edit', 'employee.delete', 'recruitment.manage', 'performance.manage', 'department.view']
    },
    { 
      id: 4, 
      name: '普通员工', 
      description: '基本系统访问权限',
      userCount: 87,
      isSystem: true,
      permissions: ['profile.view', 'profile.edit', 'performance.self']
    },
  ];

  // 模拟权限数据
  const permissionGroups = [
    {
      name: '员工管理',
      permissions: [
        { id: 'employee.view', name: '查看员工', description: '查看员工信息' },
        { id: 'employee.create', name: '创建员工', description: '添加新员工' },
        { id: 'employee.edit', name: '编辑员工', description: '修改员工信息' },
        { id: 'employee.delete', name: '删除员工', description: '删除员工记录' }
      ]
    },
    {
      name: '部门管理',
      permissions: [
        { id: 'department.view', name: '查看部门', description: '查看部门信息' },
        { id: 'department.create', name: '创建部门', description: '添加新部门' },
        { id: 'department.edit', name: '编辑部门', description: '修改部门信息' },
        { id: 'department.delete', name: '删除部门', description: '删除部门' }
      ]
    },
    {
      name: '绩效管理',
      permissions: [
        { id: 'performance.view', name: '查看绩效', description: '查看绩效评估' },
        { id: 'performance.edit', name: '编辑绩效', description: '修改绩效评估' },
        { id: 'performance.self', name: '个人绩效', description: '查看自己的绩效' },
        { id: 'performance.manage', name: '管理绩效', description: '全面管理绩效系统' }
      ]
    },
    {
      name: '招聘管理',
      permissions: [
        { id: 'recruitment.view', name: '查看招聘', description: '查看招聘信息' },
        { id: 'recruitment.manage', name: '管理招聘', description: '管理招聘流程' }
      ]
    },
    {
      name: '薪资管理',
      permissions: [
        { id: 'salary.view', name: '查看薪资', description: '查看薪资信息' },
        { id: 'salary.edit', name: '编辑薪资', description: '修改薪资信息' }
      ]
    },
    {
      name: '个人信息',
      permissions: [
        { id: 'profile.view', name: '查看个人信息', description: '查看自己的信息' },
        { id: 'profile.edit', name: '编辑个人信息', description: '修改自己的信息' }
      ]
    },
    {
      name: '报表管理',
      permissions: [
        { id: 'reports.view', name: '查看报表', description: '查看基本报表' },
        { id: 'reports.finance', name: '财务报表', description: '查看财务报表' },
        { id: 'reports.hr', name: '人事报表', description: '查看人事报表' }
      ]
    },
    {
      name: '系统管理',
      permissions: [
        { id: 'system.settings', name: '系统设置', description: '管理系统设置' },
        { id: 'system.logs', name: '系统日志', description: '查看系统日志' },
        { id: 'system.users', name: '用户管理', description: '管理系统用户' },
        { id: 'system.roles', name: '角色管理', description: '管理角色和权限' }
      ]
    }
  ];

  // 模拟用户数据
  const users = [
    { 
      id: 1, 
      name: '张无忌', 
      email: 'zhangwuji@company.com',
      department: '技术部',
      role: '系统管理员',
      lastLogin: '2023-09-15 14:30:22'
    },
    { 
      id: 2, 
      name: '宋远桥', 
      email: 'songyuanqiao@company.com',
      department: '董事会',
      role: '公司高层',
      lastLogin: '2023-09-15 11:22:05'
    },
    { 
      id: 3, 
      name: '张三丰', 
      email: 'zhangsanfeng@company.com',
      department: '人事部',
      role: '人事专员',
      lastLogin: '2023-09-14 17:45:33'
    },
    { 
      id: 4, 
      name: '周芷若', 
      email: 'zhouzhiruo@company.com',
      department: '市场部',
      role: '普通员工',
      lastLogin: '2023-09-15 09:12:48'
    },
    { 
      id: 5, 
      name: '赵敏', 
      email: 'zhaomin@company.com',
      department: '财务部',
      role: '普通员工',
      lastLogin: '2023-09-15 10:05:17'
    }
  ];

  // 过滤角色
  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 过滤用户
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 检查角色是否有某权限
  const hasPermission = (role, permissionId) => {
    if (role.permissions.includes('all')) return true;
    return role.permissions.includes(permissionId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            权限管理
          </h1>
          <p className="text-muted-foreground">管理系统角色和权限分配</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Shield className="h-4 w-4 mr-2" />
            新建角色
          </Button>
        </div>
      </div>

      {/* 选项卡 */}
      <Tabs defaultValue="roles" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" />
            角色管理
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Lock className="h-4 w-4 mr-2" />
            权限设置
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            用户权限
          </TabsTrigger>
        </TabsList>

        {/* 角色管理选项卡 */}
        <TabsContent value="roles" className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索角色名称或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 角色列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      {role.name}
                      {role.isSystem && (
                        <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200">
                          系统角色
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>角色操作</DropdownMenuLabel>
                      <DropdownMenuItem>编辑角色</DropdownMenuItem>
                      <DropdownMenuItem>复制角色</DropdownMenuItem>
                      <DropdownMenuItem>配置权限</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled={role.isSystem} className={role.isSystem ? "text-gray-400" : "text-red-600"}>
                        删除角色
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-1">用户数量</div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-full bg-gray-100 rounded-full">
                        <div 
                          className="h-2 bg-purple-600 rounded-full" 
                          style={{ width: `${(role.userCount / 100) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{role.userCount}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">主要权限</div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.includes('all') ? (
                        <Badge variant="secondary">全部权限</Badge>
                      ) : (
                        role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="outline">{permission.split('.')[0]}</Badge>
                        ))
                      )}
                      {role.permissions.length > 3 && !role.permissions.includes('all') && (
                        <Badge variant="outline">+{role.permissions.length - 3}个</Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Lock className="mr-2 h-4 w-4" />
                    管理权限
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 权限设置选项卡 */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>权限矩阵</CardTitle>
              <CardDescription>管理各角色的权限分配</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">权限</TableHead>
                      <TableHead>描述</TableHead>
                      {roles.map((role) => (
                        <TableHead key={role.id} className="text-center">{role.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionGroups.map((group) => (
                      <React.Fragment key={group.name}>
                        <TableRow className="bg-gray-50">
                          <TableCell colSpan={2 + roles.length} className="font-medium">
                            {group.name}
                          </TableCell>
                        </TableRow>
                        {group.permissions.map((permission) => (
                          <TableRow key={permission.id}>
                            <TableCell className="font-medium">{permission.name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{permission.description}</TableCell>
                            {roles.map((role) => (
                              <TableCell key={`${role.id}-${permission.id}`} className="text-center">
                                {hasPermission(role, permission.id) ? (
                                  <Check className="h-5 w-5 text-green-600 mx-auto" />
                                ) : (
                                  <X className="h-5 w-5 text-red-600 mx-auto" />
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>保存权限设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 用户权限选项卡 */}
        <TabsContent value="users" className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="搜索用户名、邮箱或部门..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 用户列表 */}
          <Card>
            <CardHeader>
              <CardTitle>用户权限分配</CardTitle>
              <CardDescription>管理用户的角色和权限</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>当前角色</TableHead>
                    <TableHead>最后登录</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge variant={
                          user.role === '系统管理员' ? 'destructive' :
                          user.role === '人事专员' ? 'purple' :
                          user.role === '部门主管' ? 'blue' : 'outline'
                        }>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <span>更改角色</span>
                              <ChevronDown className="h-4 w-4 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>选择角色</DropdownMenuLabel>
                            {roles.map((role) => (
                              <DropdownMenuItem key={role.id}>
                                {role.name}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Lock className="mr-2 h-4 w-4" />
                              自定义权限
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 