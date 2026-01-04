import { ArrowLeft, Construction, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { JournalSection } from "@/components/unlearn/JournalSection";
import { ParadigmShifter } from "@/components/unlearn/ParadigmShifter";
import { ActivistLedger } from "@/components/unlearn/ActivistLedger";

export const metadata = {
  title: "Unlearn Naija | The ThunderSpace",
  description: "Dismantling paradigms and rethinking our shared history.",
};

export default function UnlearnPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      <Link href="/" className="fixed top-24 left-4 md:left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors z-20">
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </Link>
      
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 py-20">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500 blur-[80px] opacity-20" />
          <Sparkles className="w-20 h-20 text-yellow-500 relative z-10" />
        </div>

        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-yellow-100">
            Unlearn Naija
          </h1>
          <div className="flex items-center justify-center gap-2 text-yellow-500/70 font-mono text-xs border border-yellow-500/30 p-2 rounded bg-yellow-900/10 w-fit mx-auto">
            <span className="animate-pulse">●</span>
            <span>LIVE INTERACTIVE MODULES ENABLED</span>
          </div>
          <p className="text-xl text-neutral-300">
            A digital platform dedicated to cultural re-education, dismantling societal programming, and community activism.
          </p>
          <div className="pt-4">
             <a 
               href="https://unlearn-archive.vercel.app" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/50 rounded-lg transition-all"
             >
               <span>Visit Full Archive</span>
               <ExternalLink className="w-4 h-4" />
             </a>
          </div>
        </div>
      </div>

      <div className="space-y-32">
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">The Paradigm Shifter</h2>
              <p className="text-neutral-500 max-w-lg">
                Interact with the slider to see how "unlearning" changes our perspective on societal structures.
              </p>
            </div>
          </div>
          <ParadigmShifter />
        </section>

        <section>
          <ActivistLedger />
        </section>

        <section className="border-t border-white/10 pt-12">
          <JournalSection />
        </section>
      </div>
    </div>
  );
}
