'use client';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { TableColumnHeader } from '../shared/tables/TableColumnHeader';

export const employeeColumns = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<TableColumnHeader
				column={column}
				title="ID"
			/>
		),
		meta: {
			headerName: 'ID',
		},
	},
	{
		accessorKey: 'name',
		header: '姓名',
	},
	{
		accessorKey: 'gender',
		header: '性别',
	},
	{
		accessorKey: 'phone',
		header: '手机号',
	},
	{
		accessorKey: 'empType',
		header: '员工类型',
	},
	{
		accessorKey: 'hireDate',
		header: ({ column }) => (
			<TableColumnHeader
				column={column}
				title="入职日期"
			/>
		),
		meta: {
			headerName: '入职日期',
		},
	},
	{
		accessorKey: 'education',
		header: '学历',
	},
	{
		accessorKey: 'school',
		header: '学校',
	},
	{
		accessorKey: 'status',
		header: '状态',
	},
	{
		accessorKey: 'createdAt',
		header: '创建时间',
	},
	{
		accessorKey: 'updatedAt',
		header: '更新时间',
	},
	// ...
];
