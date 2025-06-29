"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { handleDeleteDepartment } from "@/hooks/useDepartment";
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

export const departmentColumns = ({ onEdit } = {}) => [
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
    accessorKey: "name",
    header: "部门名称",
  },
  {
    accessorKey: "managerName",
    header: "部门主管",
  },
  {
    accessorKey: "parentDep",
    header: "上级部门",
  },
  {
    accessorKey: "empCount",
    header: "员工数量",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="创建时间" />
    ),
    meta: {
      headerName: "创建时间",
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const department = row.original;
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
              onClick={() => {
                window.location.href = `/departments/${department.id}`;
              }}
            >
              查看详情
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onEdit && onEdit(department);
              }}
            >
              编辑
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                handleDeleteDepartment(department.id);
              }}
            >
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  // ...
];
