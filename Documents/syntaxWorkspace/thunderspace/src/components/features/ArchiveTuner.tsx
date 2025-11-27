'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Grid, List, Clock, Hash } from 'lucide-react';

interface Topic {
  id: number;
  title: string;
  created_at: string;
}

interface ArchiveTunerProps {
  view: 'grid' | 'timeline';
  onViewChange: (view: 'grid' | 'timeline') => void;
  sortBy: 'newest' | 'relevant';
  onSortChange: (sort: 'newest' | 'relevant') => void;
  // topics: { title: string }[]; // This prop is no longer passed in, as topics are fetched internally
  selectedTopics: string[];
  onTopicToggle: (topic: string) => void;
}

export function ArchiveTuner({
  view,
  onViewChange,
  sortBy,
  onSortChange,
  // topics, // This prop is no longer passed in
  selectedTopics,
  onTopicToggle
}: ArchiveTunerProps) {
  const [topics, setTopics] = useState<Topic[]>([]);

  const supabase = createClient();

  useEffect(() => {
    async function fetchTopics() {
      const { data } = await supabase.from('topics').select('*').order('title');
      if (data) setTopics(data);
    }
    fetchTopics();
  }, [supabase]);
  
  // Time Scrubber Logic
  const scrubberRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const activeSortValue = useTransform(x, [-100, 0, 100], ['relevant', 'newest', 'relevant']);

  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX > 50) {
      onSortChange('relevant');
    } else {
      onSortChange('newest');
    }
    animate(x, 0, { type: 'spring', stiffness: 300, damping: 20 });
  };

  return (
    <div className="sticky top-0 z-40 w-full mb-6">
      <div className="relative bg-background/80 backdrop-blur-xl border-b border-white/10 pb-4 pt-2 px-4">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
            Archive Tuner
          </h2>
          
          {/* View Toggle Switch */}
          <div className="flex items-center bg-card border border-white/10 rounded-full p-1">
            <button
              onClick={() => onViewChange('grid')}
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                view === 'grid' ? "bg-thunder-yellow text-black shadow-thunder-yellow/50" : "text-muted-foreground hover:text-white"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange('timeline')}
              className={cn(
                "p-2 rounded-full transition-all duration-300",
                view === 'timeline' ? "bg-thunder-yellow text-black shadow-thunder-yellow/50" : "text-muted-foreground hover:text-white"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Time Scrubber (Sort) */}
        <div className="relative h-12 bg-card/50 border border-white/5 rounded-lg overflow-hidden mb-4 flex items-center justify-center cursor-grab active:cursor-grabbing">
          <motion.div 
            className="absolute inset-0 flex items-center justify-center space-x-1 opacity-20"
            style={{ x }}
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className={cn("w-px bg-white", i % 5 === 0 ? "h-6" : "h-3")} />
            ))}
          </motion.div>
          
          <motion.div 
            drag="x"
            dragConstraints={scrubberRef}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="relative z-10 flex items-center gap-2 px-4 py-1 bg-background border border-thunder-yellow/50 rounded-full shadow-[0_0_15px_rgba(255,200,0,0.2)]"
          >
            <Clock className="w-3 h-3 text-thunder-yellow" />
            <span className="text-xs font-bold text-thunder-yellow uppercase">
              {sortBy === 'newest' ? 'Timeline: Newest' : 'Timeline: Relevant'}
            </span>
          </motion.div>
        </div>

        {/* Topic Shards (Horizontal Scroll) */}
        <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar mask-gradient-right">
          <div className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full bg-white/5 border border-white/10">
            <Hash className="w-4 h-4 text-muted-foreground" />
          </div>
          {topics.map((topic) => {
            const isSelected = selectedTopics.includes(topic.title);
            return (
              <button
                key={topic.title}
                onClick={() => onTopicToggle(topic.title)}
                className={cn(
                  "shrink-0 px-4 py-1.5 text-xs font-medium uppercase tracking-wider border transition-all duration-300 transform -skew-x-12",
                  isSelected 
                    ? "bg-thunder-yellow text-black border-thunder-yellow shadow-[4px_4px_0px_rgba(255,255,255,0.1)] translate-y-[-2px]" 
                    : "bg-card text-muted-foreground border-white/10 hover:border-white/30 hover:text-white"
                )}
              >
                <span className="block skew-x-12">{topic.title}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Electric Line Decor */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-thunder-yellow/50 to-transparent shadow-[0_0_10px_rgba(255,200,0,0.5)]" />
    </div>
  );
}
