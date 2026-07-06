"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ProgramData } from "@/lib/types"
import ToggleButton from "@/components/admin/ToggleButton"
import Navbar from "@/components/admin/Navbar"

export default function Dashboard() {
  const [programs, setPrograms] = useState<ProgramData[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchPrograms = useCallback(async () => {
    const res = await fetch("/api/programs")
    if (res.ok) {
      setPrograms(await res.json())
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  async function handleToggle(id: string, isActive: boolean) {
    const res = await fetch(`/api/programs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    })
    if (res.ok) {
      setPrograms((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive } : p))
      )
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este programa?")) return
    const res = await fetch(`/api/programs/${id}`, { method: "DELETE" })
    if (res.ok) {
      setPrograms((prev) => prev.filter((p) => p.id !== id))
    }
  }

  async function handleDuplicate(program: ProgramData) {
    const today = new Date().toISOString().split("T")[0]
    const res = await fetch("/api/programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: program.title,
        type: program.type,
        date: today,
        createdBy: program.createdBy,
        parts: program.parts.map((p) => ({
          title: p.title,
          description: p.description || "",
          time: p.time || "",
          responsible: p.responsible || "",
        })),
      }),
    })
    if (res.ok) {
      const created = await res.json()
      router.push(`/admin/programs/${created.id}/edit`)
    }
  }

  function formatDate(dateStr: string | Date) {
    const d = typeof dateStr === "string" ? dateStr : dateStr.toISOString().split("T")[0]
    return new Date(d + "T12:00:00").toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Lima",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar current="dashboard" />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Historial de programas
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/templates")}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              Plantillas
            </button>
          </div>
        </div>

        {programs.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No hay programas aún</p>
            <button
              onClick={() => router.push("/admin/programs/new")}
              className="mt-4 text-blue-600 hover:underline"
            >
              Crear el primer programa
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Título</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Tipo</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Fecha</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Creado por</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Visible</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr key={program.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{program.title}</td>
                    <td className="px-4 py-3 text-gray-600">{program.type.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(program.date)}</td>
                    <td className="px-4 py-3 text-gray-600">{program.createdBy}</td>
                    <td className="px-4 py-3">
                      <ToggleButton
                        isActive={program.isActive}
                        onChange={(active) => handleToggle(program.id, active)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => router.push(`/admin/programs/${program.id}/edit`)}
                          className="rounded bg-blue-50 px-3 py-1 text-xs text-blue-600 hover:bg-blue-100"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDuplicate(program)}
                          className="rounded bg-green-50 px-3 py-1 text-xs text-green-600 hover:bg-green-100"
                        >
                          Duplicar
                        </button>
                        <button
                          onClick={() => handleDelete(program.id)}
                          className="rounded bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
