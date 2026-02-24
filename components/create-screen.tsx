"use client"

import { useState } from "react"
import type { RegenmonType } from "@/hooks/use-regenmon"
import { RegenmonSprite } from "@/components/regenmon-sprite"

const TYPES: { id: RegenmonType; label: string; desc: string }[] = [
  {
    id: "green",
    label: "Crudo Ligero",
    desc: "Gota de petroleo verde con gorra",
  },
  {
    id: "brown",
    label: "Crudo Mediano",
    desc: "Gota de petroleo marron con lentes de estudio",
  },
  {
    id: "black",
    label: "Crudo Pesado",
    desc: "Gota de petroleo negra con lentes de sol",
  },
]

interface CreateScreenProps {
  onCreate: (name: string, type: RegenmonType) => void
}

export function CreateScreen({ onCreate }: CreateScreenProps) {
  const [name, setName] = useState("")
  const [selectedType, setSelectedType] = useState<RegenmonType | null>(null)
  const [hatching, setHatching] = useState(false)

  const isNameValid = name.trim().length >= 2 && name.trim().length <= 15
  const canCreate = isNameValid && selectedType !== null

  function handleCreate() {
    if (!canCreate || !selectedType) return
    setHatching(true)
    setTimeout(() => {
      onCreate(name.trim(), selectedType)
    }, 1000)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="w-full max-w-lg">
        <div
          className="flex flex-col gap-6 px-6 py-6"
          style={{ backgroundColor: "#111111", border: "2px solid #ff8c00" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{"🛢️"}</span>
            <p className="font-sans text-xs sm:text-sm font-bold" style={{ color: "#ff8c00" }}>
              {"Comisionar Nuevo Activo"}
            </p>
          </div>

          {hatching ? (
            <div className="flex flex-col items-center gap-6 py-8">
              <span className="text-6xl sm:text-8xl animate-bounce-in" role="img" aria-label="Activo en construccion">
                {"🛢️"}
              </span>
              <p className="font-sans text-xs sm:text-sm text-center animate-pulse" style={{ color: "#00cc44" }}>
                {"Perforacion inicial en curso..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Name Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="regenmon-name" className="font-sans text-[10px]" style={{ color: "#888" }}>
                  {"Designacion del Activo (2-15 caracteres)"}
                </label>
                <input
                  id="regenmon-name"
                  type="text"
                  className="font-sans text-xs px-3 py-2 outline-none"
                  placeholder="Nombre del Regenmon..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={15}
                  style={{
                    color: "#ddd",
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                  }}
                />
                {name.length > 0 && !isNameValid && (
                  <p className="font-sans text-[9px]" style={{ color: "#ff4444" }}>
                    {"Designacion debe tener entre 2 y 15 caracteres"}
                  </p>
                )}
              </div>

              {/* Type Selection */}
              <div className="flex flex-col gap-3">
                <p className="font-sans text-[10px]" style={{ color: "#888" }}>
                  {"Seleccionar Grado API:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id)}
                      className="flex flex-col items-center gap-2 py-4 px-3 transition-all duration-200"
                      style={{
                        backgroundColor: selectedType === t.id ? "#1a2a0a" : "#1a1a1a",
                        border: `1px solid ${selectedType === t.id ? "#ff8c00" : "#333"}`,
                        cursor: "pointer",
                        opacity: selectedType && selectedType !== t.id ? 0.5 : 1,
                      }}
                      aria-pressed={selectedType === t.id}
                    >
                      <RegenmonSprite type={t.id} size={80} />
                      <span className="font-sans text-[8px] sm:text-[10px] text-center leading-relaxed" style={{ color: selectedType === t.id ? "#ff8c00" : "#888" }}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Create Button */}
              <button
                type="button"
                className="font-sans text-xs sm:text-sm w-full py-3 font-bold transition-opacity"
                disabled={!canCreate}
                onClick={handleCreate}
                style={{
                  backgroundColor: canCreate ? "#ff8c00" : "#1a1a1a",
                  border: `1px solid ${canCreate ? "#cc7000" : "#333"}`,
                  color: canCreate ? "#0a0a0a" : "#555",
                  cursor: canCreate ? "pointer" : "not-allowed",
                  opacity: canCreate ? 1 : 0.5,
                }}
              >
                {"Iniciar Produccion"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
