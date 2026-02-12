"use client"

import { useState } from "react"
import Image from "next/image"
import type { RegenmonData } from "@/hooks/use-regenmon"

const TYPE_CONFIG = {
  green: {
    image: "/regenmon-green.jpg",
    bg: "from-emerald-900 to-emerald-700",
    border: "hsl(145 60% 35%)",
    label: "Gota con Gorra",
  },
  brown: {
    image: "/regenmon-brown.jpg",
    bg: "from-amber-900 to-amber-700",
    border: "hsl(35 60% 35%)",
    label: "Gota Estudiosa",
  },
  black: {
    image: "/regenmon-black.jpg",
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
}

export function PetScreen({
  regenmon,
  cooldown,
  celebrating,
  onFeed,
  onPlay,
  onTrain,
  onReset,
}: PetScreenProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const config = TYPE_CONFIG[regenmon.type]
  const isSad = regenmon.happiness === 0
  const xpPercent = regenmon.xp
  const happinessPercent = regenmon.happiness

  function handleReset() {
    setShowConfirm(true)
  }

  function confirmReset() {
    setShowConfirm(false)
    onReset()
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="nes-container is-dark flex flex-wrap items-center justify-between gap-2" style={{ margin: 0, borderLeft: "none", borderRight: "none", borderTop: "none" }}>
        <h1 className="font-sans text-xs sm:text-sm flex items-center gap-2" style={{ color: "hsl(60 20% 90%)" }}>
          <div className="relative w-6 h-6 pixel-render">
            <Image src={config.image} alt="" fill className="object-contain pixel-render" sizes="24px" />
          </div>
          <span>{"Regenmon"}</span>
        </h1>
        <div className="flex items-center gap-2">
          <span className="font-sans text-[8px] sm:text-[10px] px-2 py-1 rounded" style={{ backgroundColor: "hsl(240 10% 20%)", color: "hsl(145 60% 45%)" }}>
            {"Nv."}{regenmon.level}
          </span>
          <button
            type="button"
            className="nes-btn is-error font-sans text-[8px] sm:text-[10px]"
            onClick={handleReset}
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
            <p className="font-sans text-sm sm:text-base text-center text-balance" style={{ color: "hsl(60 20% 95%)" }}>
              {regenmon.name}
            </p>

            {/* Pet Avatar */}
            <div
              className={`transition-all duration-300 ${
                celebrating
                  ? "animate-celebrate"
                  : isSad
                  ? "grayscale"
                  : "animate-float"
              }`}
            >
              <div className="relative w-32 h-32 sm:w-44 sm:h-44 pixel-render">
                <Image
                  src={config.image}
                  alt={`Regenmon tipo ${config.label}: ${regenmon.name}`}
                  fill
                  className="object-contain pixel-render"
                  sizes="176px"
                  priority
                />
              </div>
            </div>

            {isSad && (
              <p className="font-sans text-[10px] animate-pulse" style={{ color: "hsl(0 70% 55%)" }}>
                {"Tu Regenmon esta triste..."}
              </p>
            )}

            <p className="font-sans text-[8px] sm:text-[10px]" style={{ color: "hsl(60 10% 60%)" }}>
              {"Creado: "}{new Date(regenmon.createdAt).toLocaleDateString("es-ES")}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="w-full max-w-md flex flex-col gap-4">
          {/* Happiness Bar */}
          <div className="nes-container is-dark" style={{ padding: "12px 16px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px] flex items-center gap-1" style={{ color: "hsl(60 20% 90%)" }}>
                <span>{"💚"}</span>
                <span>{"Felicidad"}</span>
              </span>
              <span className="font-sans text-[8px] sm:text-[10px]" style={{ color: "hsl(145 60% 45%)" }}>
                {happinessPercent}{"/100"}
              </span>
            </div>
            <progress
              className="nes-progress is-success"
              value={happinessPercent}
              max={100}
              aria-label={`Felicidad: ${happinessPercent} de 100`}
            />
          </div>

          {/* XP Bar */}
          <div className="nes-container is-dark" style={{ padding: "12px 16px" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-[8px] sm:text-[10px] flex items-center gap-1" style={{ color: "hsl(60 20% 90%)" }}>
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
        <div className="w-full max-w-md grid grid-cols-3 gap-3">
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
        </div>

        {cooldown && (
          <p className="font-sans text-[8px] sm:text-[10px] animate-pulse" style={{ color: "hsl(35 80% 55%)" }}>
            {"Esperando cooldown..."}
          </p>
        )}

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
            <p className="font-sans text-[10px] sm:text-xs mb-4 leading-relaxed" style={{ color: "hsl(60 20% 90%)" }}>
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
