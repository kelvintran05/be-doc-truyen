import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "pink" | "green" | "amber";
  className?: string;
  style?: React.CSSProperties;
}

const variants = {
  default: "bg-white/90 border border-[#4A3F35]/12 text-text-secondary",
  pink: "bg-[#FFB7C5] text-[#383029] shadow-[0_4px_12px_rgba(229,91,91,0.22)]",
  green: "bg-[#8FA781] text-white shadow-[0_4px_12px_rgba(143,167,129,0.25)]",
  amber: "bg-amber-100 text-amber-800 border border-amber-300",
};

export function Badge({ children, variant = "default", className, style }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase",
        variants[variant],
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
