"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRegenmon } from "@/hooks/use-regenmon"
import { useCoins } from "@/hooks/use-coins"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"
import { OilTowerBg } from "@/components/oil-tower-bg"

export default function Page() {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const userId = user?.email?.address || user?.google?.email || null

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
    boostHappiness,
  } = useRegenmon()

  const {
    coins,
    history,
    loaded: coinsLoaded,
    spendCoins,
    tryChatReward,
  } = useCoins(userId)

  // Wait for Privy + localStorage to load
  if (!ready || !loaded || !coinsLoaded) {
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
          onStatChange={boostHappiness}
          authenticated={authenticated}
          userEmail={userId}
          coins={coins}
          history={history}
          onLogin={login}
          onLogout={logout}
          onSpendCoins={spendCoins}
          onChatReward={tryChatReward}
        />
      </div>
    </>
  )
}
