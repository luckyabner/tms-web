import React from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

/**
 * 员工表格复用组件
 * @param {Object[]} data - 员工数据数组
 * @param {Array} columns - react-table columns 配置
 * @param {Function} onRowClick - 行点击事件 (可选)
 */
export default function EmployeeTable({ data, columns, onRowClick }) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="bg-white rounded-lg shadow overflow-x-auto">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="text-center"
							>
								暂无数据
							</TableCell>
						</TableRow>
					) : (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								className="cursor-pointer hover:bg-muted/50"
								onClick={() => onRowClick && onRowClick(row.original)}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
