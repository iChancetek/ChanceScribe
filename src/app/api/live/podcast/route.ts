import { NextRequest } from "next/server";
import { openai } from "@/agents/core/openai-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { transcript, mode, language } = await req.json();

    if (!transcript) {
      return new Response(JSON.stringify({ error: "No transcript provided" }), { status: 400 });
    }

    let script = "";
    const audioSegments: Buffer[] = [];

    if (mode === "recap") {
      // Alex & Sam Discussion Recap
      const scriptCompletion = await openai.chat.completions.create({
        model: "gpt-5.4",
        max_completion_tokens: 3000,
        messages: [
          {
            role: "system",
            content: `You are a podcast script writer. Create a debrief of the following conversation between two people.
Two hosts:
- **Alex**: The analytical host who summarizes the key points and takeaways.
- **Sam**: The reflective host who adds context and asks "what's next?".

Rules:
- Output in ${language || "English"}.
- Format as a dialogue: "ALEX: ..." and "SAM: ..."
- Keep it professional yet engaging.
- Total length: ~3-5 minutes of spoken content.

CONVERSATION TRANSCRIPT:
${transcript}`
          },
          { role: "user", content: "Generate the conversation recap script." }
        ],
      });

      script = scriptCompletion.choices[0]?.message?.content || "";
    } else {
      // Enhanced Replay Mode
      // We refine the transcript to be more "podcast-like" while keeping the original flow
      const scriptCompletion = await openai.chat.completions.create({
        model: "gpt-5.4",
        max_completion_tokens: 4000,
        messages: [
          {
            role: "system",
            content: `You are an audio producer. Clean up and organize the following raw conversation transcript into a high-quality "replayed" podcast script.
            
Rules:
- Keep the original flow but remove stutters, fillers, and clarify ambiguous sentences.
- Label the speakers as SPEAKER A and SPEAKER B.
- Format as "SPEAKER A: ..." and "SPEAKER B: ..."
- Language: ${language || "original languages used in transcript"}.

CONVERSATION TRANSCRIPT:
${transcript}`
          },
          { role: "user", content: "Generate the enhanced replay script." }
        ],
      });

      script = scriptCompletion.choices[0]?.message?.content || "";
    }

    // Step 2: Parse script into segments and generate audio
    const segments = script.split("\n").filter(line => line.trim());

    for (const segment of segments) {
      const isAlex = segment.trim().startsWith("ALEX:");
      const isSam = segment.trim().startsWith("SAM:");
      const isSpeakerA = segment.trim().startsWith("SPEAKER A:");
      const isSpeakerB = segment.trim().startsWith("SPEAKER B:");
      
      if (!isAlex && !isSam && !isSpeakerA && !isSpeakerB) continue;
      
      const text = segment.replace(/^(ALEX|SAM|SPEAKER A|SPEAKER B):\s*/i, "").trim();
      if (!text) continue;

      // Assign voices
      // Recap: Alex=Nova, Sam=Echo
      // Replay: Speaker A=Onyx, Speaker B=Shimmer (or similar)
      const voice = isAlex || isSpeakerA ? (mode === "recap" ? "nova" : "onyx") : (mode === "recap" ? "echo" : "shimmer");
      
      const audioResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: voice as any,
        input: text,
      });

      const buffer = Buffer.from(await audioResponse.arrayBuffer());
      audioSegments.push(buffer);
    }

    const fullAudio = Buffer.concat(audioSegments);

    return new Response(fullAudio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": fullAudio.byteLength.toString(),
        "x-transcript": encodeURIComponent(script),
      },
    });
  } catch (err: any) {
    console.error("Live Podcast generation error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
