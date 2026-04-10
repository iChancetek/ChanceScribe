import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    // Validate URL format
    try { new URL(url); } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Improved YouTube detection (handles shorts, live, mobile, and secondary params)
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);

    if (ytMatch) {
      try {
        const { YoutubeTranscript } = await import("youtube-transcript");
        const transcript = await YoutubeTranscript.fetchTranscript(ytMatch[1]);
        const text = transcript.map((t: any) => t.text).join(" ");
        return NextResponse.json({ text, type: "youtube", title: `YouTube: ${ytMatch[1]}` });
      } catch (err: any) {
        console.warn("YouTube transcript fetch failed, falling back to OpenAI:", err);
        try {
          const { openai } = await import("@/agents/core/openai-client");
          const completion = await openai.chat.completions.create({
            model: "gpt-5.4",
            messages: [
              { role: "system", content: "You are an AI research assistant. Provide a highly detailed summary and breakdown of the contents of the provided YouTube video URL. Extract any known key points, segments, or factual information available about this specific video based on its ID/URL." },
              { role: "user", content: `Please transcribe or summarize the contents of this YouTube video: ${url}` }
            ]
          });
          const fallbackText = completion.choices[0]?.message?.content || "Could not retrieve summary via fallback.";
          return NextResponse.json({
            text: fallbackText + "\n\n[Note: This is an AI-generated summary as the exact transcript was unavailable.]",
            type: "youtube",
            title: `YouTube: ${ytMatch[1]}`
          });
        } catch (fallbackErr: any) {
          console.error("OpenAI fallback also failed:", fallbackErr);
          return NextResponse.json({
            error: "This YouTube video has no accessible transcript, and the AI fallback failed. Please try a different video or an article."
          }, { status: 400 });
        }
      }
    }

    // Regular URL → fetch HTML with 10s timeout
    const abortCtrl = new AbortController();
    const timeoutId = setTimeout(() => abortCtrl.abort(), 10_000);

    let html = "";
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; WorkspaceIQ-Bot/1.0; +https://workspaceiq.us)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: abortCtrl.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        return NextResponse.json({ error: `Site responded with ${res.status}. The page may be private or restricted.` }, { status: 400 });
      }
      html = await res.text();
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === "AbortError") {
        return NextResponse.json({ error: "Request timed out. The site took too long to respond." }, { status: 408 });
      }
      throw fetchErr;
    }

    // Extract proper page title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const pageTitle = titleMatch
      ? titleMatch[1].replace(/\s+/g, " ").trim().slice(0, 120)
      : url;

    // HTML to text — strip scripts, styles, tags
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 50000); // Cap at ~50k chars to avoid token overflow

    return NextResponse.json({ text, type: "website", title: pageTitle });

  } catch (error: any) {
    console.error("URL extraction error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

