"use client"

import Link from "next/link"
import { ShieldX, ArrowLeft } from "lucide-react"
import { BrutalButton } from "@/components/brutal-button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-red-950 flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-lg text-center">
        <div className="bg-[#0a0a0a] border-4 border-red-600 p-12 shadow-[12px_12px_0px_0px_#dc2626]">
          <ShieldX className="h-24 w-24 text-red-500 mx-auto mb-6" />

          <h1 className="text-4xl font-black uppercase text-red-500 mb-4">ACCESO DENEGADO</h1>

          <p className="text-gray-400 font-bold uppercase mb-8">NO TIENES PERMISOS PARA ACCEDER A ESTA SECCIÓN</p>

          <div className="flex flex-col gap-4">
            <Link href="/login">
              <BrutalButton variant="danger" size="lg" className="w-full flex items-center justify-center gap-2">
                <ArrowLeft className="h-5 w-5" />
                VOLVER AL LOGIN
              </BrutalButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
