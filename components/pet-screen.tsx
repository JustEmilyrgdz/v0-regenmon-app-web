"use client"

import { useState, useCallback } from "react"
import type { RegenmonData } from "@/hooks/use-regenmon"
import type { HistoryEntry } from "@/hooks/use-coins"
import { RegenmonSprite } from "@/components/regenmon-sprite"
import { RegenmonChat } from "@/components/regenmon-chat"

const TYPE_CONFIG = {
  green: {
    bg: "from-emerald-950 to-emerald-900",
    border: "#ff8c00",
    label: "Gota con Gorra",
  },
  brown: {
    bg: "from-amber-950 to-amber-900",
    border: "#ff8c00",
    label: "Gota Estudiosa",
  },
  black: {
    bg: "from-neutral-950 to-neutral-900",
    border: "#ff8c00",
    label: "Gota Cool",
  },
}

interface PetScreenProps {
  regenmon: RegenmonData
  cooldown: boolean
  celebrating: boolean
  onFeed: () => void
  onPlay: () => void
  onTrain: () => void
  onReset: () => void
  onStatChange: (delta: number) => void
  authenticated: boolean
  userEmail: string | null
  coins: number
  history: HistoryEntry[]
  onLogin: () => void
  onLogout: () => void
  onSpendCoins: (amount: number, action: string) => boolean
  onChatReward: () => number
}

export function PetScreen({
  regenmon,
  cooldown,
  celebrating,
  onFeed,
  onPlay,
  onTrain,
  onReset,
  onStatChange,
  authenticated,
  userEmail,
  coins,
  history,
  onLogin,
  onLogout,
  onSpendCoins,
  onChatReward,
}: PetScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [actionMsg, setActionMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null)
  const [coinFloats, setCoinFloats] = useState<Array<{ id: number; text: string; color: string }>>([])
  const [processing, setProcessing] = useState(false)

  const config = TYPE_CONFIG[regenmon.type]
  const isHungry = (regenmon.hunger ?? 100) <= 20
  const isSad = regenmon.happiness === 0 || (regenmon.hunger ?? 100) === 0
  const xpPercent = regenmon.xp
  const hungerFull = (regenmon.hunger ?? 100) >= 100

  const showCoinFloat = useCallback((text: string, color: string) => {
    const id = Date.now() + Math.random()
    setCoinFloats((prev) => [...prev, { id, text, color }])
    setTimeout(() => {
      setCoinFloats((prev) => prev.filter((f) => f.id !== id))
    }, 2000)
  }, [])

  const showAction = useCallback((text: string, type: "success" | "error" | "info") => {
    setActionMsg({ text, type })
    if (type !== "info") {
      setTimeout(() => setActionMsg(null), 3000)
    }
  }, [])

  function handleFeed() {
    if (processing || cooldown) return
    if (hungerFull) {
      showAction("Presion estable. No requiere mantenimiento.", "error")
      return
    }
    if (coins < 10) {
      showAction("Produccion insuficiente. Necesitas 10 $OIL.", "error")
      return
    }
    setProcessing(true)
    showAction("Inyectando aditivos...", "info")
    const spent = onSpendCoins(10, "Inyeccion de aditivos realizada")
    if (spent) {
      onFeed()
      showCoinFloat("-10 $OIL", "#ff4444")
      setTimeout(() => {
        showAction("Presion optimizada! Gracias por el mantenimiento, Ingeniero/a.", "success")
        setProcessing(false)
      }, 800)
    } else {
      showAction("Fondos insuficientes para la operacion.", "error")
      setProcessing(false)
    }
  }

  function handlePlay() {
    if (processing || cooldown) return
    setProcessing(true)
    showAction("Inspeccion de campo en curso...", "info")
    onPlay()
    setTimeout(() => {
      showAction("Inspeccion completada. Estabilidad operativa mejorada.", "success")
      setProcessing(false)
    }, 800)
  }

  function handleTrain() {
    if (processing || cooldown) return
    setProcessing(true)
    showAction("Perforacion exploratoria en progreso...", "info")
    onTrain()
    setTimeout(() => {
      showAction("Perforacion exitosa. Rendimiento del pozo aumentado.", "success")
      setProcessing(false)
    }, 800)
  }

  const handleChatReward = useCallback(() => {
    const reward = onChatReward()
    if (reward > 0) {
      showCoinFloat(`+${reward} $OIL`, "#00cc44")
    }
    return reward
  }, [onChatReward, showCoinFloat])

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#0a0a0a" }}>
      {/* Header - Industrial Dashboard Bar */}
      <header
        className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
        style={{
          backgroundColor: "#111111",
          borderBottom: "2px solid #ff8c00",
        }}
      >
        <div className="flex items-center gap-2">
          <RegenmonSprite type={regenmon.type} size={24} />
          <span className="font-sans text-[8px] sm:text-[10px] font-bold" style={{ color: "#ff8c00" }}>
            {"REGENMON"}
          </span>
          <span className="font-sans text-[7px]" style={{ color: "#555" }}>
            {"PETROLEUM ED."}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* $OIL Balance */}
          <div
            className="flex items-center gap-1 px-2 py-1"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
            }}
          >
            <span className="text-xs">{"🛢️"}</span>
            {authenticated ? (
              <span className="font-sans text-[9px] font-bold" style={{ color: "#ff8c00" }}>
                {coins}{" $OIL"}
              </span>
            ) : (
              <span className="font-sans text-[9px]" style={{ color: "#555" }}>
                {"--- $OIL"}
              </span>
            )}
          </div>

          {/* Level */}
          <div
            className="flex items-center gap-1 px-2 py-1"
            style={{
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
            }}
          >
            <span className="font-sans text-[9px] font-bold" style={{ color: "#00cc44" }}>
              {"Nv."}{regenmon.level}
            </span>
          </div>

          {/* Auth */}
          {authenticated ? (
            <div className="flex items-center gap-2">
              <span className="font-sans text-[7px] hidden sm:inline" style={{ color: "#888" }}>
                {userEmail ? userEmail.split("@")[0] : "Operador"}
              </span>
              <button
                type="button"
                className="font-sans text-[7px] px-2 py-1"
                onClick={onLogout}
                style={{
                  backgroundColor: "#330000",
                  border: "1px solid #660000",
                  color: "#ff4444",
                  cursor: "pointer",
                }}
              >
                {"Cerrar Sesion"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="font-sans text-[8px] px-3 py-1 font-bold"
              onClick={onLogin}
              style={{
                backgroundColor: "#ff8c00",
                border: "1px solid #cc7000",
                color: "#0a0a0a",
                cursor: "pointer",
              }}
            >
              {"Iniciar Operaciones"}
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center gap-5 p-4">
        {/* Action message */}
        {actionMsg && (
          <div
            className="w-full max-w-md text-center font-sans text-[8px] sm:text-[10px] animate-bounce-in px-3 py-2"
            style={{
              backgroundColor: "#111111",
              border: `1px solid ${
                actionMsg.type === "success" ? "#00cc44" : actionMsg.type === "error" ? "#ff4444" : "#ff8c00"
              }`,
              color: actionMsg.type === "success" ? "#00cc44" : actionMsg.type === "error" ? "#ff4444" : "#ff8c00",
            }}
          >
            {actionMsg.text}
          </div>
        )}

        {/* Pet Display Card */}
        <div className="w-full max-w-md">
          <div
            className={`nes-container is-dark bg-gradient-to-b ${config.bg} flex flex-col items-center gap-4 py-6`}
            style={{ borderColor: config.border }}
          >
            <p className="font-sans text-sm sm:text-base text-center text-balance" style={{ color: "#ff8c00" }}>
              {regenmon.name}
            </p>

            <div
              className={`transition-all duration-300 ${
                celebrating ? "animate-celebrate" : isSad ? "grayscale" : "animate-float"
              }`}
            >
              <RegenmonSprite type={regenmon.type} size={176} />
            </div>

            {isSad && (
              <p className="font-sans text-[10px] animate-pulse" style={{ color: "#ff4444" }}>
                {"Alerta: Activo en estado critico..."}
              </p>
            )}
            {isHungry && !isSad && (
              <p className="font-sans text-[10px] animate-pulse" style={{ color: "#ff8c00" }}>
                {"Advertencia: Presion baja. Requiere mantenimiento."}
              </p>
            )}

            <p className="font-sans text-[8px]" style={{ color: "#555" }}>
              {"Comisionado: "}{new Date(regenmon.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>

        {/* Stats - Industrial Gauges */}
        <div className="w-full max-w-md flex flex-col gap-3">
          {/* Energy / Rendimiento del Pozo */}
          <div
            className="flex flex-col gap-1 px-3 py-2"
            style={{ backgroundColor: "#111111", border: "1px solid #222" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#00cc44" }}>
                {"Estabilidad Operativa"}
              </span>
              <span className="font-sans text-[8px] sm:text-[10px] font-bold" style={{ color: "#00cc44" }}>
                {regenmon.happiness}{"/100"}
              </span>
            </div>
            <div className="w-full h-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${regenmon.happiness}%`,
                  backgroundColor: regenmon.happiness > 50 ? "#00cc44" : regenmon.happiness > 20 ? "#ff8c00" : "#ff4444",
                }}
              />
            </div>
          </div>

          {/* Hunger / Nivel de Presion */}
          <div
            className="flex flex-col gap-1 px-3 py-2"
            style={{ backgroundColor: "#111111", border: "1px solid #222" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#ff8c00" }}>
                {"Nivel de Presion"}
              </span>
              <span className="font-sans text-[8px] sm:text-[10px] font-bold" style={{ color: "#ff8c00" }}>
                {regenmon.hunger ?? 100}{"/100"}
              </span>
            </div>
            <div className="w-full h-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${regenmon.hunger ?? 100}%`,
                  backgroundColor: (regenmon.hunger ?? 100) > 50 ? "#ff8c00" : (regenmon.hunger ?? 100) > 20 ? "#cc6600" : "#ff4444",
                }}
              />
            </div>
          </div>

          {/* XP / Rendimiento del Pozo */}
          <div
            className="flex flex-col gap-1 px-3 py-2"
            style={{ backgroundColor: "#111111", border: "1px solid #222" }}
          >
            <div className="flex items-center justify-between">
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "#888" }}>
                {"Rendimiento del Pozo (XP)"}
              </span>
              <span className="font-sans text-[8px] sm:text-[10px] font-bold" style={{ color: "#888" }}>
                {regenmon.xp}{"/100"}
              </span>
            </div>
            <div className="w-full h-3" style={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${xpPercent}%`,
                  backgroundColor: "#555",
                }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - Industrial Controls */}
        <div className="w-full max-w-md grid grid-cols-3 gap-2">
          <button
            type="button"
            className="font-sans text-[7px] sm:text-[9px] py-3 flex flex-col items-center gap-1 transition-opacity"
            disabled={cooldown || processing}
            onClick={handleFeed}
            title={coins < 10 ? "Necesitas 10 $OIL" : hungerFull ? "Presion estable" : "Inyectar Aditivos (10 $OIL)"}
            style={{
              backgroundColor: cooldown || processing ? "#1a1a1a" : "#1a2a1a",
              border: `1px solid ${cooldown || processing ? "#333" : "#00cc44"}`,
              color: cooldown || processing ? "#555" : "#00cc44",
              cursor: cooldown || processing ? "not-allowed" : "pointer",
              opacity: cooldown || processing ? 0.5 : 1,
            }}
          >
            <span className="text-lg">{"⛽"}</span>
            <span>{"Inyectar"}</span>
            <span>{"Aditivos"}</span>
            <span style={{ color: coins < 10 ? "#ff4444" : "#ff8c00", fontSize: "7px" }}>
              {"(10 🛢️)"}
            </span>
          </button>

          <button
            type="button"
            className="font-sans text-[7px] sm:text-[9px] py-3 flex flex-col items-center gap-1 transition-opacity"
            disabled={cooldown || processing}
            onClick={handlePlay}
            style={{
              backgroundColor: cooldown || processing ? "#1a1a1a" : "#1a1a2a",
              border: `1px solid ${cooldown || processing ? "#333" : "#4488ff"}`,
              color: cooldown || processing ? "#555" : "#4488ff",
              cursor: cooldown || processing ? "not-allowed" : "pointer",
              opacity: cooldown || processing ? 0.5 : 1,
            }}
          >
            <span className="text-lg">{"🔍"}</span>
            <span>{"Inspeccion"}</span>
            <span>{"de Campo"}</span>
          </button>

          <button
            type="button"
            className="font-sans text-[7px] sm:text-[9px] py-3 flex flex-col items-center gap-1 transition-opacity"
            disabled={cooldown || processing}
            onClick={handleTrain}
            style={{
              backgroundColor: cooldown || processing ? "#1a1a1a" : "#2a1a0a",
              border: `1px solid ${cooldown || processing ? "#333" : "#ff8c00"}`,
              color: cooldown || processing ? "#555" : "#ff8c00",
              cursor: cooldown || processing ? "not-allowed" : "pointer",
              opacity: cooldown || processing ? 0.5 : 1,
            }}
          >
            <span className="text-lg">{"⛏️"}</span>
            <span>{"Perforacion"}</span>
            <span>{"Exploratoria"}</span>
          </button>
        </div>

        {cooldown && (
          <p className="font-sans text-[8px] animate-pulse" style={{ color: "#ff8c00" }}>
            {"Enfriamiento de equipo en curso..."}
          </p>
        )}

        {/* Chat Section */}
        <RegenmonChat regenmon={regenmon} onStatChange={onStatChange} onChatReward={handleChatReward} />

        {/* History Section */}
        {history.length > 0 && (
          <div className="w-full max-w-md">
            <button
              type="button"
              className="font-sans text-[8px] sm:text-[10px] w-full py-2 flex items-center justify-center gap-2"
              onClick={() => setShowHistory(!showHistory)}
              style={{
                backgroundColor: "#111111",
                border: "1px solid #333",
                color: "#888",
                cursor: "pointer",
              }}
            >
              {"Historial de Operaciones "}{showHistory ? "[-]" : "[+]"}
            </button>
            {showHistory && (
              <div
                className="flex flex-col gap-1 px-3 py-2"
                style={{ backgroundColor: "#0d0d0d", borderLeft: "1px solid #333", borderRight: "1px solid #333", borderBottom: "1px solid #333" }}
              >
                {history.map((entry, i) => (
                  <div key={`${entry.timestamp}-${i}`} className="flex items-center justify-between font-sans text-[7px] sm:text-[8px] py-1" style={{ borderBottom: "1px solid #1a1a1a" }}>
                    <span style={{ color: "#888" }}>{entry.action}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: entry.coins < 0 ? "#ff4444" : "#00cc44" }}>
                        {entry.coins > 0 ? "+" : ""}{entry.coins}{" 🛢️"}
                      </span>
                      <span style={{ color: "#444" }}>
                        {new Date(entry.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reset button */}
        <button
          type="button"
          className="font-sans text-[7px] px-4 py-1 mb-6"
          onClick={() => setShowConfirm(true)}
          style={{
            backgroundColor: "#1a0000",
            border: "1px solid #440000",
            color: "#884444",
            cursor: "pointer",
          }}
        >
          {"Descomisionar Activo"}
        </button>

        {celebrating && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div
              className="animate-bounce-in text-center px-8 py-6"
              style={{ backgroundColor: "#111111", border: "2px solid #ff8c00" }}
            >
              <p className="font-sans text-sm sm:text-base font-bold" style={{ color: "#ff8c00" }}>
                {"Nivel Alcanzado!"}
              </p>
              <p className="font-sans text-2xl sm:text-4xl mt-2">{"🛢️🔥🛢️"}</p>
              <p className="font-sans text-xs sm:text-sm mt-2" style={{ color: "#00cc44" }}>
                {"Nivel "}{regenmon.level}{" - Produccion Expandida"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Reset Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}>
          <div
            className="w-full max-w-sm px-6 py-5"
            style={{ backgroundColor: "#111111", border: "2px solid #ff4444" }}
          >
            <p className="font-sans text-[10px] font-bold mb-3" style={{ color: "#ff4444" }}>
              {"CONFIRMAR DESCOMISION"}
            </p>
            <p className="font-sans text-[9px] mb-4 leading-relaxed" style={{ color: "#888" }}>
              {"Esta operacion es irreversible. Se eliminaran todos los datos del activo y el historial de produccion."}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="font-sans text-[8px] px-4 py-1"
                onClick={() => setShowConfirm(false)}
                style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", color: "#888", cursor: "pointer" }}
              >
                {"Cancelar"}
              </button>
              <button
                type="button"
                className="font-sans text-[8px] px-4 py-1"
                onClick={() => { setShowConfirm(false); onReset() }}
                style={{ backgroundColor: "#440000", border: "1px solid #ff4444", color: "#ff4444", cursor: "pointer" }}
              >
                {"Descomisionar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coin float effects */}
      {coinFloats.map((float) => (
        <div
          key={float.id}
          className="fixed top-1/3 left-1/2 pointer-events-none z-50 font-sans text-sm font-bold"
          style={{
            color: float.color,
            animation: "floatUp 2s ease-out forwards",
          }}
        >
          {float.text}
        </div>
      ))}
    </main>
  )
}
