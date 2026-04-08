"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, BookOpen, GraduationCap, LayoutGrid, Lightbulb, PenTool, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Source } from "./SourceUploader";

const MODES = [
  { id: "summarize", label: "Summarize", icon: BookOpen, color: "text-blue-500" },
  { id: "study", label: "Study", icon: GraduationCap, color: "text-green-500" },
  { id: "organize", label: "Organize", icon: LayoutGrid, color: "text-purple-500" },
  { id: "create", label: "Create", icon: Lightbulb, color: "text-yellow-500" },
  { id: "rewrite", label: "Rewrite", icon: PenTool, color: "text-orange-500" },
];

interface ResearchChatProps {
  sources: Source[];
  tone: string;
  language: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function ResearchChat({ sources, tone, language }: ResearchChatProps) {
  const [activeMode, setActiveMode] = useState("summarize");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const processMode = async (mode: string, question?: string) => {
    if (sources.length === 0) return;
    setIsStreaming(true);

    if (question) {
      setMessages((prev) => [...prev, { role: "user", content: question }]);
    } else {
      setMessages((prev) => [...prev, { role: "user", content: `[${mode.toUpperCase()}] Process all sources.` }]);
    }

    try {
      const res = await fetch("/api/sources/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: sources.map((s) => ({ id: s.id, title: s.title, text: s.text })),
          mode,
          tone,
          language,
          question,
        }),
      });

      if (!res.body) throw new Error("No response stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      // Add empty assistant message to stream into
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: fullText };
          return updated;
        });
      }
    } catch (err) {
      console.error("Research chat error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to process sources." }]);
    }
    setIsStreaming(false);
  };

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    const question = input.trim();
    setInput("");
    processMode("ask", question);
  };

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="flex flex-wrap items-center gap-2">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => {
              setActiveMode(mode.id);
              processMode(mode.id);
            }}
            disabled={isStreaming || sources.length === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
              activeMode === mode.id
                ? "bg-white border-black/10 shadow-sm"
                : "border-transparent hover:bg-secondary/50 text-foreground/50",
              (isStreaming || sources.length === 0) && "opacity-40 cursor-not-allowed"
            )}
          >
            <mode.icon className={cn("w-3.5 h-3.5", mode.color)} />
            {mode.label}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div className="writing-pad !p-6 min-h-[300px] max-h-[500px] overflow-y-auto space-y-6">
        {messages.length === 0 && (
          <div className="h-[250px] flex flex-col items-center justify-center text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-foreground/15" />
            <div>
              <h4 className="text-sm font-bold text-foreground/40">Upload sources, then ask anything</h4>
              <p className="text-xs text-foreground/30 mt-1">Or click a mode above to auto-analyze your documents.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-secondary/50 text-primary/90 border border-black/5"
              )}
            >
              <div className="whitespace-pre-wrap font-serif">{msg.content}</div>
              {msg.role === "assistant" && isStreaming && i === messages.length - 1 && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-accent/40 animate-pulse rounded-full align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={sources.length === 0 ? "Add sources first..." : "Ask a question about your sources..."}
          disabled={isStreaming || sources.length === 0}
          className="flex-1 px-5 py-3 bg-white border border-black/5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 placeholder:text-foreground/30 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={isStreaming || !input.trim() || sources.length === 0}
          className="px-5 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
