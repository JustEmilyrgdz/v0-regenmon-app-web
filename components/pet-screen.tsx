"use client"

import { useState } from "react"
import type { RegenmonData } from "@/hooks/use-regenmon"
import { RegenmonSprite } from "@/components/regenmon-sprite"
import { RegenmonChat } from "@/components/regenmon-chat"
import { TrainingScreen } from "@/components/training-screen"

const TYPE_CONFIG = {
  green: {
    bg: "from-emerald-900 to-emerald-700",
    border: "#ff8c00",
    label: "Gota con Gorra",
  },
  brown: {
    bg: "from-amber-900 to-amber-700",
    border: "#ff8c00",
    label: "Gota Estudiosa",
  },
  black: {
    bg: "from-neutral-900 to-neutral-700",
    border: "#ff8c00",
    label: "Gota Cool",
  },
}

interface PetScreenProps {
  regenmon: RegenmonData
  cooldown: boolean
  celebrating: boolean
  oilFloats: Array<{ id: number; text: string; color: string }>
  authenticated: boolean
  userEmail: string | null
  onLogin: () => void
  onLogout: () => void
  onFeed: () => void
  onPlay: () => void
  onTrain: () => void
  onReset: () => void
  onStatChange: (delta: number) => void
  onInjectMaintenance: () => boolean
  onEarnOilFromChat: () => void
  onShowOilFloat: (text: string, color: string) => void
  onCertify: (xp: number, oil: number) => void
}

export function PetScreen({
  regenmon,
  cooldown,
  celebrating,
  oilFloats,
  authenticated,
  userEmail,
  onLogin,
  onLogout,
  onFeed,
  onPlay,
  onTrain,
  onReset,
  onStatChange,
  onInjectMaintenance,
  onEarnOilFromChat,
  onShowOilFloat,
  onCertify,
}: PetScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showTraining, setShowTraining] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const [maintenanceError, setMaintenanceError] = useState(false)
  const config = TYPE_CONFIG[regenmon.type]
  const isHungry = (regenmon.hunger ?? 100) <= 20
  const isSad = regenmon.happiness === 0 || (regenmon.hunger ?? 100) === 0
  const xpPercent = regenmon.xp
  const happinessPercent = regenmon.happiness

  function handleReset() {
    setShowConfirm(true)
  }

  function confirmReset() {
    setShowConfirm(false)
    onReset()
  }

  function handleMaintenance() {
    const success = onInjectMaintenance()
    if (!success) {
      setMaintenanceError(true)
      setTimeout(() => setMaintenanceError(false), 2000)
    }
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-2 px-3 py-2" style={{ backgroundColor: "#0a0a0a", borderBottom: "3px solid #ff8c00" }}>
        <h1 className="font-sans text-xs sm:text-sm flex items-center gap-2" style={{ color: "#ff8c00" }}>
          <RegenmonSprite type={regenmon.type} size={28} />
          <span>{"Regenmon"}</span>
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans text-[8px] sm:text-[10px] px-2 py-1" style={{ backgroundColor: "#111", color: "#ff8c00", border: "2px solid #ff8c00" }}>
            {authenticated ? `🛢️ ${regenmon.oil ?? 0} $OIL` : "🛢️ — $OIL"}
          </span>
          <span className="font-sans text-[8px] sm:text-[10px] px-2 py-1" style={{ backgroundColor: "#111", color: "#22c55e", border: "2px solid #22c55e" }}>
            {"Nv."}{regenmon.level}
          </span>
          {authenticated && userEmail && (
            <span className="font-sans text-[8px] sm:text-[10px] truncate max-w-[120px]" style={{ color: "hsl(0 0% 60%)" }}>
              {userEmail}
            </span>
          )}
          {authenticated ? (
            <button
              type="button"
              className="nes-btn font-sans text-[8px] sm:text-[10px]"
              onClick={onLogout}
              style={{ padding: "2px 8px" }}
            >
              {"Salir"}
            </button>
          ) : (
            <button
              type="button"
              className="nes-btn is-warning font-sans text-[8px] sm:text-[10px]"
              onClick={onLogin}
              style={{ padding: "2px 8px" }}
            >
              {"Iniciar Operaciones"}
            </button>
          )}
          <button
            type="button"
            className="nes-btn is-error font-sans text-[8px] sm:text-[10px]"
            onClick={handleReset}
            style={{ padding: "2px 8px" }}
          >
            {"Reiniciar"}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center gap-4 p-4">
        {/* Pet Display Card */}
        <div className="w-full max-w-md">
          <div
            className="flex flex-col items-center gap-4 py-6 px-4"
            style={{ border: "4px solid #ff8c00", backgroundColor: "#111" }}
          >
            <p className="font-sans text-sm sm:text-base text-center" style={{ color: "#ff8c00" }}>
              {regenmon.name}
            </p>

            <div
              className={`transition-all duration-300 ${
                celebrating
                  ? "animate-celebrate"
                  : isSad
                  ? "grayscale"
                  : "animate-float"
              }`}
            >
              <RegenmonSprite type={regenmon.type} size={176} />
            </div>

            {isSad && (
              <p className="font-sans text-[10px] animate-pulse" style={{ color: "#ff4444" }}>
                {"Tu Regenmon esta triste..."}
              </p>
            )}
            {isHungry && !isSad && (
              <p className="font-sans text-[10px] animate-pulse" style={{ color: "#ff8c00" }}>
                {"Tu Regenmon necesita mantenimiento!"}
              </p>
            )}

            <p className="font-sans text-[8px] sm:text-[10px]" style={{ color: "hsl(0 0% 50%)" }}>
              {"Comisionado: "}{new Date(regenmon.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-md flex flex-col gap-3">
          {/* Estabilidad Operativa (was Happiness) — GREEN */}
          <div style={{ border: "3px solid #333", backgroundColor: "#111", padding: "10px 14px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#22c55e" }}>
                {"Estabilidad Operativa"}
              </span>
              <span className="font-sans text-[8px] sm:text-[10px] font-bold" style={{ color: "#22c55e" }}>
                {happinessPercent}{"/100"}
              </span>
            </div>
            <div style={{ width: "100%", height: "12px", backgroundColor: "#222", border: "2px solid #333" }}>
              <div style={{ width: `${happinessPercent}%`, height: "100%", backgroundColor: "#22c55e", transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Nivel de Presión (was Hunger) — ORANGE */}
          <div style={{ border: "3px solid #333", backgroundColor: "#111", padding: "10px 14px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#ff8c00" }}>
                {"Nivel de Presion"}
              </span>
              <span className="font-sans text-[8px] sm:text-[10px] font-bold" style={{ color: "#ff8c00" }}>
                {regenmon.hunger ?? 100}{"/100"}
              </span>
            </div>
            <div style={{ width: "100%", height: "12px", backgroundColor: "#222", border: "2px solid #333" }}>
              <div style={{ width: `${regenmon.hunger ?? 100}%`, height: "100%", backgroundColor: "#ff8c00", transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Rendimiento del Pozo (XP) — GRAY */}
          <div style={{ border: "3px solid #333", backgroundColor: "#111", padding: "10px 14px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#999" }}>
                {"Rendimiento del Pozo (XP)"}
              </span>
              <span className="font-sans text-[8px] sm:text-[10px] font-bold" style={{ color: "#999" }}>
                {regenmon.xp}{"/100"}
              </span>
            </div>
            <div style={{ width: "100%", height: "12px", backgroundColor: "#222", border: "2px solid #333" }}>
              <div style={{ width: `${xpPercent}%`, height: "100%", backgroundColor: "#888", transition: "width 0.3s" }} />
            </div>
          </div>
        </div>

        {/* Action Buttons — 3 columns */}
        <div className="w-full max-w-md grid grid-cols-3 gap-3">
          {/* Inyectar Aditivos — GREEN */}
          <div className="relative">
            <button
              type="button"
              className="w-full font-sans text-[8px] sm:text-[10px] py-3 px-2 flex flex-col items-center gap-2"
              disabled={cooldown}
              onClick={handleMaintenance}
              style={{
                backgroundColor: "#0a0a0a",
                color: "#22c55e",
                border: "3px solid #22c55e",
                opacity: cooldown ? 0.4 : 1,
                cursor: cooldown ? "not-allowed" : "pointer",
              }}
            >
              <span className="text-xl">{"🧴"}</span>
              <span>{"Inyectar"}</span>
              <span>{"Aditivos"}</span>
              <span className="text-[7px]" style={{ color: "#ff8c00" }}>{"(10 🛢️)"}</span>
            </button>
            {maintenanceError && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-[8px] font-sans z-50" style={{ backgroundColor: "#ff4444", color: "#fff", border: "2px solid #ff0000" }}>
                {"Fondos insuficientes!"}
              </div>
            )}
          </div>

          {/* Inspección de Campo — BLUE/CYAN */}
          <button
            type="button"
            className="w-full font-sans text-[8px] sm:text-[10px] py-3 px-2 flex flex-col items-center gap-2"
            disabled={cooldown}
            onClick={onPlay}
            style={{
              backgroundColor: "#0a0a0a",
              color: "#00bcd4",
              border: "3px solid #00bcd4",
              opacity: cooldown ? 0.4 : 1,
              cursor: cooldown ? "not-allowed" : "pointer",
            }}
          >
            <span className="text-xl">{"🔍"}</span>
            <span>{"Inspeccion"}</span>
            <span>{"de Campo"}</span>
          </button>

          {/* Perforación Exploratoria — ORANGE/PURPLE */}
          <button
            type="button"
            className="w-full font-sans text-[8px] sm:text-[10px] py-3 px-2 flex flex-col items-center gap-2"
            disabled={cooldown}
            onClick={onTrain}
            style={{
              backgroundColor: "#0a0a0a",
              color: "#ff8c00",
              border: "3px solid #8b5cf6",
              opacity: cooldown ? 0.4 : 1,
              cursor: cooldown ? "not-allowed" : "pointer",
            }}
          >
            <span className="text-xl">{"⛏️"}</span>
            <span>{"Perforacion"}</span>
            <span>{"Exploratoria"}</span>
          </button>
        </div>

        {/* Certificación Técnica Button */}
        <div className="w-full max-w-md">
          <button
            type="button"
            className="w-full font-sans text-[8px] sm:text-[10px] py-3 px-4 flex items-center justify-center gap-2"
            onClick={() => setShowTraining(true)}
            style={{
              backgroundColor: "#0a0a0a",
              color: "#ff8c00",
              border: "3px solid #ff8c00",
              cursor: "pointer",
            }}
          >
            <span className="text-base">📋</span>
            <span>Certificación Técnica</span>
          </button>
        </div>

        {cooldown && (
          <p className="font-sans text-[8px] sm:text-[10px] animate-pulse" style={{ color: "#ff8c00" }}>
            {"Esperando cooldown..."}
          </p>
        )}

        {/* Operation Log */}
        {regenmon.operationLog && regenmon.operationLog.length > 0 && (
          <div className="w-full max-w-md">
            <button
              type="button"
              className="font-sans text-[8px] sm:text-[10px] w-full text-left px-3 py-2"
              style={{ color: "#ff8c00", backgroundColor: "#111", border: "3px solid #333" }}
              onClick={() => setShowLog(!showLog)}
            >
              {showLog ? "▼" : "▶"} {"Registro de Operaciones ("}{regenmon.operationLog.length}{")"}
            </button>
            {showLog && (
              <div style={{ padding: "8px 12px", maxHeight: "150px", overflowY: "auto", backgroundColor: "#111", border: "3px solid #333", borderTop: "none" }}>
                {regenmon.operationLog.slice().reverse().map((entry, i) => (
                  <div key={i} className="flex justify-between font-sans text-[7px] py-1" style={{ borderBottom: "1px solid #222" }}>
                    <span style={{ color: "#666" }}>{new Date(entry.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
                    <span style={{ color: "#999" }}>{entry.action}</span>
                    <span style={{ color: entry.oilDelta >= 0 ? "#22c55e" : "#ff4444" }}>
                      {entry.oilDelta >= 0 ? "+" : ""}{entry.oilDelta} 🛢️
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Section — Terminal de Comunicaciones */}
        <div className="w-full max-w-md">
          <div className="font-sans text-[10px] sm:text-xs px-3 py-2 font-bold" style={{ color: "#ff8c00", backgroundColor: "#111", border: "3px solid #333", borderBottom: "none" }}>
            {"Terminal de Comunicaciones"}
          </div>
        </div>
        <RegenmonChat
          regenmon={regenmon}
          onStatChange={onStatChange}
          onEarnOilFromChat={onEarnOilFromChat}
          onShowOilFloat={onShowOilFloat}
          onMaintenanceMessage={null}
        />

        {/* Oil float effects */}
        {oilFloats.map((float) => (
          <div
            key={float.id}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 pointer-events-none z-50 font-sans text-sm font-bold"
            style={{
              color: float.color,
              animation: "floatUp 2s ease-out forwards",
            }}
          >
            {float.text}
          </div>
        ))}

        {celebrating && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-center p-6" style={{ border: "4px solid #ff8c00", backgroundColor: "rgba(10,10,10,0.95)" }}>
              <p className="font-sans text-sm sm:text-base" style={{ color: "#ff8c00" }}>
                {"Nivel Up!"}
              </p>
              <p className="font-sans text-2xl sm:text-4xl mt-2">{"🎉🛢️🎉"}</p>
              <p className="font-sans text-xs sm:text-sm mt-2" style={{ color: "#ff8c00" }}>
                {"Nivel "}{regenmon.level}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Training Screen */}
      {showTraining && (
        <TrainingScreen
          onComplete={(xp, oil) => onCertify(xp, oil)}
          onClose={() => setShowTraining(false)}
        />
      )}

      {/* Confirm Reset Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm p-4" style={{ backgroundColor: "#111", border: "4px solid #ff8c00" }}>
            <p className="font-sans text-[10px] sm:text-xs mb-4 leading-relaxed" style={{ color: "#ccc" }}>
              {"Estas seguro de reiniciar? Se borraran todos los datos de tu Regenmon."}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="nes-btn font-sans text-[8px] sm:text-[10px]"
                onClick={() => setShowConfirm(false)}
              >
                {"Cancelar"}
              </button>
              <button
                type="button"
                className="nes-btn is-error font-sans text-[8px] sm:text-[10px]"
                onClick={confirmReset}
              >
                {"Reiniciar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
