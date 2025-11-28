import type React from "react"
import { cn } from "@/lib/utils"

interface BrutalCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function BrutalCard({ children, className, hover = false }: BrutalCardProps) {
  return (
    <div
      className={cn(
        "bg-[#121212] border-2 border-gray-800 p-6",
        hover &&
          "hover:border-violet-500 hover:shadow-[4px_4px_0px_0px_rgba(139,92,246,0.3)] transition-all cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  )
}
