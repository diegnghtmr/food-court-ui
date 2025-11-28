import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface BrutalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const BrutalInput = forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold uppercase text-gray-400 mb-2 tracking-wider">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-[#1a1a1a] border-2 border-gray-700 text-gray-100 font-mono",
            "placeholder:text-gray-600 placeholder:uppercase",
            "focus:outline-none focus:border-violet-500 transition-colors",
            error && "border-red-500",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500 font-bold uppercase">{error}</p>}
      </div>
    )
  },
)

BrutalInput.displayName = "BrutalInput"
