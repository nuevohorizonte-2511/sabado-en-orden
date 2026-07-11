"use client"

import { useState } from "react"
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
  const [isOpen, setIsOpen] = useState(false)

  function goTo(path: string) {
    router.push(path)
    setIsOpen(false)
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <header className="relative border-b bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold text-gray-800 sm:text-xl">
            Sábado en Orden
          </h1>
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
        <div className="flex items-center gap-2 sm:gap-3">
          <QRDisplay />
          <button
            onClick={handleLogout}
            className="hidden text-sm text-gray-500 hover:text-gray-700 sm:inline"
          >
            Cerrar sesión
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center rounded p-1 text-gray-600 hover:bg-gray-100 sm:hidden"
            aria-label="Abrir menú"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="flex flex-col border-t px-4 pb-3 pt-2 sm:hidden">
          <button
            onClick={() => goTo("/admin/dashboard")}
            className={`rounded px-2 py-1.5 text-left text-sm ${
              current === "dashboard" ? "font-semibold text-blue-600" : "text-gray-600"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => goTo("/admin/programs/new")}
            className={`rounded px-2 py-1.5 text-left text-sm ${
              current === "new" ? "font-semibold text-blue-600" : "text-gray-600"
            }`}
          >
            + Nuevo programa
          </button>
          <button
            onClick={() => goTo("/admin/templates")}
            className={`rounded px-2 py-1.5 text-left text-sm ${
              current === "templates" ? "font-semibold text-blue-600" : "text-gray-600"
            }`}
          >
            Plantillas
          </button>
          <button
            onClick={handleLogout}
            className="mt-1 rounded px-2 py-1.5 text-left text-sm text-gray-500"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  )
}
