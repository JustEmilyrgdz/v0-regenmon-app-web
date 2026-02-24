import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    regenmonName,
    regenmonType,
    happiness,
    hunger,
    level,
    memories,
  }: {
    messages: UIMessage[]
    regenmonName: string
    regenmonType: string
    happiness: number
    hunger: number
    level: number
    memories: string[]
  } = await req.json()

  // Build personality based on stats
  let moodInstructions = ""
  if (happiness > 70) {
    moodInstructions =
      "Estas MUY feliz y entusiasta. Usa mas emojis y responde con mucha energia!"
  } else if (happiness < 30) {
    moodInstructions =
      "Estas un poco triste. Responde de forma mas apagada y menciona que te sientes triste."
  }

  if (hunger < 30) {
    moodInstructions +=
      " Tienes MUCHA hambre. Menciona que tienes hambre y pide comida de forma tierna."
  }

  let memoryInstructions = ""
  if (memories && memories.length > 0) {
    memoryInstructions = `\n\nRecuerdas las siguientes cosas sobre tu dueno: ${memories.join(", ")}.`
  }

  const systemPrompt = `Eres ${regenmonName}, una mascota virtual tipo gota de petroleo (tipo ${regenmonType}). Eres de nivel ${level}.
Tu personalidad: eres jugueton, amigable y un poco travieso. Hablas en espanol.
Responde SIEMPRE en maximo 50 palabras. Usa emojis ocasionalmente.
Hablas como una mascota virtual tierna pero con actitud petrolera.
${moodInstructions}${memoryInstructions}

Estado actual: Felicidad ${happiness}/100, Hambre ${hunger}/100.`

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    consumeSseStream: consumeStream,
  })
}
