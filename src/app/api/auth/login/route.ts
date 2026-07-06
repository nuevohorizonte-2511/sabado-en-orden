import { NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { SessionData, sessionOptions, verifyPassword } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  session.isLoggedIn = true
  await session.save()

  return res
}
