'use client';

import { motion } from "framer-motion";
import { MessageSquare, Heart, Share2, Sparkles } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "The Architecture of Anxiety",
    content: "Today I unlearned that productivity is tied to time. It's tied to energy and focus. The 8-hour workday is a relic of industrialization, not a metric for digital creation.",
    date: "2026.01.02",
    likes: "42",
    comments: "5"
  },
  {
    id: 2,
    title: "History Reframed",
    content: "Cannabis prohibition in West Africa wasn't about health; it was about replacing local autonomy with colonial structure. To use it is to reclaim a part of our botanical heritage.",
    date: "2025.12.28",
    likes: "128",
    comments: "12"
  },
  {
    id: 3,
    title: "Code as Consciousness",
    content: "If we view code as a series of decisions, then programming is a form of active meditation. Every bug is a misunderstanding of reality.",
    date: "2025.12.20",
    likes: "67",
    comments: "3"
  }
];

export function JournalSection() {
  return (
    <div className="space-y-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-display font-bold">Unlearning Moments</h2>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-mono text-gray-500">{post.date}</span>
              <div className="flex gap-4">
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-4 h-4" />
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  {post.comments}
                </button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-100 transition-colors">
              {post.title}
            </h3>
            
            <p className="text-gray-400 leading-relaxed">
              {post.content}
            </p>

            <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
              <button className="text-gray-500 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
