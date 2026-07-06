export interface ProgramPartData {
  id?: string
  title: string
  description?: string | null
  programId?: string
  time: string | null
  responsible: string | null
  orderIndex: number
}

export interface ProgramData {
  id: string
  title: string
  type: string
  date: string | Date
  isActive: boolean
  createdBy: string
  createdAt: string | Date
  updatedAt: string | Date
  parts: ProgramPartData[]
}

export type ProgramType = "ESCUELA_SABATICA" | "CULTO_DIVINO" | "JA" | "CUSTOM"

export const PROGRAM_TYPES: { value: ProgramType; label: string }[] = [
  { value: "ESCUELA_SABATICA", label: "Escuela Sabática" },
  { value: "CULTO_DIVINO", label: "Culto Divino" },
  { value: "JA", label: "JA" },
  { value: "CUSTOM", label: "Otro (personalizado)" },
]
