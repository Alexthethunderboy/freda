'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Book, Info, CheckCircle2, FlaskConical, Microscope, Bookmark } from 'lucide-react';

const researchData = [
  {
    category: "Cannabis",
    facts: [
      {
        id: "c1",
        title: "The Entourage Effect",
        summary: "The theory that cannabis compounds work better together than in isolation.",
        details: "Research suggests that cannabinoids like THC and CBD, when combined with terpenes (aromatic oils), produce a synergistic effect that enhances therapeutic benefits and modulates psychoactive intensity. This is why full-spectrum extracts are often preferred over distillates.",
        source: "Scientific Reports (2020)",
        didYouKnow: "There are over 100 known cannabinoids and 150+ terpenes in the cannabis plant."
      },
      {
        id: "c2",
        title: "Neurogenesis & CBD",
        summary: "CBD has been shown to promote the birth of new neurons in the hippocampus.",
        details: "Unlike some substances that decrease neural plasticity, CBD may actually support brain health by promoting neurogenesis, particularly in areas associated with emotion and memory. This is part of why it's studied for its anti-anxiety effects.",
        source: "Journal of Neuropharmacology",
        didYouKnow: "The human brain has more cannabinoid receptors than any other G protein-coupled receptor type."
      }
    ]
  },
  {
    category: "Psychedelics",
    facts: [
      {
        id: "p1",
        title: "Psilocybin & Neuroplasticity",
        summary: "Psilocybin induces rapid and sustained growth of neural connections.",
        details: "Studies from Yale and Johns Hopkins show that a single dose of psilocybin can increase the density and strength of synaptic spines in the prefrontal cortex, effectively 'resetting' neural pathways and increasing cognitive flexibility.",
        source: "Neuron (2021)",
        didYouKnow: "Psilocybin-containing mushrooms have been used in indigenous rituals for at least 6,000 years."
      },
      {
        id: "p2",
        title: "DMT & Endogenous Presence",
        summary: "DMT is a naturally occurring compound found in many plants and animals.",
        details: "N,N-Dimethyltryptamine is endogenous to the human body, with trace amounts detected in the brain and lungs. Its biological function remains a mystery, though theories suggest a role in dreaming or near-death experiences.",
        source: "Journal of Biological Chemistry",
        didYouKnow: "DMT is structurally near-identical to Serotonin and Melatonin."
      }
    ]
  }
];

export function ResearchTome() {
  const [activeTab, setActiveTab] = useState<'Cannabis' | 'Psychedelics'>('Cannabis');
  const [selectedFact, setSelectedFact] = useState<string | null>(null);

  const currentCategory = researchData.find(d => d.category === activeTab);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      <div className="flex justify-center gap-4">
        {['Cannabis', 'Psychedelics'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any);
              setSelectedFact(null);
            }}
            className={`px-6 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all border ${
              activeTab === tab 
                ? 'bg-green-500 text-green-950 border-green-500 font-bold shadow-[0_0_20px_rgba(74,222,128,0.3)]' 
                : 'bg-white/5 text-neutral-500 border-white/10 hover:border-white/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {currentCategory?.facts.map((fact, i) => (
          <motion.div
            key={fact.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`group relative p-8 rounded-3xl border transition-all cursor-pointer overflow-hidden ${
              selectedFact === fact.id 
                ? 'bg-green-500/10 border-green-500/40' 
                : 'bg-white/2 border-white/5 hover:border-white/10'
            }`}
            onClick={() => setSelectedFact(selectedFact === fact.id ? null : fact.id)}
          >
            <div className="absolute top-4 right-4 text-neutral-700 group-hover:text-green-500/40 transition-colors">
              <Microscope className="w-5 h-5" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Documented Fact</span>
              </div>
              
              <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{fact.title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed font-mono">
                {fact.summary}
              </p>

              <AnimatePresence>
                {selectedFact === fact.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-4 pt-4 border-t border-white/5 overflow-hidden"
                  >
                    <p className="text-xs text-neutral-300 leading-relaxed italic">
                      {fact.details}
                    </p>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-500 uppercase">
                          <Bookmark className="w-3 h-3" />
                          Source: {fact.source}
                       </div>
                    </div>
                    <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 flex gap-3">
                       <Info className="w-4 h-4 text-green-500 shrink-0" />
                       <div className="space-y-1">
                          <div className="text-[9px] font-bold text-green-500 uppercase">Did You Know?</div>
                          <div className="text-[10px] text-neutral-400 leading-tight">{fact.didYouKnow}</div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="absolute bottom-4 right-4 text-[8px] font-mono text-neutral-700 uppercase">
              {selectedFact === fact.id ? 'Click to hide' : 'Click to expand details'}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-black/40 border border-white/5 rounded-3xl p-8 backdrop-blur-md flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-green-500/20 to-green-500/5 flex items-center justify-center border border-green-500/20 shrink-0">
          <Book className="w-8 h-8 text-green-500" />
        </div>
        <div className="space-y-2 flex-1 text-center md:text-left">
          <h4 className="text-lg font-bold text-white">The Researcher's Oath</h4>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Every piece of data in this corner is cross-referenced with modern pharmacological studies and indigenous historical accounts. Knowledge is the first step toward decriminalization.
          </p>
        </div>
        <button className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-mono uppercase tracking-[0.2em] hover:bg-white text-black transition-all bg-white font-bold">
          Download PDF Tome
        </button>
      </div>
    </div>
  );
}
