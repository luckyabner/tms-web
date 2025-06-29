"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import api from "@/lib/api";
import { getAllDepartments } from "@/lib/services/departmentService";
import { getAllEmployees } from "@/lib/services/employeeService";
import {
  AlertCircle,
  ArrowRight,
  Building,
  Calendar,
  Check,
  UserCog,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function NewTransferContent() {
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employeeId");
  const transferId = searchParams.get("transferId");

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employeeDepartments, setEmployeeDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // 表单数据
  const [formData, setFormData] = useState({
    empId: employeeId || "",
    depId: "",
    position: "",
    superiorId: "",
    creatorId: "3", // 假设当前登录的是高层用户，ID为3
    state: "待审批",
    description: "",
    isCurrent: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

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
        const response = await api.get("/employee-departments");
        if (response.data && response.data.data) {
          employeeDepts = response.data.data.filter((ed) => ed.isCurrent === 1);
        }
      } catch (error) {
        console.error("获取员工-部门关系数据失败:", error);
      }

      // 为员工添加职位信息
      const enrichedEmployees = employeesData.map((emp) => {
        const empDept = employeeDepts.find((ed) => ed.empId === emp.id);
        return {
          ...emp,
          position: empDept?.position || "无职位",
          departmentId: empDept?.depId || null,
        };
      });

      setEmployees(enrichedEmployees);
      setDepartments(departmentsData);
      setEmployeeDepartments(employeeDepts);

      // 如果URL中有employeeId参数，自动填充员工信息
      if (employeeId) {
        const selectedEmployee = enrichedEmployees.find(
          (emp) => emp.id === parseInt(employeeId)
        );
        if (selectedEmployee) {
          setFormData((prev) => ({
            ...prev,
            empId: selectedEmployee.id.toString(),
          }));
        }
      }

      // 如果URL中有transferId参数，获取并填充调动信息
      if (transferId) {
        try {
          const response = await api.get(`/employee-departments/${transferId}`);
          if (response.data && response.data.data) {
            const transferData = response.data.data;
            setFormData({
              empId: transferData.empId.toString(),
              depId: transferData.depId.toString(),
              position: transferData.position || "",
              superiorId: transferData.superiorId
                ? transferData.superiorId.toString()
                : "",
              creatorId: transferData.creatorId.toString(),
              state: transferData.state,
              description: transferData.description || "",
              isCurrent: transferData.isCurrent,
            });
          }
        } catch (error) {
          console.error("获取调动信息失败:", error);
          setError("获取调动信息失败，请稍后重试");
        }
      }
    } catch (error) {
      console.error("获取数据失败:", error);
      setError("获取数据失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    // Handle special case for superiorId with "none" value
    if (name === "superiorId" && value === "none") {
      setFormData((prev) => ({
        ...prev,
        [name]: "", // Set to empty string when "none" is selected
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // 验证表单数据
      if (!formData.empId || !formData.depId || !formData.position) {
        throw new Error("请填写必填字段");
      }

      // 构建请求数据
      const requestData = {
        empId: parseInt(formData.empId),
        depId: parseInt(formData.depId),
        position: formData.position,
        superiorId: formData.superiorId ? parseInt(formData.superiorId) : null,
        creatorId: parseInt(formData.creatorId),
        state: formData.state || "待审批",
        description: formData.description || "",
        isCurrent: parseInt(formData.isCurrent) || 0,
      };

      console.log("提交数据:", requestData);

      // 发送请求
      const response = await api.post("/employee-departments", requestData);

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        // 重置表单
        setFormData({
          empId: "",
          depId: "",
          position: "",
          superiorId: "",
          creatorId: "3",
          state: "待审批",
          description: "",
          isCurrent: 0,
        });
      } else {
        throw new Error("提交失败，请稍后重试");
      }
    } catch (error) {
      console.error("提交失败:", error);
      setError(error.message || "提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  // 获取员工当前部门
  const getEmployeeCurrentDepartment = (empId) => {
    if (!empId) return null;

    const empDept = employeeDepartments.find(
      (ed) => ed.empId === parseInt(empId) && ed.isCurrent === 1
    );
    if (!empDept) return null;

    const department = departments.find((dept) => dept.id === empDept.depId);
    return department ? department.name : `部门ID: ${empDept.depId}`;
  };

  // 获取员工当前职位
  const getEmployeeCurrentPosition = (empId) => {
    if (!empId) return null;

    const empDept = employeeDepartments.find(
      (ed) => ed.empId === parseInt(empId) && ed.isCurrent === 1
    );
    return empDept ? empDept.position : null;
  };

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent">
            发起人事调动
          </h1>
          <p className="text-gray-500">创建新的员工部门或职位变动申请</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-green-100 shadow-sm">
            <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-teal-50">
              <CardTitle className="flex items-center text-green-800">
                <UserCog className="mr-2 h-5 w-5 text-green-600" />
                人事调动申请表
              </CardTitle>
              <CardDescription>填写以下信息提交人事调动申请</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="flex items-center rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
                      <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="flex items-center rounded-md border border-green-200 bg-green-50 p-4 text-green-700">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      人事调动申请已成功提交！
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="empId" className="text-sm font-medium">
                        选择员工 <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.empId}
                        onValueChange={(value) =>
                          handleSelectChange("empId", value)
                        }
                        disabled={submitting}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择员工" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem
                              key={employee.id}
                              value={employee.id.toString()}
                            >
                              {employee.name} - {employee.position || "无职位"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="depId" className="text-sm font-medium">
                        目标部门 <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.depId}
                        onValueChange={(value) =>
                          handleSelectChange("depId", value)
                        }
                        disabled={submitting}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择部门" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={department.id.toString()}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-sm font-medium">
                        新职位 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="输入新职位"
                        disabled={submitting}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="superiorId"
                        className="text-sm font-medium"
                      >
                        直接上级
                      </Label>
                      <Select
                        value={formData.superiorId}
                        onValueChange={(value) =>
                          handleSelectChange("superiorId", value)
                        }
                        disabled={submitting}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择上级" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">无直接上级</SelectItem>
                          {employees.map((employee) => (
                            <SelectItem
                              key={employee.id}
                              value={employee.id.toString()}
                            >
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      调动原因
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="请描述调动原因..."
                      className="min-h-[120px]"
                      disabled={submitting}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="bg-green-600 px-6 hover:bg-green-700"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          提交中...
                        </>
                      ) : (
                        "提交申请"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-6">
            <Card className="border-green-100 shadow-sm">
              <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-teal-50">
                <CardTitle className="flex items-center text-lg text-green-800">
                  <Calendar className="mr-2 h-5 w-5 text-green-600" />
                  员工当前信息
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                    <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                  </div>
                ) : formData.empId ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-600 font-medium text-white">
                        {employees
                          .find((emp) => emp.id === parseInt(formData.empId))
                          ?.name.charAt(0) || "?"}
                      </div>
                      <div>
                        <div className="font-medium">
                          {employees.find(
                            (emp) => emp.id === parseInt(formData.empId)
                          )?.name || "未知员工"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employees.find(
                            (emp) => emp.id === parseInt(formData.empId)
                          )?.phone || "无联系方式"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-md bg-gray-50 p-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">当前部门</span>
                        <span className="text-sm font-medium">
                          {getEmployeeCurrentDepartment(formData.empId) ||
                            "未分配"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">当前职位</span>
                        <span className="text-sm font-medium">
                          {getEmployeeCurrentPosition(formData.empId) ||
                            "未设置"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">入职日期</span>
                        <span className="text-sm font-medium">
                          {employees.find(
                            (emp) => emp.id === parseInt(formData.empId)
                          )?.hireDate || "未知"}
                        </span>
                      </div>
                    </div>

                    {formData.depId && (
                      <div className="mt-6 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                            {getEmployeeCurrentDepartment(formData.empId) ||
                              "未分配部门"}
                          </div>
                          <div className="h-8 w-px bg-green-300"></div>
                          <ArrowRight className="my-1 h-5 w-5 text-green-500" />
                          <div className="h-8 w-px bg-green-300"></div>
                          <div className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white">
                            {departments.find(
                              (dept) => dept.id === parseInt(formData.depId)
                            )?.name || "未知部门"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-6 text-center text-gray-500">
                    <UserCog className="mx-auto mb-2 h-12 w-12 text-gray-300" />
                    <p>请选择一名员工</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-green-100 shadow-sm">
              <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-teal-50">
                <CardTitle className="flex items-center text-lg text-green-800">
                  <Building className="mr-2 h-5 w-5 text-green-600" />
                  调动说明
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-green-700">
                      人事调动流程：
                    </span>
                    提交后，将由人事部门审核批准。
                  </p>
                  <p>
                    <span className="font-medium text-green-700">必填项：</span>
                    员工、目标部门和新职位为必填项。
                  </p>
                  <p>
                    <span className="font-medium text-green-700">
                      生效时间：
                    </span>
                    调动申请审批通过后即刻生效。
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewTransferPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen space-y-6 bg-gray-50 p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-2xl font-bold text-transparent">
                发起人事调动
              </h1>
              <p className="text-gray-500">创建新的员工部门或职位变动申请</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-green-100 shadow-sm">
                <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-teal-50">
                  <CardTitle className="flex items-center text-green-800">
                    <UserCog className="mr-2 h-5 w-5 text-green-600" />
                    人事调动申请表
                  </CardTitle>
                  <CardDescription>
                    填写以下信息提交人事调动申请
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-center py-12">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-200 border-t-green-600"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card className="border-green-100 shadow-sm">
                <CardHeader className="border-b border-green-100 bg-gradient-to-r from-green-50 to-teal-50">
                  <CardTitle className="flex items-center text-lg text-green-800">
                    <Calendar className="mr-2 h-5 w-5 text-green-600" />
                    员工当前信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                    <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      }
    >
      <NewTransferContent />
    </Suspense>
  );
}
