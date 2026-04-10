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
    <div className="flex flex-nowrap items-center gap-1 p-1 bg-white/10 rounded-full border border-white/10 overflow-x-auto scrollbar-hide max-w-full">
      {VOICES.map((voice) => (
        <button
          key={voice.id}
          onClick={() => onVoiceChange(voice.id)}
          className={cn(
            "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
            activeVoice === voice.id
              ? "bg-white text-black shadow-sm"
              : "text-white/80 hover:text-white hover:bg-white/5"
          )}
          title={voice.desc}
        >
          {voice.label}
        </button>
      ))}
    </div>
  );
}
