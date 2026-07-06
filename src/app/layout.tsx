import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"

const fontTitle = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-title",
})

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Sábado en Orden",
  description: "Programas de Escuela Sabática, Culto Divino y más",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${fontTitle.variable} ${fontBody.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased">{children}</body>
    </html>
  )
}
