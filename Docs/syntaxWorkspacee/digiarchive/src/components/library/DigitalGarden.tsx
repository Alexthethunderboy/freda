'use client';

import { motion } from 'framer-motion';
import { Sprout, Leaf, TreePine, Timer } from 'lucide-react';

const notes = [
  {
    id: 1,
    title: "The decentralization of Lagos tech",
    content: "Moving away from Yaba isn't just a physical shift, it's a mental one. We are building borderless.",
    status: "Seedling",
    tags: ["Urbanism", "Tech"],
    updated: "2h ago"
  },
  {
    id: 2,
    title: "AI as an Ancestral Medium",
    content: "If we train models on oral histories, can we converse with the past in a way that feels human?",
    status: "Budding",
    tags: ["AI", "Philosophy"],
    updated: "1d ago"
  },
  {
    id: 3,
    title: "The Ethics of Open Source Activism",
    content: "Transparency is a weapon. But who does it protect when the systems are already rigged?",
    status: "Evergreen",
    tags: ["Open Source", "Activism"],
    updated: "1w ago"
  }
];

const statusStyles = {
  Seedling: "bg-green-500/10 text-green-500 border-green-500/20",
  Budding: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Evergreen: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
};

const statusIcons = {
  Seedling: Sprout,
  Budding: Leaf,
  Evergreen: TreePine
};

export function DigitalGarden() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Digital Garden</h2>
          <p className="text-sm text-neutral-500">Raw, fleeting thoughts in various stages of growth.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {notes.map((note, i) => {
          const Icon = statusIcons[note.status as keyof typeof statusIcons];
          return (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-mono uppercase ${statusStyles[note.status as keyof typeof statusStyles]}`}>
                  <Icon className="w-3 h-3" />
                  {note.status}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-600">
                  <Timer className="w-3 h-3" />
                  {note.updated}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-neutral-200 group-hover:text-white transition-colors">{note.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">{note.content}</p>
              </div>

              <div className="mt-auto pt-4 flex gap-2">
                {note.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-mono text-neutral-600 bg-neutral-900 px-1.5 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
