"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRegenmon } from "@/hooks/use-regenmon"
import { CreateScreen } from "@/components/create-screen"
import { PetScreen } from "@/components/pet-screen"
import { OilTowerBg } from "@/components/oil-tower-bg"

export default function Page() {
  const { user, authenticated, login, logout, ready } = usePrivy()
  const privyUserId = authenticated && user ? user.id : null

  const {
    regenmon,
    loaded,
    cooldown,
    celebrating,
    evolutionAlert,
    oilFloats,
    createRegenmon,
    resetRegenmon,
    feed,
    play,
    train,
    boostHappiness,
    injectMaintenance,
    earnOilFromChat,
    showOilFloat,
    certify,
  } = useRegenmon(privyUserId)

  if (!ready || !loaded) {
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
          <CreateScreen
            onCreate={createRegenmon}
            authenticated={authenticated}
            onLogin={login}
          />
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
          oilFloats={oilFloats}
          authenticated={authenticated}
          userEmail={user?.email?.address || null}
          onLogin={login}
          onLogout={logout}
          onFeed={feed}
          onPlay={play}
          onTrain={train}
          onReset={resetRegenmon}
          onStatChange={boostHappiness}
          onInjectMaintenance={injectMaintenance}
          onEarnOilFromChat={earnOilFromChat}
          onShowOilFloat={showOilFloat}
          onCertify={certify}
          evolutionAlert={evolutionAlert}
        />
      </div>
    </>
  )
}
