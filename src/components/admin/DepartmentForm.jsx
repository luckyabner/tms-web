'use client';

import { useState, useEffect } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createDepartment, updateDepartment, getAllDepartments, getAllEmployees } from '@/lib/services/departmentService';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function DepartmentForm({ department = null, onSuccess, onCancel }) {
  const isEditing = !!department;

  const [formData, setFormData] = useState({
    name: department?.name || '',
    managerId: department?.managerId || '',
    parentId: department?.parentId || '',
    employeeCount: department?.employeeCount || 0,
    description: department?.description || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // 加载部门和员工数据用于选择器
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // 获取部门列表（用于选择上级部门）
        const deptData = await getAllDepartments();
        setDepartments(deptData.filter(dept => dept.id !== department?.id)); // 排除自己
        
        // 获取员工列表（用于选择部门主管）
        const empData = await getAllEmployees();
        setEmployees(empData);
      } catch (err) {
        console.error('加载选项数据失败:', err);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, [department?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employeeCount' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await updateDepartment(department.id, formData);
      } else {
        await createDepartment(formData);
      }
      onSuccess();
    } catch (err) {
      console.error('保存部门失败:', err);
      setError('保存部门失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardContent className="space-y-6 pt-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}
        
        {loadingOptions && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            <span className="ml-2 text-sm text-gray-500">加载数据中...</span>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name" className="font-medium">部门名称 <span className="text-red-500">*</span></Label>
          <Input 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="请输入部门名称"
            className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="parentId" className="font-medium">上级部门</Label>
            <select
              id="parentId"
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">无上级部门</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">选择此部门的上级部门</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="managerId" className="font-medium">部门主管</Label>
            <select
              id="managerId"
              name="managerId"
              value={formData.managerId}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">未指定</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">选择此部门的负责人</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="employeeCount" className="font-medium">员工数量</Label>
          <Input 
            id="employeeCount"
            name="employeeCount"
            type="number"
            min="0"
            value={formData.employeeCount}
            onChange={handleChange}
            placeholder="0"
            className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            disabled={isEditing} // 编辑时不允许修改员工数量
          />
          <p className="text-xs text-gray-500 mt-1">{isEditing ? '员工数量由系统自动统计，不可手动修改' : '创建部门时的初始员工数量'}</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description" className="font-medium">部门描述</Label>
          <Textarea 
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="请输入部门职责描述"
            rows={4}
            className="resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-3 border-t pt-6">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
          className="border-gray-300 hover:bg-gray-50"
        >
          取消
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          disabled={loading || loadingOptions}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : isEditing ? '保存修改' : '创建部门'}
        </Button>
      </CardFooter>
    </form>
  );
} 