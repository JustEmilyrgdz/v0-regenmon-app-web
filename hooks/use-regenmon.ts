import { useState, useEffect, useCallback, useRef } from "react"

export type RegenmonType = "green" | "brown" | "black"

export interface RegenmonData {
  name: string
  type: RegenmonType
  happiness: number
  hunger: number
  xp: number
  level: number
  createdAt: string
}

const STORAGE_KEY = "regenmon-data"
const HAPPINESS_DECAY_INTERVAL = 30000 // 30 seconds
const COOLDOWN_MS = 3000

export function useRegenmon() {
  const [regenmon, setRegenmon] = useState<RegenmonData | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  const [celebrating, setCelebrating] = useState(false)
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as RegenmonData
        setRegenmon(parsed)
      }
    } catch {
      // Corrupted data — ignore
    }
    setLoaded(true)
  }, [])

  // Save to localStorage whenever regenmon changes
  useEffect(() => {
    if (regenmon && loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(regenmon))
    }
  }, [regenmon, loaded])

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

  const createRegenmon = useCallback((name: string, type: RegenmonType) => {
    const newRegenmon: RegenmonData = {
      name,
      type,
      happiness: 100,
      hunger: 100,
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
    }
    setRegenmon(newRegenmon)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRegenmon))
  }, [])

  const resetRegenmon = useCallback(() => {
    setRegenmon(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

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

  return {
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
  }
}
