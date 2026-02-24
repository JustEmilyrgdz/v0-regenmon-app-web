import { useState, useEffect, useCallback, useRef } from "react"

const INITIAL_COINS = 100
const MAX_HISTORY = 10

export interface HistoryEntry {
  action: string
  coins: number
  timestamp: string
}

function getStorageKey(userId: string | null) {
  const prefix = userId || "guest"
  return {
    coins: `regenmon-coins-${prefix}`,
    history: `regenmon-history-${prefix}`,
  }
}

export function useCoins(userId: string | null) {
  const [coins, setCoins] = useState(INITIAL_COINS)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loaded, setLoaded] = useState(false)
  const chatRewardsThisSession = useRef(0)

  // Load from localStorage based on userId
  useEffect(() => {
    const keys = getStorageKey(userId)
    try {
      const savedCoins = localStorage.getItem(keys.coins)
      if (savedCoins !== null) {
        setCoins(parseInt(savedCoins, 10))
      } else {
        setCoins(INITIAL_COINS)
      }
      const savedHistory = localStorage.getItem(keys.history)
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      } else {
        setHistory([])
      }
    } catch {
      setCoins(INITIAL_COINS)
      setHistory([])
    }
    chatRewardsThisSession.current = 0
    setLoaded(true)
  }, [userId])

  // Persist coins
  useEffect(() => {
    if (!loaded) return
    const keys = getStorageKey(userId)
    localStorage.setItem(keys.coins, String(coins))
  }, [coins, loaded, userId])

  // Persist history
  useEffect(() => {
    if (!loaded) return
    const keys = getStorageKey(userId)
    localStorage.setItem(keys.history, JSON.stringify(history))
  }, [history, loaded, userId])

  const addHistory = useCallback((action: string, coinsDelta: number) => {
    setHistory((prev) => {
      const entry: HistoryEntry = {
        action,
        coins: coinsDelta,
        timestamp: new Date().toISOString(),
      }
      return [entry, ...prev].slice(0, MAX_HISTORY)
    })
  }, [])

  const spendCoins = useCallback(
    (amount: number, action: string): boolean => {
      if (coins < amount) return false
      setCoins((prev) => prev - amount)
      addHistory(action, -amount)
      return true
    },
    [coins, addHistory]
  )

  const earnCoins = useCallback(
    (amount: number, action: string) => {
      setCoins((prev) => prev + amount)
      addHistory(action, amount)
    },
    [addHistory]
  )

  // Chat reward with diminishing returns
  const tryChatReward = useCallback((): number => {
    // Max ~20 rewards per session, harder as coins approach 100
    if (chatRewardsThisSession.current >= 20) return 0

    const currentCoins = coins
    let probability = 0.6

    // If coins >= 80, much harder to earn
    if (currentCoins >= 100) {
      probability = 0.05
    } else if (currentCoins >= 80) {
      probability = 0.15
    } else if (currentCoins >= 60) {
      probability = 0.3
    }

    // Each reward this session makes next one harder
    probability -= chatRewardsThisSession.current * 0.02

    if (Math.random() > probability) return 0

    const reward = Math.floor(Math.random() * 4) + 2 // 2-5 coins
    chatRewardsThisSession.current++
    earnCoins(reward, "Chat con Regenmon")
    return reward
  }, [coins, earnCoins])

  return {
    coins,
    history,
    loaded,
    spendCoins,
    earnCoins,
    tryChatReward,
  }
}
