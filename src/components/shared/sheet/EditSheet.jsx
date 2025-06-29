"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Building2 } from "lucide-react";

export function EditSheet({
  isOpen,
  onOpenChange,
  title,
  icon: Icon = Building2,
  children,
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <Icon className="h-5 w-5" />
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 px-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
