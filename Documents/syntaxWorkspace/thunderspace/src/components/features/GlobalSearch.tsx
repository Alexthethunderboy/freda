'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Command, Hash, User, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMobileStore } from '@/lib/store/useMobileStore';
import { createClient } from '@/lib/supabase/client';
import { useDebouncedCallback } from 'use-debounce';
import { Highlight } from '@/components/ui/Highlight';

interface Suggestion {
  id: string;
  title: string;
  type: 'topic' | 'author' | 'post';
  url: string;
  subtitle?: string;
}

export function GlobalSearch() {
  const { isSearchOpen, setSearchOpen } = useMobileStore();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setSuggestions([]);
    }
  }, [isSearchOpen]);

  // Command-K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setSearchOpen]);

  const fetchSuggestions = useDebouncedCallback(async (term: string) => {
    if (!term.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const results: Suggestion[] = [];

    try {
      // 1. Topics
      const { data: topics } = await supabase
        .from('topics')
        .select('title')
        .ilike('title', `%${term}%`)
        .limit(3);
      
      topics?.forEach(t => results.push({
        id: `topic-${t.title}`,
        title: t.title,
        type: 'topic',
        url: `/t/${t.title.toLowerCase().replace(/ /g, '-')}`
      }));

      // 2. Authors
      const { data: authors } = await supabase
        .from('profiles')
        .select('username, display_name')
        .or(`username.ilike.%${term}%,display_name.ilike.%${term}%`)
        .limit(3);

      authors?.forEach(a => results.push({
        id: `author-${a.username}`,
        title: a.display_name || a.username,
        type: 'author',
        url: `/u/${a.username}`,
        subtitle: `@${a.username}`
      }));

      // 3. Posts
      const { data: posts } = await supabase
        .from('knowledge_items')
        .select('id, title, media_type')
        .ilike('title', `%${term}%`)
        .limit(5);

      posts?.forEach(p => results.push({
        id: p.id,
        title: p.title,
        type: 'post',
        url: `/search?q=${encodeURIComponent(p.title)}`, // Or direct link if we had a single item page
        subtitle: p.media_type
      }));

      setSuggestions(results);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (url: string) => {
    setSearchOpen(false);
    router.push(url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'topic': return <Hash className="w-4 h-4 text-thunder-yellow" />;
      case 'author': return <User className="w-4 h-4 text-blue-400" />;
      default: return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-70 flex items-start justify-center pt-[20vh] px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
          >
            <form onSubmit={handleSearch} className="relative flex items-center p-4 border-b border-white/10 shrink-0">
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-thunder-yellow animate-spin mr-4" />
              ) : (
                <Search className="w-6 h-6 text-muted-foreground mr-4" />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInput}
                placeholder="Search archives, topics, authors..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-muted-foreground/50"
              />
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-muted-foreground font-mono">
                  <span className="text-xs">ESC</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/50">
              {suggestions.length > 0 ? (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">Suggestions</div>
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSuggestionClick(item.url)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <div className="p-2 rounded bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors">
                        {getIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          <Highlight text={item.title} highlight={query} />
                        </div>
                        {item.subtitle && (
                          <div className="text-xs text-muted-foreground truncate">
                            {item.type === 'author' ? (
                              <Highlight text={item.subtitle} highlight={query} />
                            ) : (
                              item.subtitle
                            )}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  ))}
                </div>
              ) : query.trim() ? (
                !isLoading && (
                  <div className="flex items-center justify-between p-4 text-sm text-muted-foreground">
                    <p>No results found for &quot;{query}&quot;</p>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Command className="w-8 h-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Type to start searching...</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
