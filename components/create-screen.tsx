"use client"

import { useState } from "react"
import type { RegenmonType } from "@/hooks/use-regenmon"
import { RegenmonSprite } from "@/components/regenmon-sprite"

const TYPES: { id: RegenmonType; label: string; desc: string }[] = [
  {
    id: "green",
    label: "Gota con Gorra",
    desc: "Gota de petroleo verde con gorra",
  },
  {
    id: "brown",
    label: "Gota Estudiosa",
    desc: "Gota de petroleo marron con lentes de estudio",
  },
  {
    id: "black",
    label: "Gota Cool",
    desc: "Gota de petroleo negra con lentes de sol",
  },
]

interface CreateScreenProps {
  onCreate: (name: string, type: RegenmonType) => void
  authenticated: boolean
  onLogin: () => void
}

export function CreateScreen({ onCreate, authenticated, onLogin }: CreateScreenProps) {
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
        <div className="nes-container is-dark with-title">
          <p className="title font-sans text-xs sm:text-sm">{"Crea tu Regenmon"}</p>

          {!authenticated && (
            <div className="mb-4 text-center">
              <button
                type="button"
                className="nes-btn is-warning font-sans text-[10px] sm:text-xs"
                onClick={onLogin}
              >
                {"🛢️ Iniciar Operaciones"}
              </button>
              <p className="font-sans text-[8px] mt-2" style={{ color: "hsl(0 0% 50%)" }}>
                {"Inicia sesión para guardar tu progreso"}
              </p>
            </div>
          )}

          {hatching ? (
            <div className="flex flex-col items-center gap-6 py-8">
              <span className="text-6xl sm:text-8xl animate-bounce-in" role="img" aria-label="Huevo eclosionando">
                {"🥚"}
              </span>
              <p className="font-sans text-xs sm:text-sm text-center animate-pulse" style={{ color: "#ff8c00" }}>
                {"Eclosionando..."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="regenmon-name" className="font-sans text-xs" style={{ color: "hsl(0 0% 88%)" }}>
                  {"Nombre (2-15 letras)"}
                </label>
                <input
                  id="regenmon-name"
                  type="text"
                  className="nes-input font-sans text-xs sm:text-sm"
                  placeholder="Escribe un nombre..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={15}
                  style={{ color: "hsl(0 0% 88%)", backgroundColor: "hsl(0 0% 12%)" }}
                />
                {name.length > 0 && !isNameValid && (
                  <p className="font-sans text-xs" style={{ color: "hsl(0 70% 55%)" }}>
                    {"El nombre debe tener entre 2 y 15 letras"}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <p className="font-sans text-xs" style={{ color: "hsl(0 0% 88%)" }}>
                  {"Elige tu tipo:"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id)}
                      className={`nes-container is-dark cursor-pointer transition-all duration-200 ${
                        selectedType === t.id
                          ? "border-white shadow-lg scale-105"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      style={{
                        borderColor: selectedType === t.id ? "#ff8c00" : undefined,
                      }}
                      aria-pressed={selectedType === t.id}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <RegenmonSprite type={t.id} size={80} />
                        <span className="font-sans text-[8px] sm:text-[10px] text-center leading-relaxed" style={{ color: "hsl(0 0% 88%)" }}>
                          {t.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={`nes-btn font-sans text-xs sm:text-sm w-full ${
                  canCreate ? "is-warning" : ""
                }`}
                disabled={!canCreate}
                onClick={handleCreate}
              >
                {"Eclosionar!"}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
