import { ProgramData } from "@/lib/types"

interface Props {
  program: ProgramData
}

const TYPE_GRADIENTS: Record<string, string> = {
  ESCUELA_SABATICA: "from-emerald-600 to-teal-700",
  CULTO_DIVINO: "from-blue-600 to-indigo-700",
  JA: "from-orange-500 to-rose-600",
}

export default function ProgramCard({ program }: Props) {
  const gradient = TYPE_GRADIENTS[program.type] || "from-purple-600 to-pink-700"

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
      <div className={`bg-gradient-to-r ${gradient} px-6 py-6 text-white`}>
        <h2 className="font-[family-name:var(--font-title)] text-3xl font-bold">
          {program.title}
        </h2>
        <p className="mt-1.5 text-sm opacity-90">
          {new Date(program.date + "T12:00:00").toLocaleDateString("es-PE", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "America/Lima",
          })}
        </p>
      </div>

      <div className="px-6 py-6">
        {program.parts.length === 0 ? (
          <p className="text-center text-sm text-gray-400">Sin partes registradas</p>
        ) : (
          <div className="space-y-1">
            {program.parts.map((part) => (
              <div
                key={part.id}
                className="flex items-center justify-between border-b border-gray-100 py-3"
              >
                <div className="flex-1">
                  <p className="text-lg font-semibold text-gray-900">
                    {part.title}
                  </p>
                  {part.description && (
                    <p className="mt-0.5 text-sm italic text-gray-500">
                      {part.description}
                    </p>
                  )}
                  {part.responsible && (
                    <p className="mt-0.5 text-sm text-gray-500">
                      {part.responsible}
                    </p>
                  )}
                </div>
                {part.time && (
                  <span className="ml-4 whitespace-nowrap rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-600">
                    {part.time}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">
          Programa creado por {program.createdBy}
        </p>
      </div>
    </div>
  )
}
