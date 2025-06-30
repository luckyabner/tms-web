"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getAllEmployees } from "@/lib/services/employeeService";
import { createProject, updateProject } from "@/lib/services/projectService";
import { format } from "date-fns";
import {
  AlertCircle,
  Briefcase,
  CalendarCheck,
  CalendarClock,
  FileText,
  Loader2,
  Save,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ProjectForm({ project, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    leaderId: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    state: "未开始",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);

  // 初始化表单数据
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        leaderId: project.leaderId?.toString() || "",
        startDate: project.startDate || format(new Date(), "yyyy-MM-dd"),
        endDate: project.endDate || "",
        state: project.state || "未开始",
        description: project.description || "",
      });
    }

    // 获取员工列表，用于选择项目负责人
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const employeeData = await getAllEmployees();
        setEmployees(employeeData);
      } catch (err) {
        console.error("获取员工数据失败:", err);
        setError("获取员工数据失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [project]);

  // 处理输入变化
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 处理选择变化
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        leaderId: formData.leaderId ? parseInt(formData.leaderId) : null,
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
      console.error("提交项目数据失败:", err);
      setError("提交失败，请检查表单数据并重试");
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
    <Card className="bg-background w-full rounded-lg border shadow-none">
      <form onSubmit={handleSubmit} className="space-y-6">
        <CardContent className="space-y-5 pt-2">
          {error && (
            <div className="text-destructive border-destructive/20 bg-destructive/5 flex items-center gap-2 rounded border px-3 py-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          {loading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              加载数据中...
            </div>
          )}

          <div className="space-y-1">
            <Label
              htmlFor="name"
              className="text-muted-foreground flex items-center gap-1 text-xs font-medium"
            >
              <Briefcase className="text-primary h-4 w-4" />
              项目名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="请输入项目名称"
              className="border-muted focus:ring-primary focus:border-primary h-9 rounded-md text-sm focus:ring-1"
            />
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="leaderId"
              className="text-muted-foreground flex items-center gap-1 text-xs font-medium"
            >
              <User className="text-primary h-4 w-4" />
              项目负责人
            </Label>
            <Select
              value={formData.leaderId}
              onValueChange={(value) => handleSelectChange("leaderId", value)}
            >
              <SelectTrigger className="border-muted focus:ring-primary focus:border-primary h-9 w-full rounded-md text-sm focus:ring-1">
                <SelectValue placeholder="选择项目负责人" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
            <p className="text-muted-foreground mt-1 text-xs">
              选择项目的主要负责人
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label
                htmlFor="startDate"
                className="text-muted-foreground flex items-center gap-1 text-xs font-medium"
              >
                <CalendarClock className="text-primary h-4 w-4" />
                开始日期 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="border-muted focus:ring-primary focus:border-primary h-9 rounded-md text-sm focus:ring-1"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="endDate"
                className="text-muted-foreground flex items-center gap-1 text-xs font-medium"
              >
                <CalendarClock className="text-primary h-4 w-4" />
                结束日期
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className={`border-muted focus:ring-primary focus:border-primary h-9 rounded-md text-sm focus:ring-1 ${!validateEndDate() ? "border-destructive" : ""}`}
              />
              {!validateEndDate() && (
                <p className="text-destructive mt-1 text-xs">
                  结束日期不能早于开始日期
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="state"
              className="text-muted-foreground flex items-center gap-1 text-xs font-medium"
            >
              <CalendarCheck className="text-primary h-4 w-4" />
              项目状态
            </Label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleSelectChange("state", value)}
            >
              <SelectTrigger className="border-muted focus:ring-primary focus:border-primary h-9 w-full rounded-md text-sm focus:ring-1">
                <SelectValue placeholder="选择项目状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="未开始">未开始</SelectItem>
                <SelectItem value="进行中">进行中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground mt-1 text-xs">当前项目状态</p>
          </div>

          <div className="space-y-1">
            <Label
              htmlFor="description"
              className="text-muted-foreground flex items-center gap-1 text-xs font-medium"
            >
              <FileText className="text-primary h-4 w-4" />
              项目描述
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="请输入项目描述，包括项目目标、范围等"
              rows={4}
              className="border-muted focus:ring-primary focus:border-primary resize-none rounded-md text-sm focus:ring-1"
            />
          </div>
        </CardContent>
        <CardFooter className="bg-background flex justify-end gap-2 rounded-b-lg border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={submitting}
            className="h-9 px-4 text-sm"
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={submitting || !validateEndDate()}
            className="bg-primary hover:bg-primary/90 h-9 px-4 text-sm text-white"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {project ? "更新项目" : "创建项目"}
            <Save className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
