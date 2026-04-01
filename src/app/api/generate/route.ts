import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city, budget, mood, duration, group_type } = body;

    if (!city || !budget || !mood) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY!;
    const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY!;
    const GROQ_API_KEY = process.env.GROQ_API_KEY!;

    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
      return NextResponse.json({ error: "Please configure GROQ_API_KEY in .env.local" }, { status: 500 });
    }

    // Initialize Groq
    const groq = new OpenAI({
      apiKey: GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    // 1. Geocoding
    const geoResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&format=json&apiKey=${GEOAPIFY_API_KEY}`
    );
    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }
    const { lat, lon } = geoData.results[0];

    // 2. Weather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const weatherData = await weatherResponse.json();
    const isRaining = weatherData.weather[0].main.toLowerCase().includes('rain');

    // 3. Places
    let categories = 'tourism.sights,entertainment,leisure';
    if (isRaining) categories = 'entertainment.museum,entertainment.cinema,catering';
    if (mood === 'Party') categories += ',entertainment.nightclub,catering.bar';
    if (mood === 'Romantic') categories += ',catering.restaurant';

    const placesResponse = await fetch(
      `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},5000&limit=50&apiKey=${GEOAPIFY_API_KEY}`
    );
    const placesData = await placesResponse.json();
    
    const validPlaces = (placesData.features || [])
      .map((f: any) => f.properties.name)
      .filter(Boolean)
      .slice(0, 15);

    // 4. Prompt
    const systemPrompt = `You are a premium, context-aware AI travel planner specializing in Indian and global travel. 
Generate a comprehensive, hyper-personalized itinerary based on the user's constraints.
All prices MUST be consistently estimated in Indian Rupees (₹).
Output raw JSON ONLY using exactly this structure:
{
  "title": "A captivating title",
  "summary": "Short emotional hook",
  "budget_breakdown": { "food": "₹X", "activities": "₹Y", "transport": "₹Z", "total": "₹Total" },
  "days": [
    {
      "day": "Day 1",
      "theme": "Theme of the day",
      "timeline": [
        {
          "time_of_day": "Morning",
          "time": "09:00 AM",
          "title": "Place/Activity Title",
          "description": "Emotional, sensory description",
          "cost": "₹Estimated price",
          "tags": ["hidden gem", "budget friendly"]
        }
      ]
    }
  ]
}
No markdown formatting, just parseable JSON. Ensure times flow chronologically.
Group Type: ${group_type}. Duration: ${duration}.
Generate Day 1, Day 2, etc up to the specified duration.`;

    const userPrompt = `
City: ${city}
Budget: ${budget}
Mood: ${mood}
Current Weather: ${weatherData.weather[0].description}, ${weatherData.main.temp}°C
Candidate Places to include: ${validPlaces.join(', ')}
    `;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const rawResponse = completion.choices[0].message.content || "{}";
    const itinerary = JSON.parse(rawResponse);

    // Save to DB (if logged in)
    const { userId } = body;
    const supabase = await createClient();

    if (userId) {
      await supabase.from('itineraries').insert({
        user_id: userId,
        city,
        budget,
        mood,
        duration,
        group_type,
        data: itinerary,
      });
    }

    return NextResponse.json({ itinerary, weather: weatherData });

  } catch (error: any) {
    console.error('Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate itinerary' }, { status: 500 });
  }
}
