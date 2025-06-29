"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getManagementChain, getMockChainData } from '@/lib/services/relationService';
import { ChevronUp, GitBranch, Loader2, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export default function ManagementChain({ employeeId }) {
  const [chain, setChain] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadChainData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getManagementChain(employeeId);
      
      // 处理API返回的实际数据格式
      if (Array.isArray(data) && data.length > 0) {
        // API返回的是嵌套数组 [[{employee}], [{employee}], ...]
        const processedChain = data.map(level => {
          if (Array.isArray(level) && level.length > 0) {
            const employee = level[0]; // 取每个层级的第一个员工
            if (employee && employee.name) {
              return {
                id: employee.id,
                name: employee.name,
                // 添加额外信息，如果有的话
                position: employee.position || '',
                department: employee.department || '',
                subordinates: employee.subordinates || []
              };
            }
          }
          return { name: "未知员工" };
        });
        
        setChain(processedChain);
      } else if (!data || data.length === 0) {
        // 如果没有数据，显示默认的模拟数据
        setChain(getMockChainData().map(level => {
          if (Array.isArray(level) && level.length > 0) {
            return level[0];
          }
          return { name: "未知员工" };
        }));
      }
    } catch (err) {
      console.error("加载管理链条失败:", err);
      setError("无法加载管理链条数据，请稍后再试");
      // 加载失败时使用模拟数据
      setChain(getMockChainData().map(level => {
        if (Array.isArray(level) && level.length > 0) {
          return level[0];
        }
        return { name: "未知员工" };
      }));
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    loadChainData();
  }, [employeeId]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-green-600" />
            管理链条
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadChainData}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            刷新
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <Loader2 className="h-6 w-6 animate-spin text-green-500" />
            <span className="ml-2 text-gray-500">加载中...</span>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : (
          <div className="relative">
            {/* 垂直线 */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-green-200 transform -translate-x-1/2"></div>
            
            {/* 管理链条 */}
            <div className="space-y-8 relative">
              {chain.map((employee, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center relative ${index === 0 ? 'pt-2' : ''}`}
                >
                  {/* 连接线和箭头 */}
                  {index < chain.length - 1 && (
                    <div className="absolute top-[72px] left-1/2 transform -translate-x-1/2 text-green-500">
                      <ChevronUp size={20} />
                    </div>
                  )}
                  
                  {/* 员工卡片 */}
                  <div 
                    className={`w-64 p-4 rounded-lg shadow-md border ${
                      index === 0 
                        ? 'bg-red-50 border-red-200' 
                        : index === chain.length - 1 
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-green-50 border-green-200'
                    }`}
                  >
                    {/* 员工头像 */}
                    <div className="flex justify-center mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 
                          ? 'bg-red-500' 
                          : index === chain.length - 1 
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                      }`}>
                        {employee.name?.charAt(0) || '?'}
                      </div>
                    </div>
                    
                    {/* 员工信息 */}
                    <div className="text-center">
                      <h3 className="font-medium text-gray-800">{employee.name}</h3>
                      {employee.position && (
                        <p className="text-sm text-gray-500">{employee.position}</p>
                      )}
                      {employee.department && (
                        <p className="text-xs text-gray-400 mt-1">{employee.department}</p>
                      )}
                      
                      {/* 层级标签 */}
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          index === 0 
                            ? 'bg-red-100 text-red-700' 
                            : index === chain.length - 1 
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                        }`}>
                          {index === 0 
                            ? '当前员工' 
                            : index === chain.length - 1 
                              ? '最高管理层'
                              : `管理层 L${chain.length - index - 1}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 