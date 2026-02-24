import { useState, useEffect, useCallback, useRef } from "react"

export type RegenmonType = "green" | "brown" | "black"
export type RegenmonStage = 1 | 2 | 3

export interface TrainingHistoryEntry {
  timestamp: string
  category: string
  score: number
  xpEarned: number
  oilEarned: number
}

export interface RegenmonData {
  name: string
  type: RegenmonType
  happiness: number
  hunger: number
  xp: number
  totalExp: number
  level: number
  stage: RegenmonStage
  oil: number
  createdAt: string
  dailyOilEarned?: number
  dailyOilDate?: string
  operationLog?: OperationLogEntry[]
  trainingHistory?: TrainingHistoryEntry[]
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

function calculateStage(totalExp: number): RegenmonStage {
  if (totalExp >= 1500) return 3
  if (totalExp >= 500) return 2
  return 1
}

export const STAGE_INFO = {
  1: { emoji: "🧊", name: "Prototipo de Laboratorio", range: "0 - 499 EXP" },
  2: { emoji: "🏗️", name: "Unidad de Control Móvil", range: "500 - 1499 EXP" },
  3: { emoji: "🏭", name: "Complejo Petroquímico Integrado", range: "1500+ EXP" },
}

export function useRegenmon(privyUserId?: string | null) {
  const [regenmon, setRegenmon] = useState<RegenmonData | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const [evolutionAlert, setEvolutionAlert] = useState<{ stage: RegenmonStage; name: string } | null>(null)
  const [oilFloats, setOilFloats] = useState<Array<{ id: number; text: string; color: string }>>([])
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const floatId = useRef(0)
  const storageKey = getStorageKey(privyUserId)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved) as RegenmonData
        if (parsed.oil === undefined) parsed.oil = 100
        if (!parsed.operationLog) parsed.operationLog = []
        if (!parsed.trainingHistory) parsed.trainingHistory = []
        if (parsed.totalExp === undefined) parsed.totalExp = 0
        if (parsed.stage === undefined) parsed.stage = calculateStage(parsed.totalExp)
        setRegenmon(parsed)
      } else {
        setRegenmon(null)
      }
    } catch {
      setRegenmon(null)
    }
    setLoaded(true)
  }, [storageKey])

  useEffect(() => {
    if (regenmon && loaded) {
      localStorage.setItem(storageKey, JSON.stringify(regenmon))
    }
  }, [regenmon, loaded, storageKey])

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

  const createRegenmon = useCallback((name: string, type: RegenmonType) => {
    const newRegenmon: RegenmonData = {
      name,
      type,
      happiness: 100,
      hunger: 100,
      xp: 0,
      totalExp: 0,
      level: 1,
      stage: 1,
      oil: 100,
      createdAt: new Date().toISOString(),
      dailyOilEarned: 0,
      dailyOilDate: getTodayStr(),
      operationLog: [],
      trainingHistory: [],
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
      const updated = { ...prev, hunger: Math.min(100, prev.hunger + 25), happiness: Math.min(100, prev.happiness + 5), xp: prev.xp + 5 }
      return checkLevelUp(updated)
    })
  }, [cooldown, regenmon, startCooldown, checkLevelUp])

  const play = useCallback(() => {
    if (cooldown || !regenmon) return
    startCooldown()
    setRegenmon((prev) => {
      if (!prev) return prev
      const updated = { ...prev, happiness: Math.min(100, prev.happiness + 15), xp: prev.xp + 10 }
      return checkLevelUp(updated)
    })
  }, [cooldown, regenmon, startCooldown, checkLevelUp])

  const train = useCallback(() => {
    if (cooldown || !regenmon) return
    startCooldown()
    setRegenmon((prev) => {
      if (!prev) return prev
      const updated = { ...prev, happiness: Math.min(100, prev.happiness + 5), xp: prev.xp + 20 }
      return checkLevelUp(updated)
    })
  }, [cooldown, regenmon, startCooldown, checkLevelUp])

  const boostHappiness = useCallback((delta: number) => {
    setRegenmon((prev) => {
      if (!prev) return prev
      return { ...prev, happiness: Math.min(100, Math.max(0, prev.happiness + delta)) }
    })
  }, [])

  const injectMaintenance = useCallback(() => {
    if (cooldown || !regenmon) return false
    if (regenmon.oil < 10) return false
    startCooldown()
    setRegenmon((prev) => {
      if (!prev) return prev
      const log = [...(prev.operationLog || []), { timestamp: new Date().toISOString(), action: "⛽ Inyectar Aditivos", oilDelta: -10 }].slice(-10)
      return { ...prev, oil: prev.oil - 10, hunger: Math.min(100, prev.hunger + 25), operationLog: log }
    })
    showOilFloat("-10 🛢️", "#ff4444")
    return true
  }, [cooldown, regenmon, startCooldown, showOilFloat])

  // Certification: EXP = score, OIL = score × 0.5, stat impact if score >= 80
  const certify = useCallback((score: number, category: string) => {
    const xpEarned = score
    const oilEarned = Math.floor(score * 0.5)

    setRegenmon((prev) => {
      if (!prev) return prev

      const oldStage = prev.stage
      const newTotalExp = prev.totalExp + xpEarned
      const newStage = calculateStage(newTotalExp)

      // Stat impact if score >= 80
      let happinessDelta = 0
      let hungerDelta = 0
      if (score >= 80) {
        happinessDelta = 15
        hungerDelta = 15
      }

      // Evolution bonus
      let evolutionBonus = 0
      if (newStage > oldStage) {
        evolutionBonus = 100
        setTimeout(() => {
          setEvolutionAlert({ stage: newStage, name: prev.name })
          setTimeout(() => setEvolutionAlert(null), 4000)
        }, 500)
      }

      const log = [...(prev.operationLog || []), { timestamp: new Date().toISOString(), action: `📋 Certificación: ${category}`, oilDelta: oilEarned + evolutionBonus }].slice(-10)
      const history = [...(prev.trainingHistory || []), { timestamp: new Date().toISOString(), category, score, xpEarned, oilEarned: oilEarned + evolutionBonus }].slice(-20)

      const updated: RegenmonData = {
        ...prev,
        xp: prev.xp + xpEarned,
        totalExp: newTotalExp,
        stage: newStage,
        oil: prev.oil + oilEarned + evolutionBonus,
        happiness: Math.min(100, prev.happiness + happinessDelta),
        hunger: Math.min(100, prev.hunger + hungerDelta),
        operationLog: log,
        trainingHistory: history,
      }
      return checkLevelUp(updated)
    })
    if (oilEarned > 0) showOilFloat(`+${oilEarned} 🛢️`, "#ff8c00")
  }, [checkLevelUp, showOilFloat])

  const earnOilFromChat = useCallback(() => {
    setRegenmon((prev) => {
      if (!prev) return prev
      const today = getTodayStr()
      let dailyEarned = prev.dailyOilDate === today ? (prev.dailyOilEarned || 0) : 0
      if (dailyEarned >= DAILY_OIL_CAP) return prev
      const difficultyFactor = Math.max(0.2, 1 - (prev.oil / 150))
      const baseEarn = 2 + Math.floor(Math.random() * 4)
      const earned = Math.max(1, Math.round(baseEarn * difficultyFactor))
      const actualEarned = Math.min(earned, DAILY_OIL_CAP - dailyEarned)
      const log = [...(prev.operationLog || []), { timestamp: new Date().toISOString(), action: "💬 Chat mining", oilDelta: actualEarned }].slice(-10)
      return { ...prev, oil: prev.oil + actualEarned, dailyOilEarned: dailyEarned + actualEarned, dailyOilDate: today, operationLog: log }
    })
  }, [])

  return {
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
  }
}
