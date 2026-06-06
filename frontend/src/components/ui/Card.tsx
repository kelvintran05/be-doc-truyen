import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-[#FFFDFC] border border-[#4A3F35]/12 rounded-[28px] shadow-[0_8px_25px_rgba(74,63,53,0.04)] overflow-hidden",
        hover && "hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(74,63,53,0.08)] transition-all duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
