import * as React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { cn } from "@/lib/utils";

export interface LinkProps extends NextLinkProps, Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> {
  className?: string;
  children: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, children, ...props }, ref) => {
    return (
      <NextLink
        href={href}
        ref={ref}
        className={cn(
          "font-semibold font-quicksand text-text-secondary decoration-border-default underline underline-offset-4 decoration-2 transition-all duration-instant outline-none rounded-sm",
          "hover:text-surface-base hover:decoration-3 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";
