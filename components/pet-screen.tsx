"use client"

import { useState } from "react"
import type { RegenmonData } from "@/hooks/use-regenmon"
import { RegenmonSprite } from "@/components/regenmon-sprite"
import { RegenmonChat } from "@/components/regenmon-chat"

const TYPE_CONFIG = {
  green: {
    bg: "from-emerald-900 to-emerald-700",
    border: "hsl(145 60% 35%)",
    label: "Gota con Gorra",
  },
  brown: {
    bg: "from-amber-900 to-amber-700",
    border: "hsl(35 60% 35%)",
    label: "Gota Estudiosa",
  },
  black: {
    bg: "from-neutral-900 to-neutral-700",
    border: "hsl(0 0% 25%)",
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
}: PetScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false)
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
      <header className="nes-container is-dark flex flex-wrap items-center justify-between gap-2" style={{ margin: 0, borderLeft: "none", borderRight: "none", borderTop: "none", backgroundColor: "#0a0a0a" }}>
        <h1 className="font-sans text-xs sm:text-sm flex items-center gap-2" style={{ color: "hsl(0 0% 88%)" }}>
          <RegenmonSprite type={regenmon.type} size={28} />
          <span>{"Regenmon"}</span>
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Oil Balance */}
          <span className="font-sans text-[8px] sm:text-[10px] px-2 py-1 rounded" style={{ backgroundColor: "hsl(0 0% 12%)", color: "#ff8c00" }}>
            {authenticated ? `🛢️ ${regenmon.oil ?? 0} $OIL` : "🛢️ — $OIL"}
          </span>
          <span className="font-sans text-[8px] sm:text-[10px] px-2 py-1 rounded" style={{ backgroundColor: "hsl(0 0% 12%)", color: "hsl(145 60% 45%)" }}>
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
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
        {/* Pet Display Card */}
        <div className="w-full max-w-md">
          <div
            className={`nes-container is-dark bg-gradient-to-b ${config.bg} flex flex-col items-center gap-4 py-6`}
            style={{ borderColor: config.border }}
          >
            <p className="font-sans text-sm sm:text-base text-center text-balance" style={{ color: "hsl(0 0% 95%)" }}>
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
              <p className="font-sans text-[10px] animate-pulse" style={{ color: "hsl(0 70% 55%)" }}>
                {"Tu Regenmon esta triste..."}
              </p>
            )}
            {isHungry && !isSad && (
              <p className="font-sans text-[10px] animate-pulse" style={{ color: "hsl(35 80% 55%)" }}>
                {"Tu Regenmon tiene hambre!"}
              </p>
            )}

            <p className="font-sans text-[8px] sm:text-[10px]" style={{ color: "hsl(0 0% 50%)" }}>
              {"Creado: "}{new Date(regenmon.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-md flex flex-col gap-4">
          {/* Rendimiento (was Happiness) */}
          <div className="nes-container is-dark" style={{ padding: "12px 16px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px] flex items-center gap-1" style={{ color: "hsl(0 0% 88%)" }}>
                <span>{"⚙️"}</span>
                <span>{"Rendimiento"}</span>
              </span>
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#ff8c00" }}>
                {happinessPercent}{"/100"}
              </span>
            </div>
            <progress
              className="nes-progress is-warning"
              value={happinessPercent}
              max={100}
              aria-label={`Rendimiento: ${happinessPercent} de 100`}
            />
          </div>

          {/* Presión de Mantenimiento (was Hunger) */}
          <div className="nes-container is-dark" style={{ padding: "12px 16px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px] flex items-center gap-1" style={{ color: "hsl(0 0% 88%)" }}>
                <span>{"🛢️"}</span>
                <span>{"Presión de Mantenimiento"}</span>
              </span>
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#22c55e" }}>
                {regenmon.hunger ?? 100}{"/100"}
              </span>
            </div>
            <progress
              className="nes-progress is-success"
              value={regenmon.hunger ?? 100}
              max={100}
              aria-label={`Presión: ${regenmon.hunger ?? 100} de 100`}
            />
          </div>

          {/* XP Bar */}
          <div className="nes-container is-dark" style={{ padding: "12px 16px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px] flex items-center gap-1" style={{ color: "hsl(0 0% 88%)" }}>
                <span>{"⚡"}</span>
                <span>{"XP"}</span>
              </span>
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "hsl(35 80% 55%)" }}>
                {regenmon.xp}{"/100"}
              </span>
            </div>
            <progress
              className="nes-progress is-warning"
              value={xpPercent}
              max={100}
              aria-label={`Experiencia: ${xpPercent} de 100`}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            className={`nes-btn font-sans text-[8px] sm:text-[10px] ${cooldown ? "is-disabled" : "is-success"}`}
            disabled={cooldown}
            onClick={onFeed}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="text-lg sm:text-xl">{"🍎"}</span>
              <span>{"Alimentar"}</span>
            </span>
          </button>
          <button
            type="button"
            className={`nes-btn font-sans text-[8px] sm:text-[10px] ${cooldown ? "is-disabled" : "is-primary"}`}
            disabled={cooldown}
            onClick={onPlay}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="text-lg sm:text-xl">{"🎮"}</span>
              <span>{"Jugar"}</span>
            </span>
          </button>
          <button
            type="button"
            className={`nes-btn font-sans text-[8px] sm:text-[10px] ${cooldown ? "is-disabled" : "is-warning"}`}
            disabled={cooldown}
            onClick={onTrain}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="text-lg sm:text-xl">{"⛏️"}</span>
              <span>{"Entrenar"}</span>
            </span>
          </button>
          {/* Maintenance Button */}
          <div className="relative">
            <button
              type="button"
              className={`nes-btn font-sans text-[8px] sm:text-[10px] w-full ${cooldown ? "is-disabled" : ""}`}
              disabled={cooldown}
              onClick={handleMaintenance}
              style={!cooldown ? { backgroundColor: "#ff8c00", color: "#000" } : {}}
            >
              <span className="flex flex-col items-center gap-1">
                <span className="text-lg sm:text-xl">{"⛽"}</span>
                <span>{"Inyectar"}</span>
                <span className="text-[7px]" style={{ color: cooldown ? undefined : "#0a0a0a" }}>{"10 $OIL"}</span>
              </span>
            </button>
            {maintenanceError && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-[8px] font-sans z-50" style={{ backgroundColor: "#ff4444", color: "#fff" }}>
                {"Fondos insuficientes!"}
              </div>
            )}
          </div>
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
              style={{ color: "#ff8c00", backgroundColor: "hsl(0 0% 8%)", border: "2px solid hsl(0 0% 18%)" }}
              onClick={() => setShowLog(!showLog)}
            >
              {showLog ? "▼" : "▶"} {"Registro de Operaciones ("}{regenmon.operationLog.length}{")"}
            </button>
            {showLog && (
              <div className="nes-container is-dark" style={{ padding: "8px 12px", maxHeight: "150px", overflowY: "auto" }}>
                {regenmon.operationLog.slice().reverse().map((entry, i) => (
                  <div key={i} className="flex justify-between font-sans text-[7px] py-1" style={{ borderBottom: "1px solid hsl(0 0% 15%)" }}>
                    <span style={{ color: "hsl(0 0% 60%)" }}>{new Date(entry.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
                    <span style={{ color: "hsl(0 0% 80%)" }}>{entry.action}</span>
                    <span style={{ color: entry.oilDelta >= 0 ? "#22c55e" : "#ff4444" }}>
                      {entry.oilDelta >= 0 ? "+" : ""}{entry.oilDelta} 🛢️
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chat Section */}
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
            <div className="nes-container is-dark is-rounded animate-bounce-in text-center" style={{ borderColor: "#ff8c00" }}>
              <p className="font-sans text-sm sm:text-base" style={{ color: "#ff8c00" }}>
                {"Nivel Up!"}
              </p>
              <p className="font-sans text-2xl sm:text-4xl mt-2">{"🎉🛢️🎉"}</p>
              <p className="font-sans text-xs sm:text-sm mt-2" style={{ color: "hsl(35 80% 55%)" }}>
                {"Nivel "}{regenmon.level}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Reset Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="nes-container is-dark with-title w-full max-w-sm">
            <p className="title font-sans text-[10px]">{"Confirmar"}</p>
            <p className="font-sans text-[10px] sm:text-xs mb-4 leading-relaxed" style={{ color: "hsl(0 0% 88%)" }}>
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
