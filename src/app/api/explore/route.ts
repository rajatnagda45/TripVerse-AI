import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { city } = await req.json();

    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
      return NextResponse.json({ error: "Please configure GROQ_API_KEY in .env.local" }, { status: 500 });
    }

    const unsplashApiKey = process.env.UNSPLASH_ACCESS_KEY;

    // Initialize Groq
    const groq = new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const systemPrompt = `You are a travel database API. Return a JSON object for: ${city}.
Return ONLY valid JSON with exactly this structure:
{
  "Things to do": [
    {
      "id": 1,
      "name": "famous attraction name",
      "rating": 4.8,
      "reviews": "10k",
      "type": "Attraction",
      "location": "neighborhood or area",
      "mentionedCount": 4,
      "description": "1 sentence perfect description"
    }
  ],
  "Restaurants": [
    // 6 items
  ],
  "Stays": [
    // 4 luxury items
  ]
}
Provide exactly 10 Things to do, 6 Restaurants, and 4 Stays.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: systemPrompt }],
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0].message.content || "{}";
    const result = JSON.parse(text);



    const FALLBACKS: Record<string, string[]> = {
      "Attraction": [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
        "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800",
        "https://images.unsplash.com/photo-1596423735880-5f2a689b903e?q=80&w=800",
        "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800",
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
        "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=800"
      ],
      "Restaurant": [
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800",
        "https://images.unsplash.com/photo-1538333581680-29ebc9096180?q=80&w=800",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800"
      ],
      "Stay": [
        "https://images.unsplash.com/photo-1566073171615-35c58dba5358?q=80&w=800",
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800"
      ]
    };

    // Enrich with Unsplash Photos
    async function getUnsplashPhotos(query: string, category: string, count: number = 1) {
      const type = category.toLowerCase().includes('restaurant') ? 'Restaurant' : 
                   category.toLowerCase().includes('hotel') || category.toLowerCase().includes('stay') ? 'Stay' : 'Attraction';
      const fallbackList = FALLBACKS[type] || FALLBACKS["Attraction"];
      const randomFallback = fallbackList[Math.floor(Math.random() * fallbackList.length)];

      if (!unsplashApiKey) return [randomFallback];
      try {
        const uRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`, {
          headers: { "Authorization": `Client-ID ${unsplashApiKey.trim()}` }
        });
        
        if (uRes.status === 403 || uRes.status === 429) {
          console.warn("Unsplash Rate Limit Hit. Using fallback.");
          return [randomFallback];
        }

        const uData = await uRes.json();
        if (uData.results && uData.results.length > 0) {
          return uData.results.map((p: any) => p.urls.regular);
        }
      } catch (e) {
        console.error("Unsplash Search Error:", query, e);
      }
      return [randomFallback];
    }

    const sections = ["Things to do", "Restaurants", "Stays"];
    await Promise.all(sections.map(async (section) => {
      if (!result[section]) return;
      await Promise.all(result[section].map(async (item: any) => {
        const query = `${item.name} ${city}`;
        const photos = await getUnsplashPhotos(query, section, 5);
        item.img = photos[0];
        item.gallery = photos.length > 1 ? photos.slice(1) : [photos[0], photos[0], photos[0], photos[0]];
      }));
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Explore API Error:", error.message);
    return NextResponse.json({ error: "Failed to load explore data", details: error.message }, { status: 500 });
  }
}
