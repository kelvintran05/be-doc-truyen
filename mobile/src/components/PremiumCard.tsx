import React from "react";
import { View, ViewProps, useColorScheme } from "react-native";
import { cn } from "../core/utils/cn"; // If cn helper doesn't exist, we'll write a simple fallback

interface PremiumCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // Optional custom glow color
}

export function PremiumCard({ children, className, glowColor, ...props }: PremiumCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View
      className={cn(
        "rounded-[32px] p-5 mb-5 shadow-xl border-2",
        isDark 
          ? "bg-slate-900/80 border-slate-800 shadow-black/45" 
          : "bg-white/90 border-[#F3E8FF] shadow-violet-100",
        className
      )}
      style={
        glowColor && !isDark
          ? {
              shadowColor: glowColor,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 8,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </View>
  );
}
