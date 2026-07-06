import { prisma } from "@/lib/prisma"
import ProgramCard from "@/components/guest/ProgramCard"

export const dynamic = "force-dynamic"

export default async function GuestPage() {
  const programs = await prisma.program.findMany({
    where: { isActive: true },
    include: { parts: { orderBy: { orderIndex: "asc" } } },
    orderBy: { date: "asc" },
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="font-[family-name:var(--font-title)] text-5xl font-bold text-white">
            Sábado en Orden
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Programas del día
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-600 p-12 text-center">
            <p className="text-lg text-gray-400">No hay programas disponibles</p>
            <p className="mt-2 text-sm text-gray-500">Vuelve pronto</p>
          </div>
        ) : (
          <div className="space-y-8">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Sábado en Orden
        </footer>
      </div>
    </div>
  )
}
