import AddEmployeeForm from "@/components/employee/AddEmployeeForm";
import { getDepartmentsAction } from "@/lib/actions/employee-actions";

export default async function NewEmployeePage() {
  const departments = await getDepartmentsAction();

  return (
    <div className="container mx-auto p-6">
      <AddEmployeeForm departments={departments} />
    </div>
  );
}
