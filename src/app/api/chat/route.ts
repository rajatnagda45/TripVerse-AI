import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      return NextResponse.json({ error: "Missing OpenRouter API Key" }, { status: 500 });
    }

    // Add a system prompt to give the AI context about TripVerseAI
    const systemMessage = {
      role: "system",
      content: "You are TripVerseAI, the official AI travel assistant for the TripVerse platform. Your goal is to help users plan trips, discover hidden gems, answer travel-related questions, and act as a friendly local guide. Keep your answers concise, helpful, and enthusiastic. Format your responses nicely with markdown. Only answer questions related to travel, geography, culture, food, and planning itineraries."
    };

    const payload = {
      model: "google/gemini-2.5-flash", // We can use Gemini Flash via OpenRouter for fast responses
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 800,
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://tripverse.ai",
        "X-Title": "TripVerseAI Chatbot"
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch from OpenRouter");
    }

    return NextResponse.json({ 
      role: "assistant", 
      content: data.choices[0].message.content 
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
  }
}
