import EditEmployeeForm from "@/components/employee/EditEmployeeForm";
import {
  getDepartmentsAction,
  getEmployeeAction,
} from "@/lib/actions/employee-actions";
import { notFound } from "next/navigation";

export default async function EditEmployeePage({ params }) {
  const { id } = params;

  const [employee, departments] = await Promise.all([
    getEmployeeAction(id),
    getDepartmentsAction(),
  ]);

  if (!employee) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <EditEmployeeForm employee={employee} departments={departments} />
    </div>
  );
}
