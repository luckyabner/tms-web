"use client";

import { Button } from "@/components/ui/button";

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
import {
    createDepartment,
    getAllDepartments,
    getAllEmployees,
    updateDepartment,
} from "@/lib/services/departmentService";
import {
    AlertCircle,
    Building2,
    FileText,
    FolderTree,
    Loader2,
    UserCircle,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DepartmentForm({
  department = null,
  onSuccess,
  onCancel,
}) {
  const isEditing = !!department;

  const [formData, setFormData] = useState({
    name: "",
    managerId: null,
    parentId: null,
    employeeCount: 0,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // 初始化表单数据
  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
        managerId: department.managerId ? department.managerId.toString() : null,
        parentId: department.parentId ? department.parentId.toString() : null,
        employeeCount: department.empCount || 0,
        description: department.description || "",
      });
    }
  }, [department]);

  // 加载部门和员工数据用于选择器
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // 获取部门列表（用于选择上级部门）
        const deptData = await getAllDepartments();
        setDepartments(deptData.filter((dept) => dept.id !== department?.id)); // 排除自己

        // 获取员工列表（用于选择部门主管）
        const empData = await getAllEmployees();
        setEmployees(empData);
      } catch (err) {
        console.error("加载选项数据失败:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [department?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "employeeCount" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
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
      console.error("保存部门失败:", err);
      setError("保存部门失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-destructive bg-destructive/10 border-destructive/20 flex items-center gap-2 rounded-md border p-3 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {loadingOptions && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-muted-foreground text-sm">加载数据中...</span>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              部门名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="请输入部门名称"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">上级部门</Label>
              <Select
                value={formData.parentId?.toString() || "none"}
                onValueChange={(value) =>
                  handleSelectChange("parentId", value === "none" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择上级部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">无上级部门</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">部门主管</Label>
              <Select
                value={formData.managerId?.toString() || "none"}
                onValueChange={(value) =>
                  handleSelectChange("managerId", value === "none" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择部门主管" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未指定</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeCount" className="text-sm font-medium">
              员工数量
            </Label>
            <Input
              id="employeeCount"
              name="employeeCount"
              type="number"
              min="0"
              value={formData.employeeCount}
              onChange={handleChange}
              placeholder="0"
              disabled={isEditing}
            />
            {isEditing && (
              <p className="text-muted-foreground text-xs">
                员工数量由系统自动统计，不可手动修改
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              部门描述
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="请输入部门职责描述"
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
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
            ) : isEditing ? (
              "保存修改"
            ) : (
              "创建部门"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
