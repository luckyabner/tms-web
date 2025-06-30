"use client";

import ManagementChain from "@/components/employee/ManagementChain";
import RelationshipNetwork from "@/components/employee/RelationshipNetwork";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EMPLOYEE_RELATIONS } from "@/lib/mockRelationData";
import { getAllEmployees } from "@/lib/services/employeeService";
import { syncRelations } from "@/lib/services/relationService";
import { cn } from "@/lib/utils";
import { GitBranch, Loader2, Network, RefreshCw, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function RelationsPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState("network");

  // 加载员工数据
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getAllEmployees();
        setEmployees(data);

        // 默认选择第一个员工
        if (data.length > 0) {
          setSelectedEmployee(data[0]);
        }
      } catch (error) {
        console.error("加载员工数据失败:", error);
        // 设置模拟员工数据
        const mockEmployees = getMockEmployees();
        setEmployees(mockEmployees);
        setSelectedEmployee(mockEmployees[0]);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // 模拟员工数据 - 使用静态关系数据
  const getMockEmployees = () => {
    return EMPLOYEE_RELATIONS.map(emp => ({
      id: emp.emp_id,
      name: emp.emp_name,
      position: getRandomPosition(),
      department: getRandomDepartment(),
      hireDate: getRandomHireDate(),
    }));
  };

  // 随机生成职位名称
  const getRandomPosition = () => {
    const positions = [
      "部门经理", "总监", "开发工程师", "测试工程师", 
      "产品经理", "UI设计师", "人力资源专员", "财务经理", 
      "市场专员", "销售经理", "项目经理", "数据分析师"
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  };

  // 随机生成部门名称
  const getRandomDepartment = () => {
    const departments = [
      "研发部", "产品部", "设计部", "测试部", 
      "人力资源部", "财务部", "市场部", "销售部"
    ];
    return departments[Math.floor(Math.random() * departments.length)];
  };

  // 随机生成入职日期 (2018-2023)
  const getRandomHireDate = () => {
    const start = new Date(2018, 0, 1).getTime();
    const end = new Date(2023, 11, 31).getTime();
    const randomTime = start + Math.random() * (end - start);
    const date = new Date(randomTime);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 同步关系数据
  const handleSyncRelations = async () => {
    setSyncing(true);
    try {
      const result = await syncRelations();
      if (result.success) {
        alert(result.message);
      } else {
        alert("同步关系数据失败，请稍后再试");
      }
    } catch (error) {
      console.error("同步关系数据失败:", error);
      alert("同步关系数据失败，请稍后再试");
    } finally {
      setSyncing(false);
    }
  };

  // 过滤员工列表
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 获取当前员工的关系数据
  const getEmployeeRelations = () => {
    if (!selectedEmployee) return null;
    
    return EMPLOYEE_RELATIONS.find(emp => emp.emp_id === selectedEmployee.id) || null;
  };

  const employeeRelations = getEmployeeRelations();

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">员工关系管理</h2>
          <p className="text-muted-foreground">
            查看员工之间的关系网络和管理链条
          </p>
        </div>
        <Button
          onClick={handleSyncRelations}
          disabled={syncing}
          variant="outline"
          size="sm"
        >
          {syncing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          同步关系数据
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* 员工选择器 */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">员工列表</CardTitle>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="搜索员工..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="text-muted-foreground p-8 text-center">
                  没有找到匹配的员工
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className={cn(
                        "hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors",
                        selectedEmployee?.id === employee.id && "bg-accent"
                      )}
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium">
                        {employee.name?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm leading-none font-medium">
                          {employee.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {employee.position || "职位未知"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 关系可视化 */}
        <div className="space-y-6 lg:col-span-3">
          {selectedEmployee ? (
            <>
              {/* 员工信息卡片 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full font-semibold">
                      {selectedEmployee.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        {selectedEmployee.name}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {selectedEmployee.position}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">
                        部门
                      </p>
                      <p className="text-sm">
                        {selectedEmployee.department || "未知"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">
                        工号
                      </p>
                      <p className="text-sm">{selectedEmployee.id || "未知"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground text-sm font-medium">
                        入职日期
                      </p>
                      <p className="text-sm">
                        {selectedEmployee.hireDate || "未知"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 关系摘要卡片 */}
              {employeeRelations && (
                <Card className="mb-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">关系摘要</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-semibold text-blue-600 flex items-center">
                          <GitBranch className="mr-2 h-4 w-4" />
                          管理关系
                        </p>
                        {employeeRelations.management.length > 0 ? (
                          <ul className="space-y-1 text-sm">
                            {employeeRelations.management.map((manager, index) => (
                              <li key={index}>• {manager}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">无管理关系</p>
                        )}
                      </div>
                      
                      <div className="space-y-2 p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm font-semibold text-purple-600 flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          同事关系
                        </p>
                        {employeeRelations.colleagues.length > 0 ? (
                          <ul className="space-y-1 text-sm">
                            {employeeRelations.colleagues.filter(c => c !== employeeRelations.emp_name).slice(0, 3).map((colleague, index) => (
                              <li key={index}>• {colleague}</li>
                            ))}
                            {employeeRelations.colleagues.filter(c => c !== employeeRelations.emp_name).length > 3 && (
                              <li className="text-gray-500">+{employeeRelations.colleagues.filter(c => c !== employeeRelations.emp_name).length - 3}人</li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">无同事关系</p>
                        )}
                      </div>
                      
                      <div className="space-y-2 p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm font-semibold text-amber-600 flex items-center">
                          <Network className="mr-2 h-4 w-4" />
                          合作关系
                        </p>
                        {employeeRelations.collaborators.length > 0 ? (
                          <ul className="space-y-1 text-sm">
                            {employeeRelations.collaborators.map((collaborator, index) => (
                              <li key={index}>• {collaborator}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">无合作关系</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 关系图表 */}
              <Tabs
                defaultValue="network"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="network" className="flex items-center">
                    <Network className="mr-2 h-4 w-4" />
                    关系网络图
                  </TabsTrigger>
                  <TabsTrigger value="chain" className="flex items-center">
                    <GitBranch className="mr-2 h-4 w-4" />
                    管理链条图
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="network" className="border rounded-md mt-2">
                  <div className="h-[600px] w-full">
                    <RelationshipNetwork employeeId={selectedEmployee.id} />
                  </div>
                </TabsContent>
                <TabsContent value="chain" className="border rounded-md mt-2">
                  <div className="h-[600px] w-full">
                    <ManagementChain employeeId={selectedEmployee.id} />
                  </div>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="flex items-center justify-center h-[400px] bg-muted/10 rounded-lg border border-dashed">
              <div className="text-center space-y-2">
                <Network className="h-10 w-10 mx-auto text-muted-foreground" />
                <p>请从左侧选择一名员工</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
