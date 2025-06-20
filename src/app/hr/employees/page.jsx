import React from 'react';
import { employeeColumns } from '@/components/employee/employeeColoums';
import { getAllEmployees } from '@/lib/data/enployee';
import { BasicTable } from '@/components/shared/tables/BasicTable';

export default async function EmployeesPage() {
	const employees = await getAllEmployees();

	return (
		<div className="container mx-auto p-6 space-y-6">
			{/* 页面标题 */}
			<div>
				<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
					员工管理
				</h1>
				<p className="text-muted-foreground">管理和查看所有员工信息</p>
			</div>

			{/* 员工表格组件 */}
			<BasicTable
				columns={employeeColumns}
				data={employees}
			/>
		</div>
	);
}
