'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle, User, Briefcase, FileText, Save, BarChart3, Brain, Users, Lightbulb, BookOpen } from 'lucide-react';
import { createEmployeeProject, updateEmployeeProject } from '@/lib/services/projectService';
import { getAllEmployees } from '@/lib/services/employeeService';

export default function EmployeeProjectForm({ employeeProject, projectId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    role: '',
    professionalAbility: '80',
    managementAbility: '80',
    cooperationAbility: '80',
    innovativeAbility: '80',
    learningAbility: '80',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  
  // 初始化表单数据
  useEffect(() => {
    if (employeeProject) {
      setFormData({
        employeeId: employeeProject.employeeId?.toString() || '',
        role: employeeProject.role || '',
        professionalAbility: employeeProject.professionalAbility?.toString() || '80',
        managementAbility: employeeProject.managementAbility?.toString() || '80',
        cooperationAbility: employeeProject.cooperationAbility?.toString() || '80',
        innovativeAbility: employeeProject.innovativeAbility?.toString() || '80',
        learningAbility: employeeProject.learningAbility?.toString() || '80',
        description: employeeProject.description || ''
      });
    }
    
    // 获取员工列表
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const employeeData = await getAllEmployees();
        setEmployees(employeeData);
      } catch (err) {
        console.error('获取员工数据失败:', err);
        setError('获取员工数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmployees();
  }, [employeeProject]);
  
  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理选择变化
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // 准备提交的数据
      const submitData = {
        employeeId: parseInt(formData.employeeId),
        projectId: parseInt(projectId),
        role: formData.role,
        professionalAbility: parseFloat(formData.professionalAbility),
        managementAbility: parseFloat(formData.managementAbility),
        cooperationAbility: parseFloat(formData.cooperationAbility),
        innovativeAbility: parseFloat(formData.innovativeAbility),
        learningAbility: parseFloat(formData.learningAbility),
        description: formData.description,
        // 假设当前登录用户ID为审批人ID
        approverId: 1 // 这里应该从登录用户信息中获取
      };
      
      // 如果是编辑现有记录
      let response;
      if (employeeProject && employeeProject.id) {
        console.log(`正在更新员工项目记录ID=${employeeProject.id}`);
        response = await updateEmployeeProject(employeeProject.id, submitData);
      } else {
        // 如果是创建新记录
        console.log('正在创建新员工项目记录');
        response = await createEmployeeProject(submitData);
      }
      
      console.log('服务响应:', response);
      
      // 检查响应是否表明成功
      if (response && (response.success || response.id)) {
        // 提交成功后回调
        if (onSuccess) onSuccess();
      } else {
        throw new Error('操作未能完成');
      }
      
    } catch (err) {
      console.error('提交项目成员数据失败:', err);
      setError('提交失败，请检查表单数据并重试');
    } finally {
      setSubmitting(false);
    }
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
          
          {loading && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="ml-2 text-sm text-gray-500">加载数据中...</span>
            </div>
          )}
          
          <div className="space-y-1">
            <Label htmlFor="employeeId" className="flex items-center gap-2 font-medium text-gray-700">
              <User className="h-4 w-4 text-blue-600 mr-1" />
              员工
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => handleSelectChange('employeeId', value)}
              required
            >
              <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                <SelectValue placeholder="选择员工" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>加载中...</span>
                  </div>
                ) : (
                  employees.map((employee) => (
                    <SelectItem 
                      key={employee.id || employee.emp_id} 
                      value={(employee.id || employee.emp_id).toString()}
                    >
                      {employee.name || employee.emp_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              选择参与项目的团队成员
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="role" className="flex items-center gap-2 font-medium text-gray-700">
              <Briefcase className="h-4 w-4 text-blue-600 mr-1" />
              担任角色
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="例如：项目经理、开发工程师、测试工程师等"
              required
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              员工在项目中担任的职责
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="professionalAbility" className="flex items-center gap-2 font-medium text-gray-700">
              <Brain className="h-4 w-4 text-blue-600 mr-1" />
              专业能力评分 (0-100)
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="professionalAbility"
                name="professionalAbility"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.professionalAbility}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <span className="text-sm text-muted-foreground w-10">{formData.professionalAbility}/100</span>
            </div>
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              员工在项目中展现的专业技术能力
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="managementAbility" className="flex items-center gap-2 font-medium text-gray-700">
              <BarChart3 className="h-4 w-4 text-blue-600 mr-1" />
              管理能力评分 (0-100)
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="managementAbility"
                name="managementAbility"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.managementAbility}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <span className="text-sm text-muted-foreground w-10">{formData.managementAbility}/100</span>
            </div>
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              员工在项目中展现的管理和组织能力
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="cooperationAbility" className="flex items-center gap-2 font-medium text-gray-700">
              <Users className="h-4 w-4 text-blue-600 mr-1" />
              合作能力评分 (0-100)
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="cooperationAbility"
                name="cooperationAbility"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.cooperationAbility}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <span className="text-sm text-muted-foreground w-10">{formData.cooperationAbility}/100</span>
            </div>
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              员工在项目中的团队协作能力
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="innovativeAbility" className="flex items-center gap-2 font-medium text-gray-700">
              <Lightbulb className="h-4 w-4 text-blue-600 mr-1" />
              创新能力评分 (0-100)
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="innovativeAbility"
                name="innovativeAbility"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.innovativeAbility}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <span className="text-sm text-muted-foreground w-10">{formData.innovativeAbility}/100</span>
            </div>
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              员工在项目中展现的创新思维和解决问题能力
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="learningAbility" className="flex items-center gap-2 font-medium text-gray-700">
              <BookOpen className="h-4 w-4 text-blue-600 mr-1" />
              学习能力评分 (0-100)
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="learningAbility"
                name="learningAbility"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.learningAbility}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <span className="text-sm text-muted-foreground w-10">{formData.learningAbility}/100</span>
            </div>
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              员工在项目中的学习适应能力
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description" className="flex items-center gap-2 font-medium text-gray-700">
              <FileText className="h-4 w-4 text-blue-600 mr-1" />
              贡献描述
            </Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="请描述该员工在项目中的具体贡献和表现"
              rows={4}
              className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              详细描述员工在项目中的贡献和表现
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-3 border-t pt-4 bg-gray-50 rounded-b-xl">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={submitting}
            className="border-gray-300 hover:bg-gray-100 transition-colors duration-200"
          >
            取消
          </Button>
          <Button 
            type="submit" 
            disabled={submitting}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {employeeProject ? '更新团队成员' : '添加团队成员'}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 