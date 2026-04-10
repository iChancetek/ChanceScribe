"use client";

import { cn } from "@/lib/utils";

const LANGUAGES = [
  { id: "English", label: "English", icon: "🇺🇸" },
  { id: "Spanish", label: "Español", icon: "🇪🇸" },
  { id: "French", label: "Français", icon: "🇫🇷" },
  { id: "Mandarin", label: "中文", icon: "🇨🇳" },
];

interface LanguageSelectorProps {
  activeLanguage: string;
  onLanguageChange: (id: string) => void;
}

export function LanguageSelector({ activeLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex flex-nowrap items-center gap-1 p-1 bg-white/10 rounded-full border border-white/10 overflow-x-auto scrollbar-hide max-w-full">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.id}
          onClick={() => onLanguageChange(lang.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all",
            activeLanguage === lang.id
              ? "bg-white text-black shadow-sm"
              : "text-white/80 hover:text-white hover:bg-white/5"
          )}
          title={lang.label}
        >
          <span>{lang.icon}</span>
          <span className="whitespace-nowrap">{lang.label}</span>
        </button>
      ))}
    </div>
  );
}
