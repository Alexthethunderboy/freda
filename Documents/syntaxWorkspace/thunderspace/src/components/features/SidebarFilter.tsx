'use client';

import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { ThunderBadge } from '../ui/design-system';
import { motion } from 'framer-motion';

interface SidebarFilterProps {
  topics: { title: string; colorHex?: string; count?: number }[];
}

export function SidebarFilter({ topics }: SidebarFilterProps) {
  const [selectedTopics, setSelectedTopics] = useQueryState('topics', parseAsArrayOf(parseAsString).withDefault([]));
  const [selectedTypes, setSelectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString).withDefault([]));

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic) || null);
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type) || null);
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const contentTypes = ['pdf', 'audio', 'article'];

  return (
    <div className="w-64 shrink-0 border-r border-border bg-surface p-6 hidden lg:block h-[calc(100vh-4rem)] overflow-y-auto sticky top-16">
      <div className="space-y-8">
        {/* Topics */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Topics</h3>
          <div className="space-y-2">
            {topics.map((topic) => {
              const isSelected = selectedTopics.includes(topic.title);
              return (
                <motion.button
                  key={topic.title}
                  onClick={() => toggleTopic(topic.title)}
                  className={`flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors ${
                    isSelected 
                      ? 'bg-white/5 text-white' 
                      : 'text-text-secondary hover:bg-white/5 hover:text-white'
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" 
                      style={{ color: topic.colorHex || '#FACC15', backgroundColor: topic.colorHex || '#FACC15' }} 
                    />
                    <span>{topic.title}</span>
                  </div>
                  {isSelected && <span className="text-electric-blue">●</span>}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Media Type */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-4">Media Type</h3>
          <div className="flex flex-wrap gap-2">
            {contentTypes.map((type) => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className="focus:outline-none"
              >
                <ThunderBadge 
                  variant={selectedTypes.includes(type) ? 'primary' : 'outline'}
                  className="uppercase cursor-pointer hover:border-electric-blue/50"
                >
                  {type}
                </ThunderBadge>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
