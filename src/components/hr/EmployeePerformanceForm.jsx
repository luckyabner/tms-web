"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAllEmployees } from "@/lib/services/employeeService";
import {
  createEmployeePerformance,
  getAllPerformances,
  updateEmployeePerformance,
} from "@/lib/services/performanceService";
import {
  AlertCircle,
  Award,
  BarChart3,
  FileText,
  Loader2,
  Save,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function EmployeePerformanceForm({
  employeePerformance = null,
  performanceId = null,
  onSuccess,
  onCancel,
}) {
  const isEditing = !!employeePerformance;
  const userId = 1; // 默认用户ID，实际应用中应从用户会话中获取

  const [formData, setFormData] = useState({
    employeeId: employeePerformance?.employeeId || "",
    performanceId: employeePerformance?.performanceId || performanceId || "",
    approverId: employeePerformance?.approverId || userId,
    score: employeePerformance?.score !== "-" ? employeePerformance?.score : "",
    state: employeePerformance?.state || "未完成",
    description: employeePerformance?.description || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const empData = await getAllEmployees();
        setEmployees(empData);
        const perfData = await getAllPerformances();
        setPerformances(perfData);
      } catch (err) {
        setError("加载数据失败，请稍后重试");
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "score") {
      const score = parseFloat(value);
      if (value && (isNaN(score) || score < 0 || score > 100)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await updateEmployeePerformance(employeePerformance.id, formData);
      } else {
        await createEmployeePerformance(formData);
      }
      onSuccess();
    } catch {
      setError("保存失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 获取员工名称
  const getEmployeeName = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    return employee
      ? `${employee.name}${employee.department ? ` (${employee.department})` : ""}`
      : "未知员工";
  };
  // 获取绩效考核名称
  const getPerformanceName = (id) => {
    const performance = performances.find((perf) => perf.id === id);
    return performance ? performance.name : "未知考核";
  };

  return (
    <Card className="w-full border bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-4 pt-2">
          {error && (
            <div className="flex items-center rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              {error}
            </div>
          )}
          {loadingOptions && (
            <div className="flex items-center text-xs text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              加载数据中...
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="employeeId">
                员工<span className="ml-1 text-red-500">*</span>
              </Label>
              {isEditing ? (
                <Input
                  value={
                    employeePerformance.employeeName ||
                    getEmployeeName(employeePerformance.employeeId)
                  }
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
                  className="focus:ring-primary focus:border-primary w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2"
                >
                  <option value="">请选择员工</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.department || "无部门"})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="performanceId">
                绩效考核<span className="ml-1 text-red-500">*</span>
              </Label>
              {isEditing ? (
                <Input
                  value={
                    employeePerformance.performanceName ||
                    getPerformanceName(employeePerformance.performanceId)
                  }
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
                  className="focus:ring-primary focus:border-primary w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2"
                >
                  <option value="">请选择绩效考核</option>
                  {performances.map((perf) => (
                    <option key={perf.id} value={perf.id}>
                      {perf.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="score">绩效得分</Label>
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
                className="focus:ring-primary focus:border-primary focus:ring-2"
              />
              <p className="text-xs text-gray-400">0-100分</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor="state">评估状态</Label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="focus:ring-primary focus:border-primary w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2"
              >
                <option value="未完成">未完成</option>
                <option value="已完成">已完成</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="approverId">
              评估人<span className="ml-1 text-red-500">*</span>
            </Label>
            <select
              id="approverId"
              name="approverId"
              value={formData.approverId}
              onChange={handleChange}
              required
              className="focus:ring-primary focus:border-primary w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2"
            >
              <option value="">请选择评估人</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department || "无部门"})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">评估描述</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="请输入绩效评价..."
              rows={3}
              className="focus:ring-primary focus:border-primary resize-none focus:ring-2"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t bg-gray-50 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            取消
          </Button>
          <Button type="submit" disabled={loading || loadingOptions}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "保存" : "创建"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
