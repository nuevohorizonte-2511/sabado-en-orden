import { NextRequest, NextResponse } from "next/server"
import { getIronSession } from "iron-session"
import { SessionData, sessionOptions } from "./lib/auth"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next()

    const res = NextResponse.next()
    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
