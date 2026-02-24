"use client"

import { useState, useRef } from "react"

const CATEGORIES = [
  { id: "yacimientos", emoji: "📂", name: "Yacimientos", color: "#3b82f6", desc: "Cálculos de reservas, porosidad, permeabilidad o gráficas de declinación" },
  { id: "produccion", emoji: "⚙️", name: "Producción", color: "#22c55e", desc: "Simulaciones de levantamiento artificial (BCP, Gas Lift), análisis de nodos o cartas dinamométricas" },
  { id: "refinacion", emoji: "🧪", name: "Refinación/Química", color: "#a855f7", desc: "Procesos de destilación, análisis de crudo, clasificación API o mezclas" },
  { id: "gestion", emoji: "📊", name: "Gestión de Proyectos", color: "#f59e0b", desc: "Diagramas de Gantt de perforación, hojas de costos o análisis de riesgo petrolero" },
]

interface TrainingScreenProps {
  onComplete: (xp: number, oil: number) => void
  onClose: () => void
}

export function TrainingScreen({ onComplete, onClose }: TrainingScreenProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [imageData, setImageData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null)
  const [rewarded, setRewarded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImageData(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit() {
    if (!selected || !imageData) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/demo/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, category: selected }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ score: 65, feedback: "Error de conexión. Puntuación estimada asignada." })
    } finally {
      setLoading(false)
    }
  }

  function handleClaim() {
    if (!result || rewarded) return
    const xp = Math.floor(result.score / 2)
    const oil = result.score >= 70 ? Math.floor(5 + ((result.score - 70) / 30) * 10) : 0
    onComplete(xp, oil)
    setRewarded(true)
  }

  function scoreColor(s: number) {
    if (s > 70) return "#22c55e"
    if (s >= 50) return "#ff8c00"
    return "#ff4444"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: "#0a0a0a", border: "4px solid #ff8c00" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "3px solid #ff8c00" }}>
          <span className="font-sans text-xs font-bold" style={{ color: "#ff8c00" }}>📋 Certificación Técnica</span>
          <button type="button" onClick={onClose} className="font-sans text-xs px-2 py-1" style={{ color: "#ff4444", border: "2px solid #ff4444", backgroundColor: "transparent" }}>✕</button>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Category Selection */}
          {!result && (
            <>
              <p className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#999" }}>Selecciona la categoría de tu reporte técnico:</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => { setSelected(cat.id); setImageData(null); if (fileRef.current) fileRef.current.value = "" }}
                    className="flex flex-col items-center gap-1 p-3 text-left transition-all"
                    style={{
                      backgroundColor: selected === cat.id ? "#1a1a1a" : "#111",
                      border: `3px solid ${selected === cat.id ? cat.color : "#333"}`,
                      cursor: "pointer",
                    }}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="font-sans text-[9px] font-bold" style={{ color: cat.color }}>{cat.name}</span>
                    <span className="font-sans text-[7px] text-center" style={{ color: "#777" }}>{cat.desc}</span>
                  </button>
                ))}
              </div>

              {/* Upload */}
              {selected && (
                <div className="flex flex-col gap-2">
                  <p className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#999" }}>Sube foto/screenshot de tu evidencia:</p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="font-sans text-[8px]"
                    style={{ color: "#999" }}
                  />
                  {imageData && (
                    <div style={{ border: "2px solid #333", padding: "4px" }}>
                      <img src={imageData} alt="preview" className="w-full max-h-40 object-contain" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!imageData || loading}
                    className="font-sans text-[10px] py-2 px-4 w-full"
                    style={{
                      backgroundColor: loading ? "#333" : "#0a0a0a",
                      color: "#ff8c00",
                      border: "3px solid #ff8c00",
                      opacity: !imageData || loading ? 0.4 : 1,
                      cursor: !imageData || loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "⏳ Evaluando reporte..." : "🛢️ Enviar a Evaluación"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Results */}
          {result && (
            <div className="flex flex-col items-center gap-4">
              <p className="font-sans text-[10px] font-bold" style={{ color: "#ff8c00" }}>Resultado de Evaluación</p>
              <div className="text-center">
                <span className="font-sans text-4xl font-bold" style={{ color: scoreColor(result.score) }}>{result.score}</span>
                <span className="font-sans text-xs" style={{ color: "#666" }}>/100</span>
              </div>
              <p className="font-sans text-[9px] text-center leading-relaxed px-2" style={{ color: "#ccc" }}>{result.feedback}</p>

              <div className="flex gap-4 font-sans text-[9px]">
                <span style={{ color: "#999" }}>XP: <span style={{ color: "#22c55e" }}>+{Math.floor(result.score / 2)}</span></span>
                <span style={{ color: "#999" }}>$OIL: <span style={{ color: result.score >= 70 ? "#ff8c00" : "#666" }}>{result.score >= 70 ? `+${Math.floor(5 + ((result.score - 70) / 30) * 10)}` : "+0"}</span></span>
              </div>

              {!rewarded ? (
                <button
                  type="button"
                  onClick={handleClaim}
                  className="font-sans text-[10px] py-2 px-6"
                  style={{ backgroundColor: "#0a0a0a", color: "#22c55e", border: "3px solid #22c55e", cursor: "pointer" }}
                >
                  ✅ Reclamar Recompensa
                </button>
              ) : (
                <p className="font-sans text-[9px]" style={{ color: "#22c55e" }}>✅ Recompensa reclamada</p>
              )}

              <button
                type="button"
                onClick={() => { setResult(null); setSelected(null); setImageData(null); setRewarded(false) }}
                className="font-sans text-[8px] py-1 px-4"
                style={{ color: "#666", border: "2px solid #333", backgroundColor: "transparent", cursor: "pointer" }}
              >
                Nueva Certificación
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
