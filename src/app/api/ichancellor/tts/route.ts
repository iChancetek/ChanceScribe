import { NextRequest, NextResponse } from "next/server";
import { runTTS } from "@/agents/tts-agent";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { text, voice = "nova" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Call OpenAI TTS agent
    const response = await runTTS(text, voice);

    // Stream the audio back to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (err: any) {
    console.error("iChancellor TTS error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
