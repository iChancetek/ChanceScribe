"use client";

import { cn } from "@/lib/utils";

const VOICES = [
  { id: "nova", label: "Nova", desc: "Calm female" },
  { id: "alloy", label: "Alloy", desc: "Neutral" },
  { id: "echo", label: "Echo", desc: "Warm male" },
  { id: "fable", label: "Fable", desc: "Expressive" },
  { id: "onyx", label: "Onyx", desc: "Deep male" },
  { id: "shimmer", label: "Shimmer", desc: "Bright female" },
];

interface VoiceSelectorProps {
  activeVoice: string;
  onVoiceChange: (id: string) => void;
}

export function VoiceSelector({ activeVoice, onVoiceChange }: VoiceSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-full border border-black/5">
      {VOICES.map((voice) => (
        <button
          key={voice.id}
          onClick={() => onVoiceChange(voice.id)}
          className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
            activeVoice === voice.id
              ? "bg-white text-primary shadow-sm"
              : "text-foreground/40 hover:text-foreground/70"
          )}
          title={voice.desc}
        >
          {voice.label}
        </button>
      ))}
    </div>
  );
}
