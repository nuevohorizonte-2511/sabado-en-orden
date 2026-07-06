"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"

export default function QRDisplay() {
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [show, setShow] = useState(false)

  useEffect(() => {
    const url = `${window.location.origin}/guest`
    QRCode.toDataURL(url, { width: 200, margin: 2 })
      .then(setQrDataUrl)
  }, [])

  return (
    <>
      <button
        onClick={() => setShow(!show)}
        className="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
      >
        {show ? "Cerrar QR" : "Mostrar QR"}
      </button>

      {show && qrDataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl bg-white p-8 text-center shadow-2xl">
            <img src={qrDataUrl} alt="QR para invitados" className="mx-auto mb-4" />
            <p className="text-sm text-gray-600">
              Escanea para ver los programas activos
            </p>
            <a
              href={qrDataUrl}
              download="qr-invitados.png"
              className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Descargar QR
            </a>
            <button
              onClick={() => setShow(false)}
              className="mt-4 block w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
