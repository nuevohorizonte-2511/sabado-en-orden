import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const program = await prisma.program.findUnique({
    where: { id },
    include: { parts: { orderBy: { orderIndex: "asc" } } },
  })

  if (!program) {
    return NextResponse.json({ error: "Programa no encontrado" }, { status: 404 })
  }

  return NextResponse.json(program)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if ("isActive" in body) {
    const program = await prisma.program.update({
      where: { id },
      data: { isActive: body.isActive },
    })
    return NextResponse.json(program)
  }

  if ("parts" in body) {
    await prisma.programPart.deleteMany({ where: { programId: id } })

    const program = await prisma.program.update({
      where: { id },
      data: {
        title: body.title,
        date: body.date,
        parts: {
          create: body.parts.map((part: { title: string; description?: string; time?: string; responsible?: string }, index: number) => ({
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

    return NextResponse.json(program)
  }

  return NextResponse.json({ error: "Campos inválidos" }, { status: 400 })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  await prisma.program.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
