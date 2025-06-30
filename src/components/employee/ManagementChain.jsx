"use client";

import { Button } from "@/components/ui/button";
import { EMPLOYEE_RELATIONS } from "@/lib/mockRelationData";
import { ArrowUp, ChevronUp, GitBranch, Loader2, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function ManagementChain({ employeeId }) {
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 使用静态数据构建管理链条
  const buildChainFromStaticData = (empId) => {
    const id = parseInt(empId);
    // 从静态数据中查找员工
    const employee = EMPLOYEE_RELATIONS.find(emp => emp.emp_id === id);
    
    if (!employee) {
      return [];
    }
    
    // 构建管理链
    const chainData = [
      {
        id: employee.emp_id.toString(),
        name: employee.emp_name,
        position: "当前员工"
      }
    ];
    
    // 获取直接上级
    if (employee.management && employee.management.length > 0) {
      employee.management.forEach(manager => {
        // 从"名字 (上级)"格式中提取名字
        const managerName = manager.split(' ')[0];
        
        // 在员工数据中查找
        const managerData = EMPLOYEE_RELATIONS.find(emp => emp.emp_name === managerName);
        
        if (managerData) {
          chainData.push({
            id: managerData.emp_id.toString(),
            name: managerData.emp_name,
            position: "上级领导"
          });
          
          // 继续查找上级的上级（如果有）
          if (managerData.management && managerData.management.length > 0) {
            managerData.management.forEach(higherManager => {
              const higherManagerName = higherManager.split(' ')[0];
              const higherManagerData = EMPLOYEE_RELATIONS.find(emp => emp.emp_name === higherManagerName);
              
              if (higherManagerData) {
                chainData.push({
                  id: higherManagerData.emp_id.toString(),
                  name: higherManagerData.emp_name,
                  position: "高级管理层"
                });
              }
            });
          }
        }
      });
    }
    
    return chainData;
  };

  const loadChainData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 直接使用静态数据，避免API调用
      const chainData = buildChainFromStaticData(employeeId);
      
      if (chainData.length > 0) {
        setChain(chainData);
      } else {
        setError("未找到有效的管理链条数据");
      }
    } catch (err) {
      console.error("加载管理链条失败:", err);
      setError("无法加载管理链条数据，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    loadChainData();
  }, [employeeId]);

  return (
    <div className="h-full w-full relative overflow-auto">
      {loading ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">加载管理链条中...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-full w-full items-center justify-center">
          <div className="text-center space-y-3">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" size="sm" onClick={loadChainData}>
              重试
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-full relative p-4 bg-slate-50 overflow-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className="sticky top-2 left-2 z-10 bg-white"
            onClick={loadChainData}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                刷新中...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                刷新链条
              </>
            )}
          </Button>
          
          {/* 管理链条图表 */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md pb-10">
              {/* 垂直连接线 */}
              <div className="absolute left-1/2 w-0.5 bg-gradient-to-b from-blue-500 via-blue-300 to-red-400 transform -translate-x-1/2 rounded-full"
                  style={{ top: '40px', bottom: '70px' }}></div>
              
              {/* 管理链条卡片 */}
              <div className="space-y-16 relative py-4">
                {chain.map((employee, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center relative"
                  >
                    {/* 连接线箭头 */}
                    {index < chain.length - 1 && (
                      <div className="absolute top-[70px] left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-white rounded-full p-0.5 shadow-md">
                          <ArrowUp className="text-blue-500 h-4 w-4" />
                        </div>
                      </div>
                    )}
                    
                    {/* 员工卡片 */}
                    <div 
                      className={`relative w-56 p-3 rounded-lg shadow-md border z-20 transition-all duration-300 transform hover:scale-105 ${
                        index === 0 
                          ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' 
                          : index === chain.length - 1 
                            ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
                            : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {/* 员工头像 */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ${
                          index === 0 
                            ? 'bg-gradient-to-br from-red-400 to-red-600' 
                            : index === chain.length - 1 
                              ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                              : 'bg-gradient-to-br from-green-400 to-green-600'
                        }`}>
                          {employee.name?.charAt(0) || '?'}
                        </div>
                        
                        {/* 员工信息 */}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{employee.name}</h3>
                          {employee.position && (
                            <p className="text-xs text-gray-600">{employee.position}</p>
                          )}
                          {employee.department && (
                            <p className="text-xs text-gray-500 mt-0.5">{employee.department}</p>
                          )}
                        </div>
                      </div>
                      
                      {/* 层级标签 */}
                      <div className="mt-2 flex justify-center">
                        <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${
                          index === 0 
                            ? 'bg-red-100 text-red-700' 
                            : index === chain.length - 1 
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                        }`}>
                          {index === 0 
                            ? '当前员工' 
                            : index === 1
                              ? '直接上级'
                            : index === chain.length - 1 
                              ? '最高管理层'
                              : `第 ${chain.length - index} 级管理层`}
                        </span>
                      </div>
                    </div>
                    
                    {/* 管理关系描述 */}
                    {index < chain.length - 1 && (
                      <div className="absolute top-[52px] right-5 bg-white rounded-lg shadow-sm p-1 border border-gray-200 text-xs text-gray-600 z-10">
                        汇报关系
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 如果没有链条数据 */}
          {chain.length === 0 && (
            <div className="text-center space-y-3">
              <GitBranch className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground text-lg">没有找到管理链条数据</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 