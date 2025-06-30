import { departmentColumns } from "@/components/department/departmentColumns";
import { BasicTable } from "@/components/shared/tables/BasicTable";
import { getAllDepartments } from "@/lib/services/employeeService";
import React from "react";

export default async function page_old() {
  const departments = await getAllDepartments();
  console.log("部门数据:", departments);
  return (
    <div>
      <BasicTable columns={departmentColumns} data={departments} />
    </div>
  );
}
