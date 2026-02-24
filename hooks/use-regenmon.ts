import { useState, useEffect, useCallback, useRef } from "react"

export type RegenmonType = "green" | "brown" | "black"

export interface RegenmonData {
  name: string
  type: RegenmonType
  happiness: number
  hunger: number
  xp: number
  level: number
  oil: number
  createdAt: string
  dailyOilEarned?: number
  dailyOilDate?: string
  operationLog?: OperationLogEntry[]
}

export interface OperationLogEntry {
  timestamp: string
  action: string
  oilDelta: number
}

const HAPPINESS_DECAY_INTERVAL = 30000
const COOLDOWN_MS = 3000
const DAILY_OIL_CAP = 50

function getStorageKey(privyUserId?: string | null) {
  return privyUserId ? `regenmon-data-${privyUserId}` : "regenmon-data"
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function useRegenmon(privyUserId?: string | null) {
  const [regenmon, setRegenmon] = useState<RegenmonData | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [oilFloats, setOilFloats] = useState<Array<{ id: number; text: string; color: string }>>([])
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const floatId = useRef(0)
  const storageKey = getStorageKey(privyUserId)

  // Load from localStorage on mount or when storageKey changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved) as RegenmonData
        // migrate: add oil if missing
        if (parsed.oil === undefined) parsed.oil = 100
        if (!parsed.operationLog) parsed.operationLog = []
        setRegenmon(parsed)
      } else {
        setRegenmon(null)
      }
    } catch {
      setRegenmon(null)
    }
    setLoaded(true)
  }, [storageKey])

  // Save to localStorage whenever regenmon changes
  useEffect(() => {
    if (regenmon && loaded) {
      localStorage.setItem(storageKey, JSON.stringify(regenmon))
    }
  }, [regenmon, loaded, storageKey])

  // Happiness and hunger decay
  const isAlive = regenmon !== null
  useEffect(() => {
    if (!isAlive) return
    const interval = setInterval(() => {
      setRegenmon((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          happiness: Math.max(0, prev.happiness - 1),
          hunger: Math.max(0, prev.hunger - 2),
        }
      })
    }, HAPPINESS_DECAY_INTERVAL)
    return () => clearInterval(interval)
  }, [isAlive])

  const showOilFloat = useCallback((text: string, color: string) => {
    const id = floatId.current++
    setOilFloats((prev) => [...prev, { id, text, color }])
    setTimeout(() => {
      setOilFloats((prev) => prev.filter((f) => f.id !== id))
    }, 2000)
  }, [])

  const addOperation = useCallback((action: string, oilDelta: number) => {
    setRegenmon((prev) => {
      if (!prev) return prev
      const log = [...(prev.operationLog || []), { timestamp: new Date().toISOString(), action, oilDelta }].slice(-10)
      return { ...prev, operationLog: log }
    })
  }, [])

  const createRegenmon = useCallback((name: string, type: RegenmonType) => {
    const newRegenmon: RegenmonData = {
      name,
      type,
      happiness: 100,
      hunger: 100,
      xp: 0,
      level: 1,
      oil: 100,
      createdAt: new Date().toISOString(),
      dailyOilEarned: 0,
      dailyOilDate: getTodayStr(),
      operationLog: [],
    }
    setRegenmon(newRegenmon)
    localStorage.setItem(storageKey, JSON.stringify(newRegenmon))
  }, [storageKey])

  const resetRegenmon = useCallback(() => {
    setRegenmon(null)
    localStorage.removeItem(storageKey)
  }, [storageKey])

  const startCooldown = useCallback(() => {
    setCooldown(true)
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current)
    cooldownTimer.current = setTimeout(() => {
      setCooldown(false)
    }, COOLDOWN_MS)
  }, [])

  const checkLevelUp = useCallback((data: RegenmonData): RegenmonData => {
    const xpNeeded = 100
    if (data.xp >= xpNeeded) {
      setCelebrating(true)
      setTimeout(() => setCelebrating(false), 1500)
      return {
        ...data,
        level: data.level + 1,
        xp: data.xp - xpNeeded,
      }
    }
    return data
  }, [])

  const feed = useCallback(() => {
    if (cooldown || !regenmon) return
    startCooldown()
    setRegenmon((prev) => {
      if (!prev) return prev
      const updated = {
        ...prev,
        hunger: Math.min(100, prev.hunger + 25),
        happiness: Math.min(100, prev.happiness + 5),
        xp: prev.xp + 5,
      }
      return checkLevelUp(updated)
    })
  }, [cooldown, regenmon, startCooldown, checkLevelUp])

  const play = useCallback(() => {
    if (cooldown || !regenmon) return
    startCooldown()
    setRegenmon((prev) => {
      if (!prev) return prev
      const updated = {
        ...prev,
        happiness: Math.min(100, prev.happiness + 15),
        xp: prev.xp + 10,
      }
      return checkLevelUp(updated)
    })
  }, [cooldown, regenmon, startCooldown, checkLevelUp])

  const train = useCallback(() => {
    if (cooldown || !regenmon) return
    startCooldown()
    setRegenmon((prev) => {
      if (!prev) return prev
      const updated = {
        ...prev,
        happiness: Math.min(100, prev.happiness + 5),
        xp: prev.xp + 20,
      }
      return checkLevelUp(updated)
    })
  }, [cooldown, regenmon, startCooldown, checkLevelUp])

  const boostHappiness = useCallback((delta: number) => {
    setRegenmon((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        happiness: Math.min(100, Math.max(0, prev.happiness + delta)),
      }
    })
  }, [])

  // Inject maintenance action (costs 10 OIL, +25 hunger)
  const injectMaintenance = useCallback(() => {
    if (cooldown || !regenmon) return false
    if (regenmon.oil < 10) return false
    startCooldown()
    setRegenmon((prev) => {
      if (!prev) return prev
      const log = [...(prev.operationLog || []), { timestamp: new Date().toISOString(), action: "⛽ Inyectar Aditivos", oilDelta: -10 }].slice(-10)
      return {
        ...prev,
        oil: prev.oil - 10,
        hunger: Math.min(100, prev.hunger + 25),
        operationLog: log,
      }
    })
    showOilFloat("-10 🛢️", "#ff4444")
    return true
  }, [cooldown, regenmon, startCooldown, showOilFloat])

  // Certification: award XP and OIL from technical evaluation
  const certify = useCallback((xp: number, oil: number) => {
    setRegenmon((prev) => {
      if (!prev) return prev
      const log = [...(prev.operationLog || []), { timestamp: new Date().toISOString(), action: "📋 Certificación Técnica", oilDelta: oil }].slice(-10)
      const updated = {
        ...prev,
        xp: prev.xp + xp,
        oil: prev.oil + oil,
        operationLog: log,
      }
      return checkLevelUp(updated)
    })
    if (oil > 0) showOilFloat(`+${oil} 🛢️`, "#ff8c00")
  }, [checkLevelUp, showOilFloat])

  // Chat mining: earn 2-5 OIL per message, dynamic difficulty
  const earnOilFromChat = useCallback(() => {
    setRegenmon((prev) => {
      if (!prev) return prev
      const today = getTodayStr()
      let dailyEarned = prev.dailyOilDate === today ? (prev.dailyOilEarned || 0) : 0
      if (dailyEarned >= DAILY_OIL_CAP) return prev

      // Dynamic difficulty: closer to 100 = harder
      const difficultyFactor = Math.max(0.2, 1 - (prev.oil / 150))
      const baseEarn = 2 + Math.floor(Math.random() * 4) // 2-5
      const earned = Math.max(1, Math.round(baseEarn * difficultyFactor))
      const actualEarned = Math.min(earned, DAILY_OIL_CAP - dailyEarned)

      const log = [...(prev.operationLog || []), { timestamp: new Date().toISOString(), action: "💬 Chat mining", oilDelta: actualEarned }].slice(-10)
      return {
        ...prev,
        oil: prev.oil + actualEarned,
        dailyOilEarned: dailyEarned + actualEarned,
        dailyOilDate: today,
        operationLog: log,
      }
    })
  }, [])

  return {
    regenmon,
    loaded,
    cooldown,
    celebrating,
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
    addOperation,
    certify,
  }
}
