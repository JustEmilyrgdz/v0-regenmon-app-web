"use client"

import { useState, useCallback } from "react"
import type { RegenmonData } from "@/hooks/use-regenmon"
import type { HistoryEntry } from "@/hooks/use-coins"
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
  const happinessPercent = regenmon.happiness
  const hungerFull = (regenmon.hunger ?? 100) >= 100

  let floatIdCounter = 0

  // Show floating coin effect
  const showCoinFloat = useCallback((text: string, color: string) => {
    const id = Date.now() + Math.random()
    setCoinFloats((prev) => [...prev, { id, text, color }])
    setTimeout(() => {
      setCoinFloats((prev) => prev.filter((f) => f.id !== id))
    }, 2000)
  }, [])

  // Show action message that auto-dismisses
  const showAction = useCallback((text: string, type: "success" | "error" | "info") => {
    setActionMsg({ text, type })
    if (type !== "info") {
      setTimeout(() => setActionMsg(null), 2000)
    }
  }, [])

  // Feed handler with coin cost
  function handleFeed() {
    if (processing || cooldown) return
    if (hungerFull) {
      showAction("Tu Regenmon no tiene hambre!", "error")
      return
    }
    if (coins < 10) {
      showAction("Necesitas 10 $FRUTA. Habla con tu Regenmon para ganar!", "error")
      return
    }
    setProcessing(true)
    showAction("Procesando...", "info")
    const spent = onSpendCoins(10, "Alimentar Regenmon")
    if (spent) {
      onFeed()
      showCoinFloat("-10 $FRUTA", "hsl(0 70% 55%)")
      setTimeout(() => {
        showAction("Listo! Tu Regenmon comio.", "success")
        setProcessing(false)
      }, 600)
    } else {
      showAction("No tienes suficientes monedas", "error")
      setProcessing(false)
    }
  }

  // Play handler (free)
  function handlePlay() {
    if (processing || cooldown) return
    setProcessing(true)
    showAction("Procesando...", "info")
    onPlay()
    setTimeout(() => {
      showAction("Listo! Tu Regenmon se divirtio.", "success")
      setProcessing(false)
    }, 600)
  }

  // Train handler (free)
  function handleTrain() {
    if (processing || cooldown) return
    setProcessing(true)
    showAction("Procesando...", "info")
    onTrain()
    setTimeout(() => {
      showAction("Listo! Tu Regenmon entreno.", "success")
      setProcessing(false)
    }, 600)
  }

  function handleReset() {
    setShowConfirm(true)
  }

  function confirmReset() {
    setShowConfirm(false)
    onReset()
  }

  // Chat reward callback
  const handleChatReward = useCallback(() => {
    const reward = onChatReward()
    if (reward > 0) {
      showCoinFloat(`+${reward} $FRUTA`, "hsl(35 80% 55%)")
    }
    return reward
  }, [onChatReward, showCoinFloat])

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        className="nes-container is-dark flex flex-wrap items-center justify-between gap-2"
        style={{ margin: 0, borderLeft: "none", borderRight: "none", borderTop: "none" }}
      >
        <div className="flex items-center gap-2">
          <RegenmonSprite type={regenmon.type} size={28} />
          <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "hsl(0 0% 88%)" }}>
            {"Regenmon"}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Coins display */}
          {authenticated ? (
            <span
              className="font-sans text-[8px] sm:text-[10px] px-2 py-1"
              style={{ backgroundColor: "hsl(0 0% 12%)", color: "hsl(35 80% 55%)", borderRadius: "2px" }}
            >
              {"🍊 "}{coins}{" $FRUTA"}
            </span>
          ) : (
            <span
              className="font-sans text-[8px] sm:text-[10px] px-2 py-1"
              style={{ backgroundColor: "hsl(0 0% 12%)", color: "hsl(0 0% 50%)", borderRadius: "2px" }}
            >
              {"🍊 --- $FRUTA"}
            </span>
          )}

          {/* Level badge */}
          <span
            className="font-sans text-[8px] sm:text-[10px] px-2 py-1"
            style={{ backgroundColor: "hsl(0 0% 12%)", color: "hsl(145 60% 45%)", borderRadius: "2px" }}
          >
            {"Nv."}{regenmon.level}
          </span>

          {/* Auth button */}
          {authenticated ? (
            <div className="flex items-center gap-2">
              <span className="font-sans text-[7px] sm:text-[8px] hidden sm:inline" style={{ color: "hsl(0 0% 60%)" }}>
                {userEmail ? userEmail.split("@")[0] : "Usuario"}
              </span>
              <button
                type="button"
                className="nes-btn is-error font-sans text-[7px] sm:text-[8px]"
                onClick={onLogout}
                style={{ padding: "2px 6px" }}
              >
                {"Salir"}
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="nes-btn is-primary font-sans text-[7px] sm:text-[8px]"
              onClick={onLogin}
              style={{ padding: "2px 6px" }}
            >
              {"Iniciar Sesion"}
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 p-4">
        {/* Action message */}
        {actionMsg && (
          <div
            className="w-full max-w-md nes-container is-dark text-center font-sans text-[8px] sm:text-[10px] animate-bounce-in"
            style={{
              padding: "8px 12px",
              borderColor:
                actionMsg.type === "success"
                  ? "hsl(145 60% 45%)"
                  : actionMsg.type === "error"
                  ? "hsl(0 70% 55%)"
                  : "hsl(35 80% 55%)",
              color:
                actionMsg.type === "success"
                  ? "hsl(145 60% 45%)"
                  : actionMsg.type === "error"
                  ? "hsl(0 70% 55%)"
                  : "hsl(35 80% 55%)",
            }}
          >
            {actionMsg.type === "info" && "⏳ "}
            {actionMsg.type === "success" && "✅ "}
            {actionMsg.type === "error" && "❌ "}
            {actionMsg.text}
          </div>
        )}

        {/* Pet Display Card */}
        <div className="w-full max-w-md">
          <div
            className={`nes-container is-dark bg-gradient-to-b ${config.bg} flex flex-col items-center gap-4 py-6`}
            style={{ borderColor: config.border }}
          >
            <p className="font-sans text-sm sm:text-base text-center text-balance" style={{ color: "hsl(0 0% 95%)" }}>
              {regenmon.name}
            </p>

            {/* Pet Avatar */}
            <div
              className={`transition-all duration-300 ${
                celebrating ? "animate-celebrate" : isSad ? "grayscale" : "animate-float"
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
          {/* Happiness Bar */}
          <div className="nes-container is-dark" style={{ padding: "12px 16px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px] flex items-center gap-1" style={{ color: "hsl(0 0% 88%)" }}>
                {"💚 Felicidad"}
              </span>
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "hsl(145 60% 45%)" }}>
                {happinessPercent}{"/100"}
              </span>
            </div>
            <progress className="nes-progress is-success" value={happinessPercent} max={100} />
          </div>

          {/* Hunger Bar */}
          <div className="nes-container is-dark" style={{ padding: "12px 16px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px] flex items-center gap-1" style={{ color: "hsl(0 0% 88%)" }}>
                {"🍖 Hambre"}
              </span>
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "hsl(0 70% 55%)" }}>
                {regenmon.hunger ?? 100}{"/100"}
              </span>
            </div>
            <progress className="nes-progress is-error" value={regenmon.hunger ?? 100} max={100} />
          </div>

          {/* XP Bar */}
          <div className="nes-container is-dark" style={{ padding: "12px 16px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px] flex items-center gap-1" style={{ color: "hsl(0 0% 88%)" }}>
                {"⚡ XP"}
              </span>
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "hsl(35 80% 55%)" }}>
                {regenmon.xp}{"/100"}
              </span>
            </div>
            <progress className="nes-progress is-warning" value={xpPercent} max={100} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md grid grid-cols-3 gap-3">
          <button
            type="button"
            className={`nes-btn font-sans text-[8px] sm:text-[10px] ${cooldown || processing ? "is-disabled" : "is-success"}`}
            disabled={cooldown || processing}
            onClick={handleFeed}
            title={coins < 10 ? "Necesitas 10 $FRUTA" : hungerFull ? "Tu Regenmon no tiene hambre" : "Alimentar (10 $FRUTA)"}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="text-lg sm:text-xl">{"🍎"}</span>
              <span>{"Alimentar"}</span>
              <span className="text-[7px]" style={{ color: coins < 10 ? "hsl(0 70% 55%)" : "hsl(35 80% 55%)" }}>
                {"(10 🍊)"}
              </span>
            </span>
          </button>
          <button
            type="button"
            className={`nes-btn font-sans text-[8px] sm:text-[10px] ${cooldown || processing ? "is-disabled" : "is-primary"}`}
            disabled={cooldown || processing}
            onClick={handlePlay}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="text-lg sm:text-xl">{"🎮"}</span>
              <span>{"Jugar"}</span>
            </span>
          </button>
          <button
            type="button"
            className={`nes-btn font-sans text-[8px] sm:text-[10px] ${cooldown || processing ? "is-disabled" : "is-warning"}`}
            disabled={cooldown || processing}
            onClick={handleTrain}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="text-lg sm:text-xl">{"⛏️"}</span>
              <span>{"Entrenar"}</span>
            </span>
          </button>
        </div>

        {cooldown && (
          <p className="font-sans text-[8px] sm:text-[10px] animate-pulse" style={{ color: "hsl(35 80% 55%)" }}>
            {"Esperando cooldown..."}
          </p>
        )}

        {/* Chat Section */}
        <RegenmonChat regenmon={regenmon} onStatChange={onStatChange} onChatReward={handleChatReward} />

        {/* History Section */}
        {history.length > 0 && (
          <div className="w-full max-w-md">
            <button
              type="button"
              className="nes-btn is-dark font-sans text-[8px] sm:text-[10px] w-full"
              onClick={() => setShowHistory(!showHistory)}
            >
              {"📜 Historial "}{showHistory ? "▲" : "▼"}
            </button>
            {showHistory && (
              <div className="nes-container is-dark flex flex-col gap-2 mt-0" style={{ padding: "8px 12px", borderTop: "none" }}>
                {history.map((entry, i) => (
                  <div key={`${entry.timestamp}-${i}`} className="flex items-center justify-between font-sans text-[7px] sm:text-[8px]">
                    <span style={{ color: "hsl(0 0% 70%)" }}>{entry.action}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: entry.coins < 0 ? "hsl(0 70% 55%)" : "hsl(35 80% 55%)" }}>
                        {entry.coins > 0 ? "+" : ""}{entry.coins}{" 🍊"}
                      </span>
                      <span style={{ color: "hsl(0 0% 40%)" }}>
                        {new Date(entry.timestamp).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reset button at bottom */}
        <button
          type="button"
          className="nes-btn is-error font-sans text-[7px] sm:text-[8px]"
          onClick={handleReset}
          style={{ padding: "4px 12px" }}
        >
          {"Reiniciar Regenmon"}
        </button>

        {celebrating && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="nes-container is-dark is-rounded animate-bounce-in text-center" style={{ borderColor: "hsl(145 60% 45%)" }}>
              <p className="font-sans text-sm sm:text-base" style={{ color: "hsl(145 60% 45%)" }}>
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
              <button type="button" className="nes-btn font-sans text-[8px] sm:text-[10px]" onClick={() => setShowConfirm(false)}>
                {"Cancelar"}
              </button>
              <button type="button" className="nes-btn is-error font-sans text-[8px] sm:text-[10px]" onClick={confirmReset}>
                {"Reiniciar"}
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
