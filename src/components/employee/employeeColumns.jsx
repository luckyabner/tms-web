"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, Eye, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { TableColumnHeader } from "../shared/tables/TableColumnHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";

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
    accessorKey: "position",
    header: "职位",
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
    id: "viewDetails",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            window.location.href = `/employees/${employee.id}`;
          }}
          className="h-8 w-8 cursor-pointer p-0"
          aria-label="查看详情"
        >
          <Eye className="h-5 w-5" />
        </Button>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const employee = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/employees/${employee.id}`;
                }}
              >
                查看详情
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  window.location.href = `/employees/${employee.id}/edit`;
                }}
              >
                编辑
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => setDeleteDialogOpen(true)}
              >
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DeleteEmployeeDialog
            employee={employee}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        </>
      );
    },
  },

  // ...
];
