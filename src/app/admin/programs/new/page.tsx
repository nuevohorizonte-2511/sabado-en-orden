"use client"

import { useEffect, useState, useCallback } from "react"
import ProgramForm from "@/components/admin/ProgramForm"
import Navbar from "@/components/admin/Navbar"

interface Part {
  title: string
  description: string
  time: string
  responsible: string
}

interface Template {
  id: string
  name: string
  parts: string
  createdAt: string
}

const TYPE_PARTS: Record<string, Part[]> = {
  ESCUELA_SABATICA: [
    { title: "Bienvenida", description: "", time: "", responsible: "" },
    { title: "Alabanzas", description: "", time: "", responsible: "" },
    { title: "Lectura de la lección", description: "", time: "", responsible: "" },
    { title: "Testimonios", description: "", time: "", responsible: "" },
    { title: "Oración", description: "", time: "", responsible: "" },
    { title: "Cierre", description: "", time: "", responsible: "" },
  ],
  CULTO_DIVINO: [
    { title: "Bienvenida", description: "", time: "", responsible: "" },
    { title: "Alabanzas", description: "", time: "", responsible: "" },
    { title: "Ofrenda", description: "", time: "", responsible: "" },
    { title: "Sermón", description: "", time: "", responsible: "" },
    { title: "Llamado", description: "", time: "", responsible: "" },
    { title: "Oración final", description: "", time: "", responsible: "" },
  ],
  JA: [
    { title: "Bienvenida", description: "", time: "", responsible: "" },
    { title: "Dinámica", description: "", time: "", responsible: "" },
    { title: "Alabanzas", description: "", time: "", responsible: "" },
    { title: "Reflexión", description: "", time: "", responsible: "" },
    { title: "Anuncios", description: "", time: "", responsible: "" },
    { title: "Oración", description: "", time: "", responsible: "" },
  ],
}

export default function NewProgramPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedType, setSelectedType] = useState<string>("")
  const [customName, setCustomName] = useState("")
  const [customParts, setCustomParts] = useState<Part[] | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchTemplates = useCallback(async () => {
    const res = await fetch("/api/templates")
    if (res.ok) {
      setTemplates(await res.json())
    }
  }, [])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  function handleTypeSelect(type: string) {
    setSelectedType(type)
    setCustomName("")
    setCustomParts(null)
    setShowForm(true)
  }

  function handleTemplateSelect(template: Template) {
    const parts: Part[] = JSON.parse(template.parts)
    setSelectedType("CUSTOM")
    setCustomName(template.name)
    setCustomParts(parts)
    setShowForm(true)
  }

  function getTitle(): string {
    if (selectedType === "CUSTOM") return customName
    const labels: Record<string, string> = {
      ESCUELA_SABATICA: "Escuela Sabática",
      CULTO_DIVINO: "Culto Divino",
      JA: "JA",
    }
    return labels[selectedType] || selectedType
  }

  function getParts(): Part[] {
    if (customParts) return customParts
    return TYPE_PARTS[selectedType] || [{ title: "", description: "", time: "", responsible: "" }]
  }

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar current="new" />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <h2 className="mb-6 text-lg font-semibold text-gray-700">
            Selecciona el tipo de programa
          </h2>

          <h3 className="mb-3 text-sm font-medium text-gray-500 uppercase tracking-wide">
            Predefinidos
          </h3>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { value: "ESCUELA_SABATICA", label: "Escuela Sabática" },
              { value: "CULTO_DIVINO", label: "Culto Divino" },
              { value: "JA", label: "JA" },
            ].map((type) => (
              <button
                key={type.value}
                onClick={() => handleTypeSelect(type.value)}
                className="rounded-xl border-2 border-gray-200 bg-white p-6 text-left transition hover:border-blue-400 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-gray-800">{type.label}</h3>
                <p className="mt-1 text-sm text-gray-500">Plantilla con partes predefinidas</p>
              </button>
            ))}
          </div>

          {templates.length > 0 && (
            <>
              <h3 className="mb-3 text-sm font-medium text-gray-500 uppercase tracking-wide">
                Plantillas guardadas
              </h3>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="rounded-xl border-2 border-amber-200 bg-white p-6 text-left transition hover:border-amber-400 hover:shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{template.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {(() => {
                        try {
                          const parts: Part[] = JSON.parse(template.parts)
                          return `${parts.length} parte${parts.length !== 1 ? "s" : ""}`
                        } catch {
                          return "Plantilla personalizada"
                        }
                      })()}
                    </p>
                  </button>
                ))}
              </div>
            </>
          )}

          <h3 className="mb-3 text-sm font-medium text-gray-500 uppercase tracking-wide">
            Nuevo desde cero
          </h3>
          <button
            onClick={() => handleTypeSelect("CUSTOM")}
            className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 text-left transition hover:border-blue-400 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-800">Otro (personalizado)</h3>
            <p className="mt-1 text-sm text-gray-500">Crea un programa nuevo desde cero</p>
          </button>

          {selectedType === "CUSTOM" && (
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nombre del programa
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                placeholder="Ej: Día de la Madre"
              />
              <button
                onClick={() => customName.trim() && setShowForm(true)}
                disabled={!customName.trim()}
                className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar current="new" />
      <main className="px-4 py-8">
        <ProgramForm
          initialTitle={getTitle()}
          initialType={selectedType}
          initialDate={new Date().toISOString().split("T")[0]}
          initialParts={getParts()}
        />
      </main>
    </div>
  )
}
