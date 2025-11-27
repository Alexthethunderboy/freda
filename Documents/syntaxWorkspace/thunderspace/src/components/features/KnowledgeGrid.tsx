'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import Fuse from 'fuse.js';
import { Bookmark } from 'lucide-react';
import { ArchiveCard } from './ArchiveCard';
import { RichPreviewModal } from './RichPreviewModal';
import { ArchiveTuner } from './ArchiveTuner';
import { PullToRefresh } from '../ui/PullToRefresh';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Types matching Supabase Schema
export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  media_type: 'pdf' | 'audio' | 'article';
  media_url: string | null;
  topics: string[];
  created_at: string;
  author_id: string;
  author?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

interface KnowledgeGridProps {
  items: KnowledgeItem[];
}

export function KnowledgeGrid({ items }: KnowledgeGridProps) {
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  
  const [selectedTopics, setSelectedTopics] = useQueryState('topics', parseAsArrayOf(parseAsString).withDefault([]));
  const [selectedTypes] = useQueryState('types', parseAsArrayOf(parseAsString).withDefault([]));
  const [searchQuery] = useQueryState('q', parseAsString.withDefault(''));

  const fuse = useMemo(() => new Fuse(items, {
    keys: ['title', 'description', 'topics', 'created_at'],
    threshold: 0.3,
  }), [items]);

  const filteredItems = useMemo(() => {
    let result = items;

    if (searchQuery) {
      result = fuse.search(searchQuery).map(r => r.item);
    }

    if (selectedTopics.length > 0) {
      result = result.filter(item => 
        item.topics?.some(t => selectedTopics.includes(t))
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter(item => selectedTypes.includes(item.media_type));
    }

    return result;
  }, [items, searchQuery, selectedTopics, selectedTypes, fuse]);

  const [view, setView] = useState<'grid' | 'timeline'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'relevant'>('newest');

  const sortedItems = useMemo(() => {
    const result = [...filteredItems];
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [filteredItems, sortBy]);

  const itemsByYear = useMemo(() => {
    const groups: Record<number, KnowledgeItem[]> = {};
    sortedItems.forEach(item => {
      const year = new Date(item.created_at).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(item);
    });
    return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]));
  }, [sortedItems]);



  const handleTopicToggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSwipe = (_event: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      toast.success("Bookmarked to your library", {
        icon: <Bookmark className="w-4 h-4 text-thunder-yellow" />
      });
    }
  };

  return (
    <div className="w-full relative min-h-screen">
      <PullToRefresh />
      
      {/* Mobile Tuner (Visible on Mobile) */}
      <div className="md:hidden">
        <ArchiveTuner 
          view={view}
          onViewChange={setView}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedTopics={selectedTopics}
          onTopicToggle={handleTopicToggle}
        />
      </div>

      {/* Desktop Controls (Hidden on Mobile) */}
      <div className="hidden md:flex mb-8 flex-wrap items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2 bg-surface p-1 rounded-lg border border-border">
          <button
            onClick={() => setView('grid')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'grid' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setView('timeline')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === 'timeline' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white'
            }`}
          >
            Timeline
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-text-muted">
            {sortedItems.length} results
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted uppercase tracking-wider font-bold">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'relevant')}
              className="bg-surface border border-border text-white text-sm rounded-lg px-3 py-1.5 outline-none focus:border-electric-blue"
            >
              <option value="newest">Newest</option>
              <option value="relevant">Most Relevant</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="px-4 md:px-6 pb-24">
        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            <AnimatePresence mode="popLayout">
              {sortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, info) => handleSwipe(e, info)}
                  className={cn(
                    "relative",
                    // Broken Grid Logic: Every 5th item spans 2 columns on medium screens and up
                    index % 5 === 0 ? "md:col-span-2" : "col-span-1"
                  )}
                >
                  {/* Swipe Indicator Layer */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  <ArchiveCard item={item} onClick={setSelectedItem} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            {itemsByYear.map(([year, yearItems]) => (
              <div key={year} className="relative pl-8 border-l border-white/10">
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-surface border border-white/20 flex items-center justify-center text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-6 font-headings">{year}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {yearItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ArchiveCard item={item} onClick={setSelectedItem} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedItems.length === 0 && (
          <div className="text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-xl">
            <p>No items found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedItem && (
          <RichPreviewModal 
            item={{
              ...selectedItem,
              type: selectedItem.media_type,
              summary: selectedItem.description,
              url: selectedItem.media_url || undefined,
              file: selectedItem.media_type === 'pdf' ? (selectedItem.media_url || undefined) : undefined,
              publicationDate: selectedItem.created_at,
              author: selectedItem.author ? { name: selectedItem.author.display_name } : undefined,
              topics: selectedItem.topics.map(t => ({ title: t }))
            }} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
