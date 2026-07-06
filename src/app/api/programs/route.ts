import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const activeOnly = searchParams.get("active") === "true"

  const where = activeOnly ? { isActive: true } : {}

  const programs = await prisma.program.findMany({
    where,
    include: { parts: { orderBy: { orderIndex: "asc" } } },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(programs)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, type, date, createdBy, parts } = body

  if (!title || !type || !date || !createdBy) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  const program = await prisma.program.create({
    data: {
      title,
      type,
      date,
      createdBy,
      parts: {
        create: parts.map((part: { title: string; description?: string; time?: string; responsible?: string }, index: number) => ({
          title: part.title,
          description: part.description || null,
          time: part.time || null,
          responsible: part.responsible || null,
          orderIndex: index,
        })),
      },
    },
    include: { parts: { orderBy: { orderIndex: "asc" } } },
  })

  return NextResponse.json(program, { status: 201 })
}
