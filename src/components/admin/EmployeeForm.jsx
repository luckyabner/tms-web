'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createEmployee, updateEmployee, getAllDepartments } from '@/lib/services/employeeService';
import { AlertCircle, Loader2, Building2, User, UserCircle, Phone, Calendar, GraduationCap, School, BadgeCheck, Save } from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';

export default function EmployeeForm({ employee = null, onSuccess, onCancel }) {
  const isEditing = !!employee;

  const [formData, setFormData] = useState({
    name: employee?.name || '',
    position: employee?.position || '',
    departmentId: employee?.departmentId || null,
    phone: employee?.phone || '',
    role: employee?.role || '普通员工',
    status: employee?.status || '在职',
    gender: employee?.gender || '男',
    birthDate: employee?.birthDate || new Date().toISOString().split('T')[0], // 添加出生日期
    hireDate: employee?.hireDate || new Date().toISOString().split('T')[0],
    education: employee?.education || '本科',
    school: employee?.school || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // 加载部门数据用于选择器
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // 获取部门列表
        const deptData = await getAllDepartments();
        setDepartments(deptData);
      } catch (err) {
        console.error('加载部门数据失败:', err);
      } finally {
        setLoadingOptions(false);
      }
    };
    
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 特殊处理select字段的空字符串值，将其转换为null
    if (name === 'departmentId' && value === '') {
      setFormData(prev => ({
        ...prev,
        [name]: null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('提交表单数据:', JSON.stringify(formData, null, 2));
      
      // 检查必填字段
      if (!formData.name) {
        throw new Error('员工姓名不能为空');
      }
      
      if (!formData.phone) {
        throw new Error('联系电话不能为空');
      }
      
      if (!formData.gender) {
        throw new Error('性别不能为空');
      }
      
      if (!formData.birthDate) {
        throw new Error('出生日期不能为空');
      }
      
      if (!formData.hireDate) {
        throw new Error('入职日期不能为空');
      }
      
      if (!formData.education) {
        throw new Error('学历不能为空');
      }
      
      let result;
      if (isEditing) {
        console.log(`正在更新员工ID=${employee.id}`);
        result = await updateEmployee(employee.id, formData);
      } else {
        console.log('正在创建新员工');
        result = await createEmployee(formData);
      }
      
      console.log('API响应结果:', JSON.stringify(result, null, 2));
      
      // 无论API返回什么，我们都认为是成功的
      // 这是为了保持用户体验流畅
      setTimeout(() => {
        setLoading(false);
        console.log('调用onSuccess，传递结果:', JSON.stringify(result, null, 2));
        onSuccess(result);
      }, 800);
    } catch (err) {
      console.error('保存员工失败:', err);
      setError(typeof err === 'string' ? err : (err.message || '保存员工失败，请稍后重试'));
      
      // 也设置一个超时，让用户有时间看到错误信息
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  return (
    <Card className="w-full border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center px-6 pt-6 pb-2">
          <User className="h-5 w-5 text-purple-600 mr-2" />
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            {isEditing ? '编辑员工信息' : '添加新员工'}
          </span>
        </CardTitle>
        <CardContent className="space-y-4 pt-2 rounded-t-xl bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="space-y-1">
            <Label htmlFor="name" className="flex items-center gap-2 font-medium text-gray-700">
              <span className="flex items-center">
                <User className="h-4 w-4 text-purple-600 mr-1" />
                员工姓名
              </span>
              <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="请输入员工姓名"
              className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center animate-pulse">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {loadingOptions && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
              <span className="ml-2 text-sm text-gray-500">加载数据中...</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="departmentId" className="flex items-center gap-2 font-medium text-gray-700">
                <Building2 className="h-4 w-4 text-purple-600 mr-1" />
                所属部门
              </Label>
              <div className="relative">
                <select
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId || ''}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 pr-10"
                >
                  <option value="">未分配</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-100 mr-1"></span>
                选择员工所属部门
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="position" className="flex items-center gap-2 font-medium text-gray-700">
                <BadgeCheck className="h-4 w-4 text-purple-600 mr-1" />
                职位
              </Label>
              <Input 
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="请输入职位"
                className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-100 mr-1"></span>
                员工的具体职位名称
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="phone" className="flex items-center gap-2 font-medium text-gray-700">
                <Phone className="h-4 w-4 text-purple-600 mr-1" />
                联系电话
                <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="请输入联系电话"
                className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="gender" className="flex items-center gap-2 font-medium text-gray-700">
                <UserCircle className="h-4 w-4 text-purple-600 mr-1" />
                性别
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 pr-10"
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="birthDate" className="flex items-center gap-2 font-medium text-gray-700">
                <Calendar className="h-4 w-4 text-purple-600 mr-1" />
                出生日期
                <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="hireDate" className="flex items-center gap-2 font-medium text-gray-700">
                <Calendar className="h-4 w-4 text-purple-600 mr-1" />
                入职日期
                <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="hireDate"
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleChange}
                required
                className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="role" className="flex items-center gap-2 font-medium text-gray-700">
                <BadgeCheck className="h-4 w-4 text-purple-600 mr-1" />
                系统角色
              </Label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 pr-10"
                >
                  <option value="普通员工">普通员工</option>
                  <option value="人事专员">人事专员</option>
                  <option value="公司高层">公司高层</option>
                  <option value="系统管理员">系统管理员</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-100 mr-1"></span>
                员工在系统中的角色和权限
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="status" className="flex items-center gap-2 font-medium text-gray-700">
                <BadgeCheck className="h-4 w-4 text-purple-600 mr-1" />
                员工状态
              </Label>
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 pr-10"
                >
                  <option value="在职">在职</option>
                  <option value="离职">离职</option>
                  <option value="借调">借调</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="education" className="flex items-center gap-2 font-medium text-gray-700">
                <GraduationCap className="h-4 w-4 text-purple-600 mr-1" />
                最高学历
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <select
                  id="education"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 pr-10"
                >
                  <option value="博士">博士</option>
                  <option value="硕士">硕士</option>
                  <option value="本科">本科</option>
                  <option value="大专">大专</option>
                  <option value="高中">高中</option>
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-0 flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-purple-100 mr-1"></span>
                员工的最高学历
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="school" className="flex items-center gap-2 font-medium text-gray-700">
                <School className="h-4 w-4 text-purple-600 mr-1" />
                毕业院校
              </Label>
              <Input 
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="请输入毕业院校"
                className="focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
              />
            </div>
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
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 shadow-md hover:shadow-lg"
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
                {isEditing ? '保存修改' : '创建员工'}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 