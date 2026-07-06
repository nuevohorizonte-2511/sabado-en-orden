"use client"

interface Props {
  isActive: boolean
  onChange: (active: boolean) => void
}

export default function ToggleButton({ isActive, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!isActive)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        isActive ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isActive ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  )
}
