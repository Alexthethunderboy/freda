import { ArrowLeft, BookOpen, ExternalLink, Network, Sparkles } from "lucide-react";
import Link from "next/link";
import { MindMap } from "@/components/ui/MindMap";
import { DigitalGarden } from "@/components/library/DigitalGarden";
import { SynthesisSpotlight } from "@/components/library/SynthesisSpotlight";

export const metadata = {
  title: "Library of Thought | Knowledge Graph",
  description: "A decentralized repository of synthesis, research fragments, and evolving ideas.",
};

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-[#000510] selection:bg-electric-storm/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-24 md:pt-32 space-y-24 md:space-y-32">
        <Link 
          href="/" 
          className="fixed top-24 left-4 md:left-8 flex items-center gap-2 text-neutral-500 hover:text-white transition-all z-40 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/5 hover:border-white/20 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-mono uppercase tracking-widest">../back</span>
        </Link>

        <div>
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 md:mb-20">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-electric-storm/20 to-purple-500/20 border border-white/10 flex items-center justify-center backdrop-blur-xl">
                  <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-electric-storm" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
                    Library of <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-storm to-purple-400">Thought</span>
                  </h1>
                  <p className="text-xs md:text-sm font-mono text-neutral-500 uppercase tracking-[0.3em] mt-1 md:mt-2">The Digital Garden v4.2</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-neutral-500 font-mono text-[10px] md:text-xs border border-white/5 py-1.5 px-4 rounded-full bg-white/5 backdrop-blur-md">
              <Network className="w-3 h-3 text-electric-storm animate-pulse" />
              GRAPH VIEW SYNCHRONIZED
            </div>
          </header>

          {/* Mind Map Section */}
          <section className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-electric-storm/10 via-transparent to-purple-500/10 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative">
              <MindMap />
            </div>
          </section>

          <div className="grid lg:grid-cols-2 gap-24 md:gap-32 mt-32">
            <section className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <Sparkles className="w-5 h-5 text-electric-storm" />
                   </div>
                   <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">Synthesis</h2>
                </div>
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl font-serif italic">
                  Connecting dots between history, ecology, and the systems we inhabit.
                </p>
              </div>
              <SynthesisSpotlight />
            </section>

            <section className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <Network className="w-5 h-5 text-purple-400" />
                   </div>
                   <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tight">The Garden</h2>
                </div>
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl font-serif italic">
                  Raw fragments, unlearning logs, and architectural sketches in progress.
                </p>
              </div>
              <DigitalGarden />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
