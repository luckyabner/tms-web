'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Building, 
  UserCog, 
  User, 
  Calendar, 
  Briefcase,
  Check,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { getAllEmployees } from '@/lib/services/employeeService';
import { getAllDepartments } from '@/lib/services/departmentService';
import api from '@/lib/api';

export default function NewTransferPage() {
  const searchParams = useSearchParams();
  const transferId = searchParams.get('transferId');

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeDepartments, setEmployeeDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState({
    empId: '',
    currentDepId: '',
    newDepId: '',
    position: '',
    superiorId: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (transferId) {
      fetchTransferDetails(transferId);
    }
  }, [transferId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 获取员工数据
      const employeesData = await getAllEmployees();
      
      // 获取部门数据
      const departmentsData = await getAllDepartments();
      
      // 获取员工-部门关系数据
      let employeeDepts = [];
      try {
        const response = await api.get('/employee-departments');
        if (response.data && response.data.data) {
          employeeDepts = response.data.data.filter(ed => ed.isCurrent === 1);
        }
      } catch (error) {
        console.error('获取员工-部门关系数据失败:', error);
      }
      
      // 为员工添加职位信息
      const enrichedEmployees = employeesData.map(emp => {
        const empDept = employeeDepts.find(ed => ed.empId === emp.id);
        return {
          ...emp,
          position: empDept?.position || '无职位',
          departmentId: empDept?.depId || null
        };
      });
      
      setEmployees(enrichedEmployees);
      setDepartments(departmentsData);
      setEmployeeDepartments(employeeDepts);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransferDetails = async (id) => {
    try {
      const response = await api.get(`/employee-departments/${id}`);
      if (response.data && response.data.data) {
        const transfer = response.data.data;
        
        // 获取员工当前部门
        let currentDepartment = '';
        try {
          const currentDeptResponse = await api.get(`/employee-departments/employees/${transfer.empId}`);
          if (currentDeptResponse.data && currentDeptResponse.data.data) {
            currentDepartment = currentDeptResponse.data.data.depId;
          }
        } catch (error) {
          console.error('获取员工当前部门失败:', error);
        }
        
        setFormData({
          empId: transfer.empId,
          currentDepId: currentDepartment,
          newDepId: transfer.depId,
          position: transfer.position || '',
          superiorId: transfer.superiorId || '',
          description: transfer.description || '',
        });
      }
    } catch (error) {
      console.error('获取调动详情失败:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // 如果选择了员工，自动填充当前部门
    if (name === 'empId') {
      const employeeId = parseInt(value);
      const employeeDepartment = employeeDepartments.find(ed => ed.empId === employeeId);
      if (employeeDepartment) {
        setFormData((prev) => ({ ...prev, currentDepId: employeeDepartment.depId }));
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
      
      // 构造请求数据
      const requestData = {
        empId: parseInt(formData.empId),
        depId: parseInt(formData.newDepId),
        position: formData.position,
        superiorId: formData.superiorId ? parseInt(formData.superiorId) : null,
        creatorId: 2, // 假设当前用户ID为2（高层用户）
        state: '待审批',
        isCurrent: 0, // 新申请的调动不是当前部门
        description: formData.description || '人事调动申请'
      };
      
      // 发送请求
      const response = await api.post('/employee-departments', requestData);
      
      if (response.data && response.data.code === '200') {
        setSubmitSuccess(true);
        // 重置表单
        setFormData({
          empId: '',
          currentDepId: '',
          newDepId: '',
          position: '',
          superiorId: '',
          description: '',
        });
      } else {
        throw new Error(response.data?.msg || '提交失败');
      }
    } catch (error) {
      console.error('提交失败:', error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // 获取员工当前部门名称
  const getCurrentDepartmentName = (depId) => {
    const department = departments.find(d => d.id === parseInt(depId));
    return department ? department.name : '未知部门';
  };

  return (
    <div className="container mx-auto p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <a href="/executive/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </a>
        </Button>
        <h1 className="text-2xl font-bold">发起人事调动</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-green-600" />
            人事调动申请表
          </CardTitle>
          <CardDescription>
            请填写以下信息以发起人事调动申请，提交后将等待审批
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 员工信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">员工信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="empId">选择员工</Label>
                    <select
                      id="empId"
                      name="empId"
                      value={formData.empId}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled={submitting}
                    >
                      <option value="">请选择员工</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} - {employee.position || '无职位'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentDepId">当前部门</Label>
                    <Input
                      id="currentDepId"
                      name="currentDepId"
                      value={getCurrentDepartmentName(formData.currentDepId)}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* 调动信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">调动信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newDepId">目标部门</Label>
                    <select
                      id="newDepId"
                      name="newDepId"
                      value={formData.newDepId}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled={submitting}
                    >
                      <option value="">请选择部门</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">新职位</Label>
                    <Input
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="请输入新职位"
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="superiorId">直接上级</Label>
                    <select
                      id="superiorId"
                      name="superiorId"
                      value={formData.superiorId}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled={submitting}
                    >
                      <option value="">请选择上级（可选）</option>
                      {employees
                        .filter(emp => emp.id !== parseInt(formData.empId))
                        .map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position || '无职位'}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">调动原因</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="请描述调动原因"
                    rows={4}
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* 提交状态 */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>申请提交成功，等待审批</span>
                </div>
              )}

              {/* 提交按钮 */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  onClick={() => window.history.back()}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      提交中...
                    </>
                  ) : (
                    '提交申请'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 