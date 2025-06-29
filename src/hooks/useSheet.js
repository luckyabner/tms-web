"use client";
import { useState } from "react";

export function useSheet() {
  const [isOpen, setIsOpen] = useState(false);

  const openSheet = () => setIsOpen(true);
  const closeSheet = () => setIsOpen(false);
  const toggleSheet = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openSheet,
    closeSheet,
    toggleSheet,
    setIsOpen,
  };
}
