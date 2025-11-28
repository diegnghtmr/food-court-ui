"use client"

import type React from "react"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrutalModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export function BrutalModal({ isOpen, onClose, title, children, className }: BrutalModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative bg-[#121212] border-2 border-violet-500 p-6 max-w-lg w-full mx-4",
          "shadow-[8px_8px_0px_0px_rgba(139,92,246,0.5)]",
          className,
        )}
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <h2 className="text-xl font-black uppercase text-violet-400">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
