import { serve } from "serve";

serve(async (req) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Only POST method allowed", { status: 405 });
  }

  // Parse request body
  const { prompt } = await req.json().catch(() => ({}));

  if (!prompt) {
    return new Response("Missing 'prompt' in request body", { status: 400 });
  }

  // Get Gemini API key from environment
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
  if (!GEMINI_API_KEY) {
    return new Response("Missing Gemini API key", { status: 500 });
  }

  // Call Gemini API
  const geminiRes = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
      GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  const data = await geminiRes.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
