"use client";
import DepartmentForm from "@/components/admin/DepartmentForm";
import { departmentColumns } from "@/components/department/departmentColumns";
import { DepartmentDistribution } from "@/components/department/DepartmentDistribution";
import { DepartmentHierarchy } from "@/components/department/DepartmentHierarchy";
import { DepartmentStats } from "@/components/department/DepartmentStats";
import { EditSheet } from "@/components/shared/sheet/EditSheet";
import SheetFormButton from "@/components/shared/sheet/SheetFormButton";
import { BasicTable } from "@/components/shared/tables/BasicTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDepartment } from "@/hooks/useDepartment";
import { Building2, TableIcon } from "lucide-react";
import React, { useState } from "react";

export default function DepartmentPage() {
  const { departments, error, isLoading, refreshDepartments } = useDepartment();
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  // 处理编辑部门
  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setIsEditFormOpen(true);
  };

  // 关闭编辑表单并刷新数据
  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
    setEditingDepartment(null);
    refreshDepartments(); // 刷新部门数据
  };

  // 处理新建部门成功后刷新数据
  const handleCreateSuccess = () => {
    refreshDepartments(); // 刷新部门数据
  };

  // 处理加载状态
  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Building2 className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">部门管理</h1>
              <p className="text-muted-foreground">管理组织架构和部门信息</p>
            </div>
          </div>
        </div>
        <div className="py-8 text-center">
          <p>正在加载部门数据...</p>
        </div>
      </div>
    );
  }

  // 处理错误状态
  if (error) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 rounded-lg p-2">
              <Building2 className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">部门管理</h1>
              <p className="text-muted-foreground">管理组织架构和部门信息</p>
            </div>
          </div>
        </div>
        <div className="py-8 text-center text-red-500">
          <p>加载部门数据失败: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary mt-2 rounded px-4 py-2 text-white"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 确保有数据后再渲染
  const departmentData = departments || [];

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">部门管理</h1>
          <p className="text-muted-foreground mt-2">管理组织架构和部门信息</p>
        </div>
        <SheetFormButton
          buttonLabel={"新建部门"}
          renderForm={(onClose) => (
            <DepartmentForm
              onSuccess={() => {
                onClose();
                handleCreateSuccess();
              }}
              onCancel={onClose}
            />
          )}
        />
      </div>

      {/* 统计卡片 */}
      <DepartmentStats departments={departmentData} />

      {/* 可视化组件区域 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* 组织架构 */}
        <DepartmentHierarchy departments={departmentData} />

        {/* 员工分布 */}
        <DepartmentDistribution departments={departmentData} />
      </div>

      {/* 部门数据表格 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TableIcon className="h-5 w-5" />
            <span>部门详细信息</span>
          </CardTitle>
          <CardDescription>查看和管理所有部门的详细信息</CardDescription>
        </CardHeader>
        <CardContent>
          <BasicTable
            columns={departmentColumns({ onEdit: handleEditDepartment })}
            data={departmentData}
          />
        </CardContent>
      </Card>

      {/* 编辑部门表单 */}
      <EditSheet
        isOpen={isEditFormOpen}
        onOpenChange={setIsEditFormOpen}
        title="编辑部门"
        icon={Building2}
      >
        <DepartmentForm
          department={editingDepartment}
          onSuccess={handleCloseEditForm}
          onCancel={handleCloseEditForm}
        />
      </EditSheet>
    </div>
  );
}
