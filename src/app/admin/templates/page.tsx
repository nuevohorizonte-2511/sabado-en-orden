"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/admin/Navbar"

interface Template {
  id: string
  name: string
  parts: string
  createdAt: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchTemplates = useCallback(async () => {
    const res = await fetch("/api/templates")
    if (res.ok) {
      setTemplates(await res.json())
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar la plantilla "${name}"?`)) return
    const res = await fetch(`/api/templates/${id}`, { method: "DELETE" })
    if (res.ok) {
      setTemplates((prev) => prev.filter((t) => t.id !== id))
    }
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
      <Navbar current="templates" />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          Plantillas guardadas
        </h2>

        {templates.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500">No hay plantillas guardadas</p>
            <p className="mt-2 text-sm text-gray-400">
              Al crear un programa, marca &quot;Guardar como plantilla&quot; para que aparezca aquí
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-600">Nombre</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Partes</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Creado</th>
                  <th className="px-4 py-3 font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((template) => {
                  const parts = JSON.parse(template.parts)
                  return (
                    <tr key={template.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{template.name}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {parts.map((p: { title: string }) => p.title).join(", ")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(template.createdAt).toLocaleDateString("es-PE")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(template.id, template.name)}
                            className="rounded bg-red-50 px-3 py-1 text-xs text-red-600 hover:bg-red-100"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
