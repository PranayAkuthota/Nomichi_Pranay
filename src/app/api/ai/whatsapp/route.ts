import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  // Auth check — only authenticated users can use this
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { traveller_name, trip_name, trip_destination, trip_dates, trip_feeling, group_type } = body;

  if (!traveller_name || !trip_name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const prompt = `You are writing a first WhatsApp message from the Nomichi team to a traveller who has sent an enquiry.

Traveller name: ${traveller_name}
Travelling as: ${group_type}
Trip: ${trip_name} (${trip_destination})
Trip dates: ${trip_dates}
What they wrote about what they want: "${trip_feeling}"

Write a warm, short, honest, specific first message. Use second person. Keep it to 3-4 sentences.

Rules:
- No exclamation marks
- No em dashes
- No marketing language (no "embark", "unlock", "elevate", "journey" as a cliché)
- Address them by first name
- Reference something specific from what they wrote
- End with a simple next step (a question or a soft ask to get on a call)
- Sound like a real person, not a template
- Do not use bullet points

Return only the message text, nothing else.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content?.trim();
    if (!message) throw new Error("Empty response from OpenAI");

    return NextResponse.json({ message });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ error: "Failed to generate message" }, { status: 500 });
  }
}
