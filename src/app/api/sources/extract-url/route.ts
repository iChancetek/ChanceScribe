import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    // Improved YouTube detection (handles shorts, live, mobile, and secondary params)
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/);
    
    if (ytMatch) {
      try {
        const { YoutubeTranscript } = await import("youtube-transcript");
        const transcript = await YoutubeTranscript.fetchTranscript(ytMatch[1]);
        const text = transcript.map((t: any) => t.text).join(" ");
        return NextResponse.json({ text, type: "youtube", title: `YouTube: ${ytMatch[1]}` });
      } catch (err: any) {
        console.warn("YouTube transcript fetch failed:", err);
        return NextResponse.json({ 
          error: "This YouTube video has no accessible transcript. Please try a different video or an article." 
        }, { status: 400 });
      }
    }

    // Regular URL → fetch HTML → strip tags
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await res.text();
    
    // Simple but effective HTML-to-text
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 50000); // Cap at ~50k chars to avoid token overflow

    return NextResponse.json({ text, type: "website", title: url });
    
  } catch (error: any) {
    console.error("URL extraction error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
