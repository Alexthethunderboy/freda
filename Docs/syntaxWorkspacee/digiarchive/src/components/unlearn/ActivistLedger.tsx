'use client';

import { motion } from 'framer-motion';
import { Target, Users, ExternalLink, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { unlearnApi, UnlearnArchiveActivism } from '@/lib/unlearn-api';

export function ActivistLedger() {
  const [items, setItems] = useState<UnlearnArchiveActivism[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await unlearnApi.getActivismLedger();
      setItems(data);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
          Activist Action Ledger
          <Activity className="w-5 h-5 text-electric-storm animate-pulse" />
        </h2>
        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          Live Sync
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="h-40 flex items-center justify-center border border-white/5 bg-white/2 rounded-2xl">
            <span className="text-xs font-mono text-neutral-600 animate-pulse">Establishing Uplink...</span>
          </div>
        ) : items.map((item, i) => {
          const progress = (item.current / item.goal) * 100;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                      item.status === 'urgent' ? 'border-red-500/50 text-red-500 bg-red-500/10' : 'border-electric-storm/50 text-electric-storm-light bg-electric-storm/10'
                    }`}>
                      {item.type} • {item.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-neutral-200 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed max-w-xl">
                    {item.description}
                  </p>
                </div>

                <div className="shrink-0 space-y-3 min-w-[140px]">
                  <div className="flex justify-between text-[10px] font-mono mb-1">
                    <span className="text-neutral-500 uppercase">Progress</span>
                    <span className="text-white">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${progress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${item.status === 'urgent' ? 'bg-red-500' : 'bg-electric-storm'}`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <div className="flex items-center gap-1 text-neutral-600">
                      <Users className="w-3 h-3" />
                      {item.current.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-neutral-400">
                      <Target className="w-3 h-3 text-electric-storm" />
                      {item.goal.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <a 
                href={item.link}
                target="_blank"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/10 rounded-full"
              >
                <ExternalLink className="w-4 h-4 text-neutral-400" />
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
