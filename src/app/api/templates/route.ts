import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const templates = await prisma.customTemplate.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(templates)
}

export async function POST(req: NextRequest) {
  const { name, parts } = await req.json()

  if (!name || !parts) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  const existing = await prisma.customTemplate.findUnique({ where: { name } })

  if (existing) {
    const template = await prisma.customTemplate.update({
      where: { name },
      data: { parts: JSON.stringify(parts) },
    })
    return NextResponse.json(template)
  }

  const template = await prisma.customTemplate.create({
    data: {
      name,
      parts: JSON.stringify(parts),
    },
  })

  return NextResponse.json(template, { status: 201 })
}
