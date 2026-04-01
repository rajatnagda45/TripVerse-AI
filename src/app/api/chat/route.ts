import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
      return NextResponse.json({ error: "Missing Groq API Key" }, { status: 500 });
    }

    // Initialize Groq
    const groq = new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const systemMessage = {
      role: "system",
      content: "You are TripVerseAI, the official AI travel assistant for the TripVerse platform. Your goal is to help users plan trips, discover hidden gems, answer travel-related questions, and act as a friendly local guide. Keep your answers concise, helpful, and enthusiastic. Format your responses nicely with markdown. Only answer questions related to travel, geography, culture, food, and planning itineraries."
    };

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const content = completion.choices[0].message.content;

    return NextResponse.json({ 
      role: "assistant", 
      content: content 
    });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate response" }, { status: 500 });
  }
}
