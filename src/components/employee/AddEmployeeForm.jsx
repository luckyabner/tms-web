"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/hooks/auth";
import { addEmployeeAction } from "@/lib/actions/employee-actions";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

const initialState = {
  success: null,
  message: "",
};

export default function AddEmployeeForm({ departments = [] }) {
  const [state, formAction] = useActionState(addEmployeeAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/employees");
    }
  }, [state.success, router]);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          添加新员工
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名 *</Label>
              <Input id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">性别 *</Label>
              <Select name="gender" defaultValue="男">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">手机号 *</Label>
              <Input id="phone" name="phone" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">职位</Label>
              <Input id="position" name="position" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">出生日期 *</Label>
              <Input id="birthDate" name="birthDate" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">入职日期 *</Label>
              <Input
                id="hireDate"
                name="hireDate"
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="education">学历 *</Label>
              <Select name="education" defaultValue="本科">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="高中">高中</SelectItem>
                  <SelectItem value="大专">大专</SelectItem>
                  <SelectItem value="本科">本科</SelectItem>
                  <SelectItem value="硕士">硕士</SelectItem>
                  <SelectItem value="博士">博士</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">毕业院校</Label>
              <Input id="school" name="school" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">员工类型</Label>
              <Select name="role" defaultValue="普通用户">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.ADMIN}>{Role.ADMIN}</SelectItem>
                  <SelectItem value={Role.EMPLOYEE}>{Role.EMPLOYEE}</SelectItem>
                  <SelectItem value={Role.HR}>{Role.HR}</SelectItem>
                  <SelectItem value={Role.LEADER}>{Role.LEADER}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">员工状态</Label>
              <Select name="status" defaultValue="在职">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="在职">在职</SelectItem>
                  <SelectItem value="离职">离职</SelectItem>
                  <SelectItem value="试用期">试用期</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {departments.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="departmentId">所属部门</Label>
              <Select name="departmentId">
                <SelectTrigger>
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {state.message && (
            <div
              className={`rounded-md p-3 text-sm ${
                state.success
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {state.message}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              添加员工
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
