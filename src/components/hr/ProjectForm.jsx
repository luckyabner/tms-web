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
import { format } from 'date-fns';
import { createProject, updateProject } from '@/lib/services/projectService';
import { getAllEmployees } from '@/lib/services/employeeService';
import { Loader2, AlertCircle, Briefcase, CalendarCheck, CalendarClock, FileText, Save, User } from 'lucide-react';

export default function ProjectForm({ project, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    leaderId: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    state: '未开始',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  
  // 初始化表单数据
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        leaderId: project.leaderId?.toString() || '',
        startDate: project.startDate || format(new Date(), 'yyyy-MM-dd'),
        endDate: project.endDate || '',
        state: project.state || '未开始',
        description: project.description || ''
      });
    }
    
    // 获取员工列表，用于选择项目负责人
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
  }, [project]);
  
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
        ...formData,
        leaderId: formData.leaderId ? parseInt(formData.leaderId) : null
      };
      
      // 如果是编辑现有项目
      if (project && project.id) {
        await updateProject(project.id, submitData);
      } else {
        // 如果是创建新项目
        await createProject(submitData);
      }
      
      // 提交成功后回调
      if (onSuccess) onSuccess();
      
    } catch (err) {
      console.error('提交项目数据失败:', err);
      setError('提交失败，请检查表单数据并重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 验证结束日期不早于开始日期
  const validateEndDate = () => {
    if (!formData.startDate || !formData.endDate) return true;
    return new Date(formData.endDate) >= new Date(formData.startDate);
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
            <Label htmlFor="name" className="flex items-center gap-2 font-medium text-gray-700">
              <span className="flex items-center">
                <Briefcase className="h-4 w-4 text-blue-600 mr-1" />
                项目名称
              </span>
              <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="请输入项目名称"
              className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="leaderId" className="flex items-center gap-2 font-medium text-gray-700">
              <User className="h-4 w-4 text-blue-600 mr-1" />
              项目负责人
            </Label>
            <Select
              value={formData.leaderId}
              onValueChange={(value) => handleSelectChange('leaderId', value)}
            >
              <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                <SelectValue placeholder="选择项目负责人" />
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
              选择项目的主要负责人
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="startDate" className="flex items-center gap-2 font-medium text-gray-700">
                <CalendarClock className="h-4 w-4 text-blue-600 mr-1" />
                开始日期
                <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
                项目开始日期
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="endDate" className="flex items-center gap-2 font-medium text-gray-700">
                <CalendarClock className="h-4 w-4 text-blue-600 mr-1" />
                结束日期
              </Label>
              <Input 
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className={`focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${!validateEndDate() ? 'border-red-500' : ''}`}
              />
              {!validateEndDate() && (
                <p className="text-xs text-red-500 mt-0">结束日期不能早于开始日期</p>
              )}
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
                项目预计结束日期（可选）
              </p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="state" className="flex items-center gap-2 font-medium text-gray-700">
              <CalendarCheck className="h-4 w-4 text-blue-600 mr-1" />
              项目状态
            </Label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleSelectChange('state', value)}
            >
              <SelectTrigger className="w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                <SelectValue placeholder="选择项目状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="未开始">未开始</SelectItem>
                <SelectItem value="进行中">进行中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              当前项目状态
            </p>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description" className="flex items-center gap-2 font-medium text-gray-700">
              <FileText className="h-4 w-4 text-blue-600 mr-1" />
              项目描述
            </Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="请输入项目描述，包括项目目标、范围等"
              rows={4}
              className="resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-0 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-100 mr-1"></span>
              详细描述项目的目标、范围和预期成果
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
            disabled={submitting || !validateEndDate()}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? '更新项目' : '创建项目'}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 