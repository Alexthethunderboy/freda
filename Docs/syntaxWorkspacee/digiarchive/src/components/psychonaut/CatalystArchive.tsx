'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RadarChart } from '../ui/RadarChart';
import { Leaf, Music, BookOpen, Info, FlaskConical } from 'lucide-react';
import { useState } from 'react';

const catalysts = [
  {
    id: 1,
    name: "Durban Poison",
    type: "Strain",
    description: "The 'espresso' of cannabis. Pure sativa lineage from South Africa.",
    researchFact: "High levels of Terpinolene and THCV, often called the 'sports car' of cannabinoids for its clear-headed, energetic stimulation without the foggy crash.",
    metrics: [
      { label: "Uplift", value: 0.95 },
      { label: "Focus", value: 0.8 },
      { label: "Exploration", value: 0.6 },
      { label: "Rest", value: 0.2 }
    ],
    icon: Leaf,
    color: "#4ade80"
  },
  {
    id: 2,
    name: "The Doors - L.A. Woman",
    type: "Music",
    description: "Deep, bluesy rhythms that ground the wandering mind.",
    researchFact: "Rhythmic entrainment with 4/4 blues patterns has been shown to stabilize alpha brain waves, facilitating a 'flow state' ideal for introspective thought.",
    metrics: [
      { label: "Uplift", value: 0.6 },
      { label: "Focus", value: 0.4 },
      { label: "Exploration", value: 0.9 },
      { label: "Rest", value: 0.5 }
    ],
    icon: Music,
    color: "#818cf8"
  },
  {
    id: 3,
    name: "The Doors of Perception",
    type: "Book",
    description: "Aldous Huxley's classic exploration of mescaline and consciousness.",
    researchFact: "Huxley's 'reducing valve' theory predicted modern findings on the Default Mode Network (DMN), where psychedelics inhibit filters to allow more raw sensory input.",
    metrics: [
      { label: "Uplift", value: 0.3 },
      { label: "Focus", value: 0.7 },
      { label: "Exploration", value: 1.0 },
      { label: "Rest", value: 0.4 }
    ],
    icon: BookOpen,
    color: "#fbbf24"
  }
];

export function CatalystArchive() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {catalysts.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative p-8 rounded-[2.5rem] border border-white/5 bg-white/2 hover:bg-white/5 transition-all flex flex-col items-center text-center perspective-1000"
        >
          <div className="absolute top-6 right-6 text-white/10 group-hover:text-green-500/40 transition-colors">
            <item.icon className="w-6 h-6" />
          </div>

          <AnimatePresence mode="wait">
            {hoveredId === item.id ? (
              <motion.div
                key="fact"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                className="h-[240px] flex flex-col items-center justify-center p-4 space-y-4"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                  <FlaskConical className="w-5 h-5 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono text-green-500 uppercase tracking-widest font-bold">Research Note</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-mono italic">
                    "{item.researchFact}"
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="viz"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                className="h-[240px] flex items-center justify-center"
              >
                <RadarChart data={item.metrics} color={item.color} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">{item.type}</span>
            <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">{item.name}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono tracking-tight line-clamp-2">{item.description}</p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-[8px] font-mono text-neutral-600 uppercase tracking-widest transition-opacity group-hover:opacity-0">
             <Info className="w-3 h-3" />
             Hover for research
          </div>
        </motion.div>
      ))}
    </div>
  );
}
