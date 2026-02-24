"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { RegenmonData } from "@/hooks/use-regenmon"

const CHAT_STORAGE_KEY = "regenmon-chat"
const MEMORIES_STORAGE_KEY = "regenmon-memories"
const MAX_MESSAGES = 20

interface RegenmonChatProps {
  regenmon: RegenmonData
  onStatChange: (happinessDelta: number) => void
  onChatReward?: () => number
}

function getTextFromParts(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function RegenmonChat({ regenmon, onStatChange, onChatReward }: RegenmonChatProps) {
  const [input, setInput] = useState("")
  const [memories, setMemories] = useState<string[]>([])
  const [statFloats, setStatFloats] = useState<Array<{ id: number; text: string; color: string }>>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const messageCountRef = useRef(0)
  const floatIdRef = useRef(0)
  const regenmonRef = useRef(regenmon)
  const memoriesRef = useRef(memories)

  // Keep refs in sync
  useEffect(() => { regenmonRef.current = regenmon }, [regenmon])
  useEffect(() => { memoriesRef.current = memories }, [memories])

  // Load memories from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MEMORIES_STORAGE_KEY)
      if (saved) setMemories(JSON.parse(saved))
    } catch {
      // ignore
    }
  }, [])

  // Save memories
  useEffect(() => {
    if (memories.length > 0) {
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(memories))
    }
  }, [memories])

  const transport = useMemo(() => new DefaultChatTransport({
    api: "/api/chat",
    prepareSendMessagesRequest: ({ id, messages: msgs }) => ({
      body: {
        messages: msgs,
        id,
        regenmonName: regenmonRef.current.name,
        regenmonType: regenmonRef.current.type,
        happiness: regenmonRef.current.happiness,
        hunger: regenmonRef.current.hunger ?? 100,
        level: regenmonRef.current.level,
        memories: memoriesRef.current,
      },
    }),
  }), [])

  const { messages, sendMessage, status } = useChat({ transport })

  const isLoading = status === "streaming" || status === "submitted"

  // Show stat float effect
  const showStatFloat = useCallback((text: string, color: string) => {
    const id = floatIdRef.current++
    setStatFloats((prev) => [...prev, { id, text, color }])
    setTimeout(() => {
      setStatFloats((prev) => prev.filter((f) => f.id !== id))
    }, 2000)
  }, [])

  // Detect memories from user messages
  const detectMemories = useCallback((text: string) => {
    const lowerText = text.toLowerCase()
    const patterns = [
      { regex: /me llamo (\w+)/i, prefix: "Se llama" },
      { regex: /mi nombre es (\w+)/i, prefix: "Se llama" },
      { regex: /me gusta(?:n)? (.+?)(?:\.|,|!|$)/i, prefix: "Le gusta" },
      { regex: /mi (?:color |comida |musica )?favorit[oa] es (.+?)(?:\.|,|!|$)/i, prefix: "Su favorito es" },
      { regex: /soy de (.+?)(?:\.|,|!|$)/i, prefix: "Es de" },
      { regex: /tengo (\d+) anos/i, prefix: "Tiene" },
    ]

    for (const { regex, prefix } of patterns) {
      const match = lowerText.match(regex)
      if (match) {
        const newMemory = `${prefix} ${match[1].trim()}`
        setMemories((prev) => {
          if (prev.includes(newMemory) || prev.length >= 10) return prev
          return [...prev, newMemory]
        })
      }
    }
  }, [])

  // Save chat and handle stat changes on new messages
  useEffect(() => {
    if (messages.length > messageCountRef.current) {
      const newCount = messages.length
      const diff = newCount - messageCountRef.current

      // Save to localStorage (keep only last MAX_MESSAGES)
      const toSave = messages.slice(-MAX_MESSAGES)
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toSave))

      // Check new messages for stat effects
      for (let i = messageCountRef.current; i < newCount; i++) {
        const msg = messages[i]
        if (msg.role === "user") {
          // Each user message: +5 stability
          onStatChange(5)
          showStatFloat("+5 Estabilidad", "#00cc44")

          // Try to earn $OIL from chat
          if (onChatReward) {
            onChatReward()
          }

          // Detect memories
          const text = getTextFromParts(msg.parts as Array<{ type: string; text?: string }>)
          detectMemories(text)
        }
      }

      // If conversation has 5+ consecutive messages, extra penalty
      if (newCount > 10 && diff > 0) {
        showStatFloat("-5 Desgaste operativo", "#ff4444")
      }

      messageCountRef.current = newCount
    }
  }, [messages, onStatChange, showStatFloat, detectMemories])

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <div className="w-full max-w-md flex flex-col">
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ backgroundColor: "#111111", border: "1px solid #333", borderBottom: "1px solid #ff8c00", marginBottom: 0 }}
      >
        <span className="font-sans text-[8px] sm:text-[10px] flex items-center gap-1" style={{ color: "#ff8c00" }}>
          {"Terminal de Comunicaciones"}
        </span>
        <div className="flex items-center gap-2">
          {memories.length > 0 && (
            <span className="font-sans text-[7px]" style={{ color: "#00cc44" }}>
              {"DATA: "}{memories.length}{" registros"}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex flex-col gap-3 overflow-y-auto"
        style={{
          height: "240px",
          padding: "12px",
          backgroundColor: "#0d0d0d",
          borderLeft: "1px solid #333",
          borderRight: "1px solid #333",
        }}
      >
        {messages.length === 0 && (
          <p className="font-sans text-[8px] text-center py-8" style={{ color: "#555" }}>
            {"Inicia comunicacion con tu Regenmon..."}
          </p>
        )}

        {messages.map((msg) => {
          const text = getTextFromParts(msg.parts as Array<{ type: string; text?: string }>)
          const isUser = msg.role === "user"

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"} animate-bounce-in`}
            >
              <div
                className="max-w-[85%] px-3 py-2"
                style={{
                  backgroundColor: isUser ? "#1a2a1a" : "#1a1a1a",
                  border: `1px solid ${isUser ? "#00cc44" : "#333"}`,
                  color: "#ddd",
                }}
              >
                <p className="font-sans text-[8px] sm:text-[10px] leading-relaxed break-words">
                  {text}
                </p>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start animate-bounce-in">
            <div
              className="px-3 py-2"
              style={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
              }}
            >
              <span className="font-sans text-[10px] animate-pulse" style={{ color: "#ff8c00" }}>
                {"Procesando datos..."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ backgroundColor: "#111111", border: "1px solid #333", borderTop: "1px solid #ff8c00" }}
        >
          <input
            type="text"
            className="font-sans text-[10px] flex-1 px-2 py-1 outline-none"
            style={{
              backgroundColor: "#1a1a1a",
              color: "#ddd",
              border: "1px solid #333",
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Transmitir mensaje..."
            disabled={isLoading}
            maxLength={200}
          />
          <button
            type="submit"
            className="font-sans text-[8px] px-3 py-1"
            disabled={isLoading}
            style={{
              backgroundColor: isLoading ? "#1a1a1a" : "#ff8c00",
              border: `1px solid ${isLoading ? "#333" : "#cc7000"}`,
              color: isLoading ? "#555" : "#0a0a0a",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {"Enviar"}
          </button>
        </div>
      </form>

      {/* Stat float effects */}
      {statFloats.map((float) => (
        <div
          key={float.id}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 pointer-events-none z-50 font-sans text-xs font-bold"
          style={{
            color: float.color,
            animation: "floatUp 2s ease-out forwards",
          }}
        >
          {float.text}
        </div>
      ))}
    </div>
  )
}
