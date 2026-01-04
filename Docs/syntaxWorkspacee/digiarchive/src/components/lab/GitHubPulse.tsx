'use client';

import { motion } from 'framer-motion';
import { GitCommit, GitPullRequest, GitMerge, ExternalLink } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: "commit",
    repo: "digiarchive",
    msg: "feat: implement interactive mind map sub-nodes",
    time: "2h ago",
    status: "merged"
  },
  {
    id: 2,
    type: "pr",
    repo: "unlearn-naija",
    msg: "docs: update paradigm shifter manifestos",
    time: "5h ago",
    status: "open"
  },
  {
    id: 3,
    type: "commit",
    repo: "shopper",
    msg: "fix: resolve stripe webhook concurrency issues",
    time: "1d ago",
    status: "merged"
  }
];

export function GitHubPulse() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
          GitHub Pulse
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-500" 
              />
            ))}
          </div>
        </h2>
        <a href="https://github.com/alexthegreatdeveloper" target="_blank" className="text-neutral-500 hover:text-white transition-colors">
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="space-y-3">
        {activities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-4 rounded-xl border border-white/5 bg-white/2 hover:border-green-500/20 transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center shrink-0">
              {activity.type === 'commit' ? <GitCommit className="w-4 h-4 text-green-500" /> : <GitPullRequest className="w-4 h-4 text-yellow-500" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-neutral-300">{activity.repo}</span>
                <span className="text-[10px] text-neutral-600 font-mono uppercase">{activity.time}</span>
              </div>
              <p className="text-sm text-neutral-500 truncate group-hover:text-neutral-300 transition-colors">
                {activity.msg}
              </p>
            </div>

            <div className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase ${
              activity.status === 'merged' ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5'
            }`}>
              {activity.status}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Heatmap Placeholder */}
      <div className="pt-4">
        <div className="text-[10px] font-mono text-neutral-600 uppercase mb-2">Build Velocity Heatmap</div>
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {[...Array(52)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1 shrink-0">
              {[...Array(7)].map((_, j) => {
                const opacity = Math.random() > 0.7 ? (Math.random() * 0.8 + 0.2) : 0.05;
                return (
                  <div 
                    key={j} 
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: `rgba(74, 222, 128, ${opacity})` }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
