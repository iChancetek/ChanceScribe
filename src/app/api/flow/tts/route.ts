import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/agents/core/openai-client";

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json();

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    const selectedVoice = voice || "nova";

    const mp3Response = await openai.audio.speech.create({
      model: "tts-1",
      voice: selectedVoice as any,
      input: text,
    });

    const buffer = await mp3Response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.byteLength.toString(),
      },
    });

  } catch (error: any) {
    console.error("TTS Pipeline Error:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
