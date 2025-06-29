"use client";

import ManagementChain from "@/components/employee/ManagementChain";
import RelationshipNetwork from "@/components/employee/RelationshipNetwork";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEmployees } from "@/lib/services/employeeService";
import { syncRelations } from "@/lib/services/relationService";
import { GitBranch, Loader2, Network, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from 'react';

export default function RelationsPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      { id: 1, name: "张三", position: "部门经理", department: "研发部", hireDate: "2020-01-15" },
      { id: 2, name: "李四", position: "总监", department: "研发部", hireDate: "2018-05-20" },
      { id: 3, name: "王五", position: "开发工程师", department: "研发部", hireDate: "2021-03-10" },
      { id: 4, name: "赵六", position: "测试工程师", department: "研发部", hireDate: "2022-07-01" },
      { id: 5, name: "钱七", position: "人力资源专员", department: "人力资源部", hireDate: "2019-11-05" },
      { id: 6, name: "孙八", position: "产品经理", department: "产品部", hireDate: "2021-09-15" }
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
  const filteredEmployees = employees.filter(employee => 
    employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">员工关系管理</h1>
          <p className="text-gray-500">查看员工之间的关系网络和管理链条</p>
        </div>
        <Button 
          onClick={handleSyncRelations} 
          disabled={syncing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {syncing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          同步关系数据
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* 员工列表 */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-gray-500" />
              员工列表
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="搜索员工..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                </div>
              ) : filteredEmployees.length === 0 ? (
                <div className="text-center py-6 text-gray-500">没有找到匹配的员工</div>
              ) : (
                <ul className="divide-y">
                  {filteredEmployees.map((employee) => (
                    <li 
                      key={employee.id}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedEmployee?.id === employee.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {employee.name?.charAt(0) || '?'}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-gray-500">{employee.position || '职位未知'}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 关系可视化 */}
        <div className="md:col-span-3 space-y-6">
          {selectedEmployee ? (
            <>
              <div className="bg-white p-4 rounded-lg shadow border">
                <h2 className="text-xl font-bold mb-2">{selectedEmployee.name}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">部门：</span>
                    <span>{selectedEmployee.department || '未知'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">职位：</span>
                    <span>{selectedEmployee.position || '未知'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">工号：</span>
                    <span>{selectedEmployee.id || '未知'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">入职日期：</span>
                    <span>{selectedEmployee.hireDate || '未知'}</span>
                  </div>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="network" className="flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    关系网络
                  </TabsTrigger>
                  <TabsTrigger value="chain" className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    管理链条
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="network" className="mt-4">
                  <RelationshipNetwork employeeId={selectedEmployee.id} />
                </TabsContent>
                <TabsContent value="chain" className="mt-4">
                  <ManagementChain employeeId={selectedEmployee.id} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px] text-gray-500">
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    加载员工数据中...
                  </div>
                ) : (
                  <p>请从左侧选择一名员工查看关系数据</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 