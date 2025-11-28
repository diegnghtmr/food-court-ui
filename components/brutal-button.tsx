import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        "bg-violet-600 text-white border-violet-600 hover:bg-violet-500 shadow-[4px_4px_0px_0px_rgba(139,92,246,0.5)]",
      secondary: "bg-transparent text-violet-400 border-violet-500 hover:bg-violet-500 hover:text-black",
      danger: "bg-red-600 text-white border-red-600 hover:bg-red-500 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.5)]",
      success:
        "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.5)]",
      ghost: "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "font-bold uppercase tracking-wider border-2 transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

BrutalButton.displayName = "BrutalButton"
