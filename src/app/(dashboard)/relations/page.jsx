"use client";

import ManagementChain from "@/components/employee/ManagementChain";
import RelationshipNetwork from "@/components/employee/RelationshipNetwork";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEmployees } from "@/lib/services/employeeService";
import { syncRelations } from "@/lib/services/relationService";
import { cn } from "@/lib/utils";
import { GitBranch, Loader2, Network, RefreshCw, Search } from "lucide-react";
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

  // 模拟员工数据
  const getMockEmployees = () => {
    return [
      {
        id: 1,
        name: "张三",
        position: "部门经理",
        department: "研发部",
        hireDate: "2020-01-15",
      },
      {
        id: 2,
        name: "李四",
        position: "总监",
        department: "研发部",
        hireDate: "2018-05-20",
      },
      {
        id: 3,
        name: "王五",
        position: "开发工程师",
        department: "研发部",
        hireDate: "2021-03-10",
      },
      {
        id: 4,
        name: "赵六",
        position: "测试工程师",
        department: "研发部",
        hireDate: "2022-07-01",
      },
      {
        id: 5,
        name: "钱七",
        position: "人力资源专员",
        department: "人力资源部",
        hireDate: "2019-11-05",
      },
      {
        id: 6,
        name: "孙八",
        position: "产品经理",
        department: "产品部",
        hireDate: "2021-09-15",
      },
    ];
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

              {/* 关系图表 */}
              <Card>
                <CardHeader>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="network"
                        className="flex items-center gap-2"
                      >
                        <Network className="h-4 w-4" />
                        关系网络
                      </TabsTrigger>
                      <TabsTrigger
                        value="chain"
                        className="flex items-center gap-2"
                      >
                        <GitBranch className="h-4 w-4" />
                        管理链条
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsContent value="network" className="mt-0">
                      <RelationshipNetwork employeeId={selectedEmployee.id} />
                    </TabsContent>
                    <TabsContent value="chain" className="mt-0">
                      <ManagementChain employeeId={selectedEmployee.id} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex h-[400px] items-center justify-center">
                {loading ? (
                  <div className="text-muted-foreground flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>加载员工数据中...</span>
                  </div>
                ) : (
                  <div className="space-y-2 text-center">
                    <p className="text-muted-foreground">
                      请从左侧选择一名员工
                    </p>
                    <p className="text-muted-foreground text-sm">
                      查看其关系网络和管理链条
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
