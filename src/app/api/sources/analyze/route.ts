import { NextRequest } from "next/server";
import { openai } from "@/agents/core/openai-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { sources, mode, tone, language, question, messages: history, imageBase64 } = await req.json();

    // Combine all source texts with attribution markers
    const sourcesContext = (sources as { id: string; title: string; text: string }[])
      .map((s, i) => `[Source ${i + 1}: ${s.title}]\n${s.text.substring(0, 12000)}`)
      .join("\n\n---\n\n");

    const modeInstructions: Record<string, string> = {
      summarize: `Provide a comprehensive summary of the sources. Extract key takeaways, main themes, and action items. Use bullet points for clarity.`,
      study: `Act as a patient tutor. Explain the key concepts from the sources in simple, accessible terms. Provide real-world examples and analogies. End with 3 quiz questions to test understanding.`,
      organize: `Create a polished presentation outline from the sources. Include: Title, key sections with talking points, supporting evidence from the sources, and a conclusion. Format with clear hierarchy.`,
      create: `Analyze the sources for hidden patterns, emerging trends, and unexplored connections. Generate creative ideas, new angles, and innovative opportunities based on this analysis.`,
      rewrite: `Rewrite and restructure the content from the sources into a cohesive, polished document.`,
      ask: `You are a conversational AI assistant grounded in the user's research sources. Answer the user's question using ONLY information from the provided sources. Cite sources using [Source N] notation. If the sources contain no relevant information, clearly say so but be helpful. Respond in a warm, clear, conversational tone — like a knowledgeable colleague.`,
    };

    const activeMode = question || history?.length > 0 ? "ask" : (mode || "summarize");

    const systemPrompt = `You are WorkSpaceIQ's AI Research Assistant — warm, sharp, and conversational.
You have deep expertise grounded in the user's uploaded sources below.

INSTRUCTIONS:
${modeInstructions[activeMode] || modeInstructions.summarize}

TONE: ${tone || "professional"} — calm, clear, human. Not robotic.
LANGUAGE: Respond in ${language || "English"}.

CITATION RULES:
- Reference sources using [Source N] notation.
- Quote key passages when highly relevant.
- Never fabricate information not found in the sources.

SOURCES:
${sourcesContext}`;

    // Build conversation messages — support vision payloads
    const conversationMessages: any[] = [];

    // Map prior history (last 10 turns)
    if (history && history.length > 0) {
      for (const msg of history.slice(-10)) {
        conversationMessages.push({ role: msg.role, content: msg.content });
      }
    }

    // Build the latest user message — with optional vision
    if (question || imageBase64) {
      const userContent: any[] = [];

      if (question) {
        userContent.push({ type: "text", text: question });
      }

      if (imageBase64) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: imageBase64, // expects "data:image/jpeg;base64,..." format
            detail: "high",
          },
        });
        if (!question) {
          userContent.push({ type: "text", text: "Analyze this image in the context of my research sources." });
        }
      }

      conversationMessages.push({ role: "user", content: userContent });
    } else if (!history || history.length === 0) {
      conversationMessages.push({ role: "user", content: `Process these sources in "${activeMode}" mode.` });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4",
      max_completion_tokens: 4000,
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationMessages,
      ],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) controller.enqueue(new TextEncoder().encode(text));
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error("Source analysis error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
