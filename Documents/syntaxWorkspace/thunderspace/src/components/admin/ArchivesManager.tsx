'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ThunderButton, ThunderCard } from '@/components/ui/design-system';
import { Trash2, FileText, Headphones, File, Search, CheckSquare, Square, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ArchiveItem {
  id: string;
  title: string;
  created_at: string;
  media_type: 'pdf' | 'audio' | 'article';
  author?: {
    username: string;
  };
}

interface ArchivesManagerProps {
  initialArchives: ArchiveItem[];
}

// Helper for highlighting text
const Highlight = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-thunder-yellow/30 text-white rounded-[2px] px-0.5">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export function ArchivesManager({ initialArchives }: ArchivesManagerProps) {
  const [archives, setArchives] = useState<ArchiveItem[]>(initialArchives);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<string | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const supabase = createClient();

  // Filter archives based on search
  const filteredArchives = useMemo(() => {
    if (!searchQuery) return archives;
    const lowerQuery = searchQuery.toLowerCase();
    return archives.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) || 
      item.author?.username.toLowerCase().includes(lowerQuery)
    );
  }, [archives, searchQuery]);

  // Selection Logic
  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredArchives.length && filteredArchives.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredArchives.map(a => a.id)));
    }
  };

  // Delete Logic
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this archive?')) return;

    setLoading(id);
    const { error } = await supabase.from('knowledge_items').delete().eq('id', id);

    if (error) {
      toast.error('Failed to delete archive');
      console.error(error);
    } else {
      setArchives(prev => prev.filter(a => a.id !== id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast.success('Archive deleted');
    }
    setLoading(null);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} items? This cannot be undone.`)) return;

    setIsBulkDeleting(true);
    const idsToDelete = Array.from(selectedIds);
    const { error } = await supabase.from('knowledge_items').delete().in('id', idsToDelete);

    if (error) {
      toast.error('Failed to delete items');
      console.error(error);
    } else {
      setArchives(prev => prev.filter(a => !selectedIds.has(a.id)));
      setSelectedIds(new Set());
      toast.success(`${idsToDelete.length} archives deleted`);
    }
    setIsBulkDeleting(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'audio': return <Headphones className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  return (
    <ThunderCard className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-headings flex items-center gap-2">
            <FileText className="w-5 h-5 text-thunder-yellow" />
            Manage Archives
          </h3>
          <span className="text-xs text-muted-foreground">{archives.length} items</span>
        </div>

        {/* Search & Bulk Actions Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search archives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-surface border border-white/10 focus:border-primary/50 focus:ring-1 focus:ring-primary outline-none text-sm transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          
          {selectedIds.size > 0 && (
            <ThunderButton 
              variant="danger" 
              size="sm"
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="animate-fade-in"
            >
              {isBulkDeleting ? 'Deleting...' : `Delete (${selectedIds.size})`}
            </ThunderButton>
          )}
        </div>
      </div>

      {/* Select All Bar */}
      {filteredArchives.length > 0 && (
        <div className="flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground border-b border-white/5 mb-2">
          <button 
            onClick={toggleSelectAll}
            className="flex items-center gap-2 hover:text-white transition-colors"
          >
            {selectedIds.size === filteredArchives.length && filteredArchives.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-primary" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            Select All
          </button>
          <span>•</span>
          <span>{selectedIds.size} selected</span>
        </div>
      )}

      {/* List */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[300px] max-h-[500px]">
        <AnimatePresence mode='popLayout'>
          {filteredArchives.map(item => {
            const isSelected = selectedIds.has(item.id);
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={item.id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isSelected 
                    ? 'border-primary/50 bg-primary/10' 
                    : 'border-white/5 bg-surface hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden flex-1">
                  <button 
                    onClick={() => toggleSelect(item.id)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>

                  <div className="p-2 rounded bg-secondary/20 text-muted-foreground">
                    {getIcon(item.media_type)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm truncate">
                      <Highlight text={item.title} highlight={searchQuery} />
                    </p>
                    <p className="text-xs text-muted-foreground font-mono truncate">
                      by <Highlight text={item.author?.username || 'Unknown'} highlight={searchQuery} /> • {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded transition-colors shrink-0 ml-2"
                  disabled={loading === item.id}
                  title="Delete Archive"
                >
                  {loading === item.id ? <span className="animate-spin">⏳</span> : <Trash2 className="w-4 h-4" />}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {filteredArchives.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-40 text-muted-foreground"
          >
            {searchQuery ? (
              <p>No matches found for &quot;{searchQuery}&quot;</p>
            ) : (
              <p>No archives found.</p>
            )}
          </motion.div>
        )}
      </div>
    </ThunderCard>
  );
}
