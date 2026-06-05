import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold font-fredoka text-surface-base"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            id={inputId}
            ref={ref}
            className={cn(
              "w-full px-space-3 py-space-2 text-base font-sans bg-surface-strong border-2 border-border-default rounded-radius-xs placeholder:text-text-tertiary outline-none transition-all duration-instant shadow-[inset_1px_1px_0px_rgba(0,0,0,0.1)]",
              "hover:border-surface-base focus:border-surface-base focus:ring-4 focus:ring-focus-ring focus:shadow-shadow-1",
              "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
              error && "border-[#EF4444] focus:ring-[#EF4444]/30 focus:border-[#EF4444]",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <span className="text-sm font-medium text-[#EF4444]" role="alert">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-xs text-text-secondary">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
