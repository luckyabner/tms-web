"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { TableColumnHeader } from "../shared/tables/TableColumnHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export const employeeColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "id",
    header: ({ column }) => <TableColumnHeader column={column} title="ID" />,
    meta: {
      headerName: "ID",
    },
  },
  {
    accessorKey: "name",
    header: "姓名",
  },
  {
    accessorKey: "gender",
    header: "性别",
  },
  {
    accessorKey: "phone",
    header: "手机号",
  },
  {
    accessorKey: "empType",
    header: "员工类型",
  },
  {
    accessorKey: "department",
    header: "部门",
  },
  {
    accessorKey: "hireDate",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="入职日期" />
    ),
    meta: {
      headerName: "入职日期",
    },
  },
  {
    accessorKey: "education",
    header: "学历",
  },
  {
    accessorKey: "school",
    header: "学校",
  },
  {
    accessorKey: "status",
    header: "状态",
  },
  {
    accessorKey: "createdAt",
    header: "创建时间",
  },
  {
    accessorKey: "updatedAt",
    header: "更新时间",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(employee.name)}
            >
              复制姓名
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `/employee/${employee.id}`;
              }}
            >
              查看详情
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  // ...
];
