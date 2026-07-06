"use client"

import { useRouter } from "next/navigation"
import QRDisplay from "./QRDisplay"

type NavSection = "dashboard" | "new" | "templates"

interface Props {
  current: NavSection
}

function navClass(section: NavSection, current: NavSection) {
  const base = "px-1 pb-1 text-sm transition-colors"
  if (section === current) {
    return `${base} border-b-2 border-blue-600 font-semibold text-blue-600`
  }
  return `${base} text-gray-500 hover:text-gray-800`
}

export default function Navbar({ current }: Props) {
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-gray-800">Sábado en Orden</h1>
        <nav className="hidden items-center gap-5 sm:flex">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className={navClass("dashboard", current)}
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/admin/programs/new")}
            className={navClass("new", current)}
          >
            + Nuevo programa
          </button>
          <button
            onClick={() => router.push("/admin/templates")}
            className={navClass("templates", current)}
          >
            Plantillas
          </button>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <QRDisplay />
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}
