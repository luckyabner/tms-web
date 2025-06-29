"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Building2 } from "lucide-react";
import React, { useState } from "react";

export default function SheetFormButton({
  buttonLabel,
  children,
  renderForm,
  icon: Icon = Building2,
  sheetTitle,
  ...buttonProps
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleClose = () => setIsFormOpen(false);
  return (
    <>
      <Button
        onClick={() => {
          setIsFormOpen(true);
        }}
        {...buttonProps}
      >
        {buttonLabel}
      </Button>
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
              <Icon className="h-5 w-5" />
              {sheetTitle || buttonLabel}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 px-6">
            {renderForm ? renderForm(handleClose) : children}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
