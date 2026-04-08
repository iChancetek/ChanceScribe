"use client";

import { useState } from "react";
import { Mic, BookOpen, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { StreamingAudioRecorder } from "@/components/StreamingAudioRecorder";
import { SourceUploader, Source } from "@/components/SourceUploader";
import { ResearchChat } from "@/components/ResearchChat";
import { DeepDive } from "@/components/DeepDive";
import { HistoryDashboard } from "@/components/HistoryDashboard";
import { ToneSelector } from "@/components/ToneSelector";
import { LanguageSelector } from "@/components/LanguageSelector";
import Link from "next/link";

const TABS = [
  { id: "flow", label: "Flow", icon: Mic },
  { id: "research", label: "Research", icon: BookOpen },
  { id: "deepdive", label: "Deep Dive", icon: Headphones },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("flow");
  const [sources, setSources] = useState<Source[]>([]);
  const [activeTone, setActiveTone] = useState("professional");
  const [activeLanguage, setActiveLanguage] = useState("English");

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent/10 selection:text-primary relative overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(18,18,18,0.01),transparent_40%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-bold tracking-tight hover:opacity-70 transition-opacity">
            ChanceScribe
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-500/5 text-green-600 border border-green-500/10 rounded-full text-[10px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              GPT-5.4
            </span>
            <div className="w-8 h-8 rounded-full bg-secondary border border-black/5 flex items-center justify-center text-xs font-bold shadow-sm">
              C
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="flex items-center justify-center gap-1 p-1 bg-secondary/40 rounded-full border border-black/5 w-fit mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                activeTab === tab.id
                  ? "bg-white text-primary shadow-sm"
                  : "text-foreground/40 hover:text-foreground/70"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Shared Controls (Tone + Language) for Research & Deep Dive */}
        {activeTab !== "flow" && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <ToneSelector activeTone={activeTone} onToneChange={setActiveTone} />
            <LanguageSelector activeLanguage={activeLanguage} onLanguageChange={setActiveLanguage} />
          </div>
        )}

        {/* === FLOW TAB === */}
        {activeTab === "flow" && (
          <section className="space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-serif italic text-primary">Your Workspace</h2>
              <p className="text-foreground/40 font-medium">Dictate, type, or paste — GPT-5.4 handles the rest.</p>
            </div>
            <StreamingAudioRecorder />

            <section className="pt-16 border-t border-black/5">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-foreground/30">Past Sessions</h3>
                <button className="text-xs font-semibold text-accent hover:underline underline-offset-4">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <HistoryDashboard />
              </div>
            </section>
          </section>
        )}

        {/* === RESEARCH TAB === */}
        {activeTab === "research" && (
          <section className="space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-serif italic text-primary">Research</h2>
              <p className="text-foreground/40 font-medium">Upload sources and let AI become your research partner.</p>
            </div>

            <SourceUploader sources={sources} onSourcesChange={setSources} maxSources={10} />

            <ResearchChat sources={sources} tone={activeTone} language={activeLanguage} />
          </section>
        )}

        {/* === DEEP DIVE TAB === */}
        {activeTab === "deepdive" && (
          <section className="space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-4xl md:text-5xl font-serif italic text-primary">Deep Dive</h2>
              <p className="text-foreground/40 font-medium">Generate an AI podcast discussion from your research sources.</p>
            </div>

            <DeepDive sources={sources} language={activeLanguage} />
          </section>
        )}
      </div>
    </main>
  );
}
