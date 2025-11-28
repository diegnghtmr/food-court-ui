import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface BrutalSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string | number; label: string }[]
}

export const BrutalSelect = forwardRef<HTMLSelectElement, BrutalSelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-bold uppercase text-gray-400 mb-2 tracking-wider">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-[#1a1a1a] border-2 border-gray-700 text-gray-100 font-mono appearance-none",
              "focus:outline-none focus:border-violet-500 transition-colors",
              error && "border-red-500",
              className,
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
        </div>
        {error && <p className="mt-1 text-sm text-red-500 font-bold uppercase">{error}</p>}
      </div>
    )
  },
)

BrutalSelect.displayName = "BrutalSelect"
