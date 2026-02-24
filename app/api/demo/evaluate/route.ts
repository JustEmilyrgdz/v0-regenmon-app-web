import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { image, category } = await req.json()

    if (!image || !category) {
      return NextResponse.json({ error: "Missing image or category" }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      // Demo mode
      const score = Math.floor(Math.random() * 31) + 60 // 60-90
      return NextResponse.json({
        score,
        feedback: `Buen reporte técnico en ${category}. Se observa conocimiento básico del área. Continúa documentando tus hallazgos de campo con mayor detalle en los parámetros operacionales.`,
      })
    }

    const systemPrompt = `Eres un Senior Field Engineer (Ingeniero de Campo Senior) evaluando el reporte de un junior. Tu tono es profesional, técnico y motivador. Evalúa la precisión técnica, orden en los datos y aplicabilidad al sector petrolero de la categoría: ${category}. Responde SOLO con JSON válido: {"score": <0-100>, "feedback": "<1-2 oraciones en español con terminología petrolera>"}`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: `Evalúa este reporte/evidencia técnica de la categoría "${category}".` },
              { type: "image_url", image_url: { url: image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}` } },
            ],
          },
        ],
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("OpenAI error:", err)
      const score = Math.floor(Math.random() * 31) + 60
      return NextResponse.json({
        score,
        feedback: `Evaluación en modo demo. Tu reporte de ${category} muestra potencial — sigue refinando los datos técnicos.`,
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content ?? ""

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return NextResponse.json({
          score: Math.max(0, Math.min(100, Number(parsed.score) || 50)),
          feedback: String(parsed.feedback || "Evaluación completada."),
        })
      }
    } catch {
      // fallback
    }

    return NextResponse.json({ score: 70, feedback: content.slice(0, 200) || "Evaluación completada." })
  } catch (error) {
    console.error("Evaluate error:", error)
    return NextResponse.json({ score: 65, feedback: "Error en la evaluación. Puntuación estimada asignada." })
  }
}
