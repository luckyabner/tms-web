'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createEmployeePerformance, updateEmployeePerformance } from '@/lib/services/performanceService';
import { getAllEmployees } from '@/lib/services/employeeService';
import { getAllPerformances } from '@/lib/services/performanceService';
import { AlertCircle, Loader2, User, FileText, Save, Award, BarChart3 } from 'lucide-react';

export default function EmployeePerformanceForm({ employeePerformance = null, performanceId = null, onSuccess, onCancel }) {
  const isEditing = !!employeePerformance;
  const userId = 1; // 默认用户ID，实际应用中应从用户会话中获取

  // 记录原始数据，用于调试
  useEffect(() => {
    if (employeePerformance) {
      console.log('表单接收到的员工绩效评估数据:', employeePerformance);
    }
    if (performanceId) {
      console.log('接收到的绩效考核ID:', performanceId);
    }
  }, [employeePerformance, performanceId]);

  const [formData, setFormData] = useState({
    employeeId: employeePerformance?.employeeId || '',
    performanceId: employeePerformance?.performanceId || performanceId || '',
    approverId: employeePerformance?.approverId || userId,
    score: employeePerformance?.score !== '-' ? employeePerformance?.score : '',
    state: employeePerformance?.state || '未完成',
    description: employeePerformance?.description || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // 加载员工和绩效考核数据
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // 获取员工列表
        const empData = await getAllEmployees();
        setEmployees(empData);
        console.log('加载的员工列表:', empData);
        
        // 获取绩效考核列表
        const perfData = await getAllPerformances();
        setPerformances(perfData);
        console.log('加载的绩效考核列表:', perfData);
      } catch (err) {
        console.error('加载数据失败:', err);
        setError('加载数据失败，请稍后重试');
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);

  // 在编辑模式下，确保表单显示正确的员工、绩效考核和评估人名称
  useEffect(() => {
    if (isEditing && employees.length > 0 && performances.length > 0) {
      // 查找并显示当前员工名称
      if (!employees.some(emp => emp.id === employeePerformance.employeeId)) {
        console.log(`警告: 未找到ID为${employeePerformance.employeeId}的员工`);
      } else {
        console.log(`找到ID为${employeePerformance.employeeId}的员工:`, 
          employees.find(emp => emp.id === employeePerformance.employeeId)?.name);
      }
      
      // 查找并显示当前绩效考核名称
      if (!performances.some(perf => perf.id === employeePerformance.performanceId)) {
        console.log(`警告: 未找到ID为${employeePerformance.performanceId}的绩效考核`);
      } else {
        console.log(`找到ID为${employeePerformance.performanceId}的绩效考核:`, 
          performances.find(perf => perf.id === employeePerformance.performanceId)?.name);
      }
      
      // 查找并显示当前评估人名称
      if (!employees.some(emp => emp.id === employeePerformance.approverId)) {
        console.log(`警告: 未找到ID为${employeePerformance.approverId}的评估人`);
      } else {
        console.log(`找到ID为${employeePerformance.approverId}的评估人:`, 
          employees.find(emp => emp.id === employeePerformance.approverId)?.name);
      }
    }
  }, [isEditing, employees, performances, employeePerformance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'score') {
      // 验证分数是否在0-100之间
      const score = parseFloat(value);
      if (value && (isNaN(score) || score < 0 || score > 100)) {
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('提交表单数据:', formData);
      
      if (isEditing) {
        console.log(`正在更新员工绩效评估ID=${employeePerformance.id}`);
        await updateEmployeePerformance(employeePerformance.id, formData);
      } else {
        console.log('正在创建新员工绩效评估');
        await createEmployeePerformance(formData);
      }
      onSuccess();
    } catch (err) {
      console.error('保存员工绩效评估失败:', err);
      setError('保存员工绩效评估失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取员工名称
  const getEmployeeName = (id) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? `${employee.name}${employee.department ? ` (${employee.department})` : ''}` : '未知员工';
  };

  // 获取绩效考核名称
  const getPerformanceName = (id) => {
    const performance = performances.find(perf => perf.id === id);
    return performance ? performance.name : '未知考核';
  };

  return (
    <Card className="w-full border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-4 pt-2 rounded-t-xl bg-gradient-to-r from-blue-50 to-blue-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-pulse">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {loadingOptions && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-500">加载数据中...</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="employeeId" className="flex items-center gap-2 font-medium text-gray-700">
                <User className="h-4 w-4 text-blue-600 mr-1" />
                员工
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                {isEditing ? (
                  <Input
                    value={employeePerformance.employeeName || getEmployeeName(employeePerformance.employeeId)}
                    disabled
                    className="bg-gray-50"
                  />
                ) : (
                  <select
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                  >
                    <option value="">请选择员工</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.department || '无部门'})</option>
                    ))}
                  </select>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
                {isEditing ? '员工信息不可修改' : '选择需要评估的员工'}
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="performanceId" className="flex items-center gap-2 font-medium text-gray-700">
                <Award className="h-4 w-4 text-blue-600 mr-1" />
                绩效考核
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                {isEditing ? (
                  <Input
                    value={employeePerformance.performanceName || getPerformanceName(employeePerformance.performanceId)}
                    disabled
                    className="bg-gray-50"
                  />
                ) : (
                  <select
                    id="performanceId"
                    name="performanceId"
                    value={formData.performanceId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                  >
                    <option value="">请选择绩效考核</option>
                    {performances.map(perf => (
                      <option key={perf.id} value={perf.id}>{perf.name}</option>
                    ))}
                  </select>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
                {isEditing ? '绩效考核不可修改' : '选择绩效考核周期'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="score" className="flex items-center gap-2 font-medium text-gray-700">
                <BarChart3 className="h-4 w-4 text-blue-600 mr-1" />
                绩效得分
              </Label>
              <Input 
                id="score"
                name="score"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.score}
                onChange={handleChange}
                placeholder="0-100"
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
                绩效评分（0-100分）
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="state" className="flex items-center gap-2 font-medium text-gray-700">
                <Award className="h-4 w-4 text-blue-600 mr-1" />
                评估状态
              </Label>
              <div className="relative">
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                >
                  <option value="未完成">未完成</option>
                  <option value="已完成">已完成</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
                当前评估状态
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="approverId" className="flex items-center gap-2 font-medium text-gray-700">
              <User className="h-4 w-4 text-blue-600 mr-1" />
              评估人
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <select
                id="approverId"
                name="approverId"
                value={formData.approverId}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
              >
                <option value="">请选择评估人</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.department || '无部门'})</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              选择负责此次评估的人员
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description" className="flex items-center gap-2 font-medium text-gray-700">
              <FileText className="h-4 w-4 text-blue-600 mr-1" />
              评估描述
            </Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="请输入对员工的绩效评价，包括优点、不足和改进建议等"
              rows={3}
              className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              详细描述员工在本次考核中的表现
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-3 border-t pt-4 bg-gray-50 rounded-b-xl">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
            className="border-gray-300 hover:bg-gray-100 transition-colors duration-200"
          >
            取消
          </Button>
          <Button 
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={loading || loadingOptions}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? '保存评估' : '创建评估'}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}