import { ArrowLeft, Beaker, Brain, Leaf, Activity, Info } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TerpeneWheel } from "@/components/psychonaut/TerpeneWheel";
import { UnlearnTimeline } from "@/components/psychonaut/UnlearnTimeline";
import { DMNVisualizer } from "@/components/psychonaut/DMNVisualizer";
import { KnowledgeTicker } from "@/components/psychonaut/KnowledgeTicker";
import { TripSitter } from "@/components/psychonaut/TripSitter";

export default function PsychonautPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500/30">
      <Link href="/" className="fixed top-24 left-4 md:left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors z-50">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs uppercase tracking-widest font-mono">Back</span>
      </Link>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-green-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-[10px] uppercase tracking-[0.2em] font-mono">
            <Activity className="w-3 h-3" />
            Biological Research Mode
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">
            The Psychonaut <span className="text-green-500">Corner</span>
          </h1>
          
          <p className="text-xl text-neutral-400 font-serif italic max-w-2xl mx-auto leading-relaxed">
            "We are not exploring chemicals; we are exploring the architecture of our own consciousness."
          </p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 pb-32">
        
        {/* Row 1: Terpene Wheel & Intro */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center p-4 md:p-8 border border-white/5 bg-white/2 rounded-[32px] backdrop-blur-xl group overflow-hidden relative min-h-[400px] md:min-h-[600px]">
          <div className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-white/40">
            <Beaker className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-mono">The Terpene Lab</span>
          </div>
          <TerpeneWheel />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-8">
          <div className="p-6 md:p-8 border border-white/5 bg-white/2 rounded-[32px] backdrop-blur-xl relative overflow-hidden h-full">
            <div className="flex items-center gap-2 text-white/40 mb-4 md:mb-6">
              <Info className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-mono">Mission Statement</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-400">Bio-Digital Stance</h2>
            <p className="text-neutral-400 leading-relaxed text-sm font-serif italic mb-6">
              I am a proud enthusiast and activist fighting for legalization, education, and the safe exploration of consciousness. 
              This is the intersection of indigenous wisdom and modern laboratory science.
            </p>
            <div className="space-y-3 md:space-y-4">
              {['Scientific Accuracy', 'Historical Reclamation', 'Safety First'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs font-mono text-white/60">
                  <div className="w-1 h-1 rounded-full bg-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          
          {/* Small DMN Callout */}
          <div className="p-5 md:p-6 border border-purple-500/20 bg-purple-500/5 rounded-[32px] backdrop-blur-xl">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Brain className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-mono">Neuro-Insight</span>
            </div>
            <p className="text-xs text-purple-300/70">
              Psilocybin and LSD suppress the DMN, allowing for global cross-connectivity between brain regions.
            </p>
          </div>
        </div>

        {/* Row 2: DMN Visualizer & Timeline */}
        <div className="lg:col-span-5">
          <DMNVisualizer />
        </div>

        <div className="lg:col-span-7 p-6 md:p-12 border border-white/5 bg-white/2 rounded-[32px] backdrop-blur-xl overflow-hidden relative">
          <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-white/40">
            <Leaf className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-mono">Unlearn Naija Timeline</span>
          </div>
          <div className="mt-8 md:mt-12 scale-90 md:scale-100 origin-top">
            <UnlearnTimeline />
          </div>
        </div>
      </div>

      {/* Floating Utilities */}
      <TripSitter />
      
      {/* Footer Ticker */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        <KnowledgeTicker />
      </div>
    </div>
  );
}
