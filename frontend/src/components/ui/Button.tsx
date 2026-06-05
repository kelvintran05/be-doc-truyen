import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "ghost";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base Neobrutalist button style
          "inline-flex items-center justify-center font-bold font-fredoka border-2 border-border-default rounded-radius-xs bg-surface-muted transition-all duration-instant outline-none shadow-shadow-2",
          "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#334155] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#334155]",
          "focus-visible:ring-4 focus-visible:ring-focus-ring focus-visible:outline-none",
          "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none",
          "px-space-4 py-space-2 min-h-[48px] select-none text-base cursor-pointer",
          
          // Variants
          variant === "primary" && "bg-[#7C3AED] text-white hover:bg-[#6D28D9]", // Violet
          variant === "secondary" && "bg-surface-muted text-surface-base hover:bg-surface-strong", // White
          variant === "accent" && "bg-[#FCD34D] text-surface-base hover:bg-[#FBBF24]", // Yellow
          variant === "danger" && "bg-[#EF4444] text-white hover:bg-[#DC2626]", // Red
          variant === "ghost" && "border-transparent bg-transparent shadow-none hover:bg-surface-strong hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0 hover:shadow-none",
          
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
