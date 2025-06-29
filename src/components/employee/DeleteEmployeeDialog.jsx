"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteEmployeeAction } from "@/lib/actions/employee-actions";
import { Loader2, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

export default function DeleteEmployeeDialog({ employee, open, onOpenChange }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteEmployeeAction(employee.id);
      if (result.success) {
        onOpenChange(false);
        // 可以添加 toast 通知
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            删除员工
          </DialogTitle>
          <DialogDescription>
            确定要删除员工{" "}
            <span className="font-semibold">{employee?.name}</span> 吗？
            此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                删除中...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                确认删除
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
