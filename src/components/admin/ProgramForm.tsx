"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Part {
  title: string
  description: string
  time: string
  responsible: string
}

interface Props {
  initialTitle?: string
  initialType?: string
  initialDate?: string
  initialParts?: Part[]
  createdBy?: string
  programId?: string
}

const EMPTY_PART: Part = { title: "", description: "", time: "", responsible: "" }

export default function ProgramForm({
  initialTitle = "",
  initialType = "",
  initialDate = "",
  initialParts = [{ title: "Bienvenida", description: "", time: "", responsible: "" }],
  createdBy = "",
  programId,
}: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [type, setType] = useState(initialType)
  const [date, setDate] = useState(initialDate)
  const [creatorName, setCreatorName] = useState(createdBy)
  const [parts, setParts] = useState<Part[]>(initialParts)
  const [saveAsTemplate, setSaveAsTemplate] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  function addPart() {
    setParts([...parts, { ...EMPTY_PART }])
  }

  function removePart(index: number) {
    if (parts.length <= 1) return
    setParts(parts.filter((_, i) => i !== index))
  }

  function moveUp(index: number) {
    if (index === 0) return
    const updated = [...parts]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    setParts(updated)
  }

  function moveDown(index: number) {
    if (index === parts.length - 1) return
    const updated = [...parts]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    setParts(updated)
  }

  function updatePart(index: number, field: keyof Part, value: string) {
    const updated = [...parts]
    updated[index] = { ...updated[index], [field]: value }
    setParts(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)

    if (!title || !date || !creatorName) {
      setError("Título, fecha y nombre del creador son obligatorios")
      setSaving(false)
      return
    }

    const filteredParts = parts.filter((p) => p.title.trim())

    const body = {
      title,
      type,
      date,
      createdBy: creatorName,
      parts: filteredParts,
    }

    const url = programId ? `/api/programs/${programId}` : "/api/programs"
    const method = programId ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Error al guardar")
      setSaving(false)
      return
    }

    if (saveAsTemplate) {
      const templateName = type === "CUSTOM" ? title : type
      await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: templateName,
          parts: filteredParts,
        }),
      })
    }

    router.push("/admin/dashboard")
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Título del programa</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Ej: Escuela Sabática"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tu nombre</label>
          <input
            type="text"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Ej: Juan Pérez"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Tipo</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            placeholder="Ej: ESCUELA_SABATICA"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Partes del programa</label>
          <button
            type="button"
            onClick={addPart}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
          >
            + Agregar parte
          </button>
        </div>

        <div className="space-y-3">
          {parts.map((part, index) => (
            <div
              key={index}
              className="flex flex-wrap items-end gap-2 rounded-lg border bg-gray-50 p-3"
            >
              <div className="min-w-[150px] flex-[2]">
                <label className="mb-1 block text-xs text-gray-500">Parte</label>
                <input
                  type="text"
                  value={part.title}
                  onChange={(e) => updatePart(index, "title", e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Ej: Himno inicial"
                />
              </div>
              <div className="min-w-[150px] flex-[2]">
                <label className="mb-1 block text-xs text-gray-500">Descripción</label>
                <input
                  type="text"
                  value={part.description}
                  onChange={(e) => updatePart(index, "description", e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Ej: Santa Cena"
                />
              </div>
              <div className="min-w-[100px] flex-1">
                <label className="mb-1 block text-xs text-gray-500">Horario</label>
                <input
                  type="time"
                  value={part.time}
                  onChange={(e) => updatePart(index, "time", e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="min-w-[130px] flex-1">
                <label className="mb-1 block text-xs text-gray-500">Responsable</label>
                <input
                  type="text"
                  value={part.responsible}
                  onChange={(e) => updatePart(index, "responsible", e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Ej: María García"
                />
              </div>
              <div className="flex items-end gap-1 pb-0.5">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="rounded bg-gray-200 px-2 py-2 text-xs hover:bg-gray-300 disabled:opacity-30"
                  title="Subir"
                >
                  ⬆
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === parts.length - 1}
                  className="rounded bg-gray-200 px-2 py-2 text-xs hover:bg-gray-300 disabled:opacity-30"
                  title="Bajar"
                >
                  ⬇
                </button>
                <button
                  type="button"
                  onClick={() => removePart(index)}
                  disabled={parts.length <= 1}
                  className="rounded bg-red-500 px-2.5 py-2 text-xs text-white hover:bg-red-600 disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-100">
        <input
          type="checkbox"
          checked={saveAsTemplate}
          onChange={(e) => setSaveAsTemplate(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        Guardar como plantilla para futuros programas
      </label>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Guardando..." : programId ? "Actualizar programa" : "Crear programa"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-200"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
