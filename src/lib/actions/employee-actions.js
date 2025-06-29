"use server";

import {
  createEmployee,
  deleteEmployee,
  getAllDepartments,
  getEmployeeById,
  updateEmployee,
} from "@/lib/services/employeeService";
import { revalidatePath } from "next/cache";

export async function addEmployeeAction(prevState, formData) {
  try {
    const employeeData = {
      name: formData.get("name"),
      password: "123456", // 默认密码
      gender: formData.get("gender"),
      phone: formData.get("phone"),
      birthDate: formData.get("birthDate"),
      hireDate: formData.get("hireDate"),
      education: formData.get("education"),
      status: formData.get("status") || "在职",
      school: formData.get("school") || "",
      empType: formData.get("role") || "普通用户", // 使用empType而不是role
      description: "", // 默认描述
      depId: formData.get("departmentId")
        ? parseInt(formData.get("departmentId"))
        : null, // 使用depId而不是departmentId
      position: formData.get("position") || "",
      superiorId: null, // 默认上级ID
      creatorId: 1, // 默认创建者ID，实际应该从用户session获取
      approverId: 1, // 默认审批者ID
      depDescription: "新员工入职", // 部门描述
    };

    const result = await createEmployee(employeeData);

    // 如果没有抛出错误，说明创建成功
    revalidatePath("/employees");
    return { success: true, message: "员工添加成功" };
  } catch (error) {
    console.error("添加员工失败:", error);
    return { success: false, message: error.message || "添加失败" };
  }
}

export async function getDepartmentsAction() {
  try {
    return await getAllDepartments();
  } catch (error) {
    console.error("获取部门列表失败:", error);
    return [];
  }
}

export async function updateEmployeeAction(prevState, formData) {
  try {
    const id = formData.get("id");
    const departmentId = formData.get("departmentId");

    // 确保有有效的部门ID，如果没有选择部门就跳过部门相关的更新
    const hasValidDepartment = departmentId && departmentId !== "none";

    const employeeData = {
      name: formData.get("name"),
      gender: formData.get("gender"),
      phone: formData.get("phone"),
      birthDate: formData.get("birthDate"),
      hireDate: formData.get("hireDate"),
      education: formData.get("education"),
      status: formData.get("status") || "在职",
      school: formData.get("school") || "",
      empType: formData.get("role") || "普通用户",
      position: formData.get("position") || "",
      empPhoto: null,
      isDeleted: false,
      description: "员工信息更新",
      // 只有当有有效部门时才包含部门相关字段
      ...(hasValidDepartment && {
        depId: parseInt(departmentId),
        superiorId: null, // 可以根据需要设置
        creatorId: 1, // 应该从用户session获取
        approverId: 1, // 应该从用户session获取
        state: "已通过", // 更新状态
        depDescription: "员工信息更新",
        isCurrent: 1,
      }),
    };

    console.log("更新员工数据:", JSON.stringify(employeeData, null, 2));
    console.log("员工ID:", id);

    await updateEmployee(id, employeeData);

    revalidatePath("/employees");
    revalidatePath(`/employees/${id}`);
    return { success: true, message: "员工信息更新成功" };
  } catch (error) {
    console.error("更新员工失败:", error);
    return { success: false, message: error.message || "更新失败" };
  }
}

export async function getEmployeeAction(id) {
  try {
    return await getEmployeeById(id);
  } catch (error) {
    console.error("获取员工信息失败:", error);
    return null;
  }
}

export async function deleteEmployeeAction(id) {
  try {
    await deleteEmployee(id);
    revalidatePath("/employees");
    return { success: true, message: "员工删除成功" };
  } catch (error) {
    console.error("删除员工失败:", error);
    return { success: false, message: error.message || "删除失败" };
  }
}
