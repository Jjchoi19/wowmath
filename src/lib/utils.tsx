import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Progress Icon Component
import { Star, Skull, Check, X, Minus } from "lucide-react";
import { ProgressStatus } from "@/src/types";

export function ProgressIcon({ status }: { status: ProgressStatus }) {
  switch (status) {
    case ProgressStatus.CORRECT_3_STAR:
      return (
        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white shadow-sm">
          <Star className="w-3.5 h-3.5 fill-current" />
        </div>
      );
    case ProgressStatus.CORRECT_2:
      return (
        <div className="w-6 h-6 bg-green-400 rounded flex items-center justify-center text-white shadow-sm">
          <Check className="w-3.5 h-3.5" />
        </div>
      );
    case ProgressStatus.CORRECT_1:
      return (
        <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center text-white shadow-sm">
          <Check className="w-3.5 h-3.5" />
        </div>
      );
    case ProgressStatus.WRONG_2_SKULL:
      return (
        <div className="w-6 h-6 bg-red-900 rounded flex items-center justify-center text-white shadow-sm">
          <Skull className="w-3.5 h-3.5" />
        </div>
      );
    case ProgressStatus.WRONG_1:
      return (
        <div className="w-6 h-6 bg-red-400 rounded flex items-center justify-center text-white shadow-sm">
          <X className="w-3.5 h-3.5" />
        </div>
      );
    default:
      return (
        <div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center text-slate-400">
          <Minus className="w-3.5 h-3.5" />
        </div>
      );
  }
}
