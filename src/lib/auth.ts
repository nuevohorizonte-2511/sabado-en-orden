import { getIronSession, SessionOptions } from "iron-session"
import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export interface SessionData {
  isLoggedIn?: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || "una-clave-secreta-muy-larga-para-firmar-cookies",
  cookieName: "sabado-en-orden-session",
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export function verifyPassword(password: string): boolean {
  return password === process.env.ADMIN_PASSWORD
}
