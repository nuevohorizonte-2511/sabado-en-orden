"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ProgramForm from "@/components/admin/ProgramForm"
import Navbar from "@/components/admin/Navbar"
import { ProgramData } from "@/lib/types"

export default function EditProgramPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [program, setProgram] = useState<ProgramData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/programs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProgram(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500">Programa no encontrado</p>
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mt-4 text-blue-600 hover:underline"
        >
          Volver al dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar current="new" />
      <main className="px-4 py-8">
        <ProgramForm
          programId={program.id}
          initialTitle={program.title}
          initialType={program.type}
          initialDate={new Date(program.date).toISOString().split("T")[0]}
          initialParts={program.parts.map((p) => ({
            title: p.title,
            description: p.description || "",
            time: p.time || "",
            responsible: p.responsible || "",
          }))}
          createdBy={program.createdBy}
        />
      </main>
    </div>
  )
}
