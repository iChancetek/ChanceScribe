import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8 overflow-hidden font-sans">
      {/* Subtle organic movement for Flow backdrop */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(18,18,18,0.02),transparent_40%)] pointer-events-none" />
      
      <main className="relative z-10 max-w-4xl text-center space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-serif italic text-primary leading-[1.1]">
            Don&apos;t type, <br/>
            just <span className="text-accent underline decoration-1 underline-offset-8">speak.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed">
            The GPT-5.4 powered dictation tool that turns rambled speech into polished, structured writing.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:scale-[1.02] transition-transform shadow-xl shadow-black/10">
            Open your Flow
          </Link>
          <a href="#" className="text-lg font-medium text-foreground/40 hover:text-foreground transition-colors group">
            How it works <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        <div className="pt-24 opacity-30">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/80">
            Frictionless Intelligence &bull; Privacy-Native &bull; SOC2
          </p>
        </div>
      </main>

      {/* Floating abstract shape for premium feel */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-50" />
    </div>
  );
}
