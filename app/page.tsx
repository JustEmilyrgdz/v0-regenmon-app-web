"use client"

import { useRegenmon } from "@/hooks/use-regenmon"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"
import { OilTowerBg } from "@/components/oil-tower-bg"

export default function Page() {
  const {
    regenmon,
    loaded,
    cooldown,
    celebrating,
    createRegenmon,
    resetRegenmon,
    feed,
    play,
    train,
  } = useRegenmon()

  // Wait for localStorage to load
  if (!loaded) {
    return (
      <>
        <OilTowerBg />
        <main className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl animate-bounce-in">{"🥚"}</span>
            <p className="font-sans text-xs animate-pulse" style={{ color: "hsl(0 0% 88%)" }}>
              {"Cargando..."}
            </p>
          </div>
        </main>
      </>
    )
  }

  if (!regenmon) {
    return (
      <>
        <OilTowerBg />
        <div className="relative z-10">
          <CreateScreen onCreate={createRegenmon} />
        </div>
      </>
    )
  }

  return (
    <>
      <OilTowerBg />
      <div className="relative z-10">
        <PetScreen
          regenmon={regenmon}
          cooldown={cooldown}
          celebrating={celebrating}
          onFeed={feed}
          onPlay={play}
          onTrain={train}
          onReset={resetRegenmon}
        />
      </div>
    </>
  )
}
