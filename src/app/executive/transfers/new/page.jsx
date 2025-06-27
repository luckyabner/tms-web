'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  UserCog, 
  Building, 
  ChevronLeft, 
  User,
  Briefcase,
  CalendarClock, 
  FileText,
  Save,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getAllEmployees } from '@/lib/services/employeeService';
import { getAllDepartments } from '@/lib/services/departmentService';
import api from '@/lib/api';

export default function NewTransferPage() {
  const searchParams = useSearchParams();
  const employeeIdParam = searchParams.get('employeeId');
  
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    empId: employeeIdParam || '',
    currentDepId: '',
    newDepId: '',
    position: '',
    description: '',
    creatorId: '1', // 这里假设创建者ID为1，实际应从登录信息中获取
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 获取员工数据
        const employeesData = await getAllEmployees();
        setEmployees(employeesData);
        
        // 获取部门数据
        const departmentsData = await getAllDepartments();
        setDepartments(departmentsData);
        
        // 如果URL中有员工ID，自动填充该员工的当前部门
        if (employeeIdParam) {
          const selectedEmployee = employeesData.find(emp => emp.id === parseInt(employeeIdParam));
          if (selectedEmployee) {
            setFormData(prev => ({
              ...prev,
              empId: selectedEmployee.id.toString(),
              currentDepId: selectedEmployee.departmentId?.toString() || '',
              position: selectedEmployee.position || ''
            }));
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [employeeIdParam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 如果更改了员工，自动更新当前部门
    if (name === 'empId') {
      const selectedEmployee = employees.find(emp => emp.id === parseInt(value));
      if (selectedEmployee) {
        setFormData(prev => ({
          ...prev,
          empId: value,
          currentDepId: selectedEmployee.departmentId?.toString() || '',
          position: selectedEmployee.position || ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      // 验证表单
      if (!formData.empId) {
        throw new Error('请选择员工');
      }
      
      if (!formData.newDepId) {
        throw new Error('请选择目标部门');
      }
      
      if (!formData.position) {
        throw new Error('请填写职位');
      }
      
      if (formData.currentDepId === formData.newDepId) {
        throw new Error('目标部门不能与当前部门相同');
      }
      
      // 构建请求数据
      const transferData = {
        empId: parseInt(formData.empId),
        depId: parseInt(formData.newDepId),
        position: formData.position,
        isCurrent: 1, // 表示这是一个当前有效的调动记录
        description: formData.description || '人事调动申请'
      };
      
      console.log('提交人事调动申请:', transferData);
      
      // 调用API创建人事调动
      const response = await api.post('/employee-departments', transferData);
      
      console.log('人事调动申请响应:', response.data);
      
      // 调用成功
      setSubmitSuccess(true);
    } catch (error) {
      console.error('提交人事调动申请失败:', error);
      setSubmitError(error.message || '提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 获取员工信息
  const getEmployeeInfo = (id) => {
    return employees.find(emp => emp.id === parseInt(id)) || null;
  };
  
  // 获取部门信息
  const getDepartmentInfo = (id) => {
    return departments.find(dept => dept.id === parseInt(id)) || null;
  };

  const selectedEmployee = getEmployeeInfo(parseInt(formData.empId));
  const currentDepartment = getDepartmentInfo(parseInt(formData.currentDepId));
  const newDepartment = getDepartmentInfo(parseInt(formData.newDepId));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 返回按钮 */}
      <div>
        <Button variant="outline" onClick={() => window.history.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
      </div>

      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          发起人事调动
        </h1>
        <p className="text-muted-foreground">创建员工部门调动申请，等待人事专员审批</p>
      </div>

      {submitSuccess ? (
        // 提交成功
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <Save className="h-5 w-5 mr-2 text-green-600" />
              提交成功
            </CardTitle>
            <CardDescription>
              人事调动申请已提交成功，等待人事专员审批
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white p-4 rounded-lg border border-green-100 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-500">员工：</span>
                </div>
                <span className="font-medium">{selectedEmployee?.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-500">部门调动：</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700">{currentDepartment?.name}</span>
                  <ChevronLeft className="h-4 w-4 mx-2 rotate-180 text-gray-400" />
                  <span className="font-medium">{newDepartment?.name}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Briefcase className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-500">职位：</span>
                </div>
                <span className="font-medium">{formData.position}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarClock className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-gray-500">申请时间：</span>
                </div>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end space-x-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              返回列表
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setFormData({
                  empId: '',
                  currentDepId: '',
                  newDepId: '',
                  position: '',
                  description: '',
                  creatorId: '1',
                });
                setSubmitSuccess(false);
              }}
            >
              继续添加
            </Button>
          </CardFooter>
        </Card>
      ) : (
        // 表单
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="flex items-center text-green-800">
                <UserCog className="h-5 w-5 mr-2 text-green-600" />
                调动申请表
              </CardTitle>
              <CardDescription>
                填写员工调动信息，提交后将通知人事专员进行审批
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* 错误提示 */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span>{submitError}</span>
                </div>
              )}
              
              {/* 员工选择 */}
              <div className="space-y-2">
                <Label htmlFor="empId" className="flex items-center font-medium">
                  <User className="h-4 w-4 mr-1 text-green-600" />
                  选择员工 <span className="text-red-500 ml-1">*</span>
                </Label>
                <select
                  id="empId"
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  required
                  disabled={loading}
                >
                  <option value="">请选择员工</option>
                  {employees
                    .filter(emp => emp.status === '在职') // 只显示在职员工
                    .map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department || '未分配部门'} - {emp.position || '未设置职位'}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              {/* 显示当前部门 */}
              <div className="space-y-2">
                <Label htmlFor="currentDepId" className="flex items-center font-medium">
                  <Building className="h-4 w-4 mr-1 text-green-600" />
                  当前部门
                </Label>
                {currentDepartment ? (
                  <div className="flex items-center h-10 px-3 py-2 border border-input rounded-md bg-gray-50">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {currentDepartment.name}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center h-10 px-3 py-2 border border-input rounded-md bg-gray-50 text-gray-500">
                    未分配部门
                  </div>
                )}
              </div>
              
              {/* 目标部门 */}
              <div className="space-y-2">
                <Label htmlFor="newDepId" className="flex items-center font-medium">
                  <Building className="h-4 w-4 mr-1 text-green-600" />
                  调往部门 <span className="text-red-500 ml-1">*</span>
                </Label>
                <select
                  id="newDepId"
                  name="newDepId"
                  value={formData.newDepId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                  required
                  disabled={loading}
                >
                  <option value="">请选择目标部门</option>
                  {departments
                    .filter(dept => dept.id !== parseInt(formData.currentDepId)) // 过滤掉当前部门
                    .map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))
                  }
                </select>
              </div>
              
              {/* 职位 */}
              <div className="space-y-2">
                <Label htmlFor="position" className="flex items-center font-medium">
                  <Briefcase className="h-4 w-4 mr-1 text-green-600" />
                  新职位 <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="请输入新职位"
                  required
                  disabled={loading}
                />
              </div>
              
              {/* 调动原因 */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center font-medium">
                  <FileText className="h-4 w-4 mr-1 text-green-600" />
                  调动原因
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="请输入调动原因（选填）"
                  className="min-h-[100px]"
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-100 gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => window.history.back()}
                disabled={submitting}
              >
                取消
              </Button>
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
                disabled={submitting || loading}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                    提交中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    提交申请
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
} 