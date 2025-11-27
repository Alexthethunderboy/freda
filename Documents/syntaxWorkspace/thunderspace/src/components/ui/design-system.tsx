import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- ThunderButton ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline"
  size?: "sm" | "md" | "lg"
}

export const ThunderButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:opacity-90 border-transparent",
      secondary: "bg-secondary text-white hover:opacity-90",
      ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5",
      danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
      outline: "bg-transparent border border-border text-foreground hover:bg-black/5 dark:hover:bg-white/5",
    }
    
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
ThunderButton.displayName = "ThunderButton"

// --- ThunderCard ---
export const ThunderCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-none border border-border bg-card p-4 transition-all duration-200",
        className
      )}
      {...props}
    />
  )
)
ThunderCard.displayName = "ThunderCard"

// --- ThunderBadge ---
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "primary" | "secondary"
}

export const ThunderBadge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-transparent bg-primary text-primary-foreground",
      outline: "text-foreground border-border border",
      primary: "border-transparent bg-primary/10 text-primary",
      secondary: "border-transparent bg-secondary/10 text-secondary",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-mono tracking-tight",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
ThunderBadge.displayName = "ThunderBadge"
