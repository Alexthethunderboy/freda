'use client';

import { FileText, Headphones, Image as ImageIcon, Download, File, Trash2 } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ThunderCard, ThunderBadge } from '../ui/design-system';
import { motion } from 'framer-motion';
import { BookmarkButton } from './BookmarkButton';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export interface KnowledgeItem {
  id: string;
  title: string;
  description: string;
  media_type: 'pdf' | 'audio' | 'article';
  media_url: string | null;
  topics: string[];
  created_at: string;
  author_id: string;
  thumbnail_url?: string;
  author?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

const TYPE_ICONS = {
  pdf: FileText,
  audio: Headphones,
  article: File,
};

export interface ArchiveCardProps {
  item: KnowledgeItem;
  onClick?: (item: KnowledgeItem) => void;
}

export function ArchiveCard({ item, onClick }: ArchiveCardProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    }
    getUser();
  }, [supabase]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this archive? This action cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from('knowledge_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;

      toast.success("Archive deleted successfully");
      router.refresh();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete archive");
    }
  };

  const isAuthor = currentUserId === item.author_id;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="group relative h-full flex flex-col min-w-0"
      onClick={() => onClick?.(item)}
    >
      {/* Broken Border Effect */}
      <div className="absolute inset-0 border border-white/10 group-hover:border-thunder-yellow/50 transition-colors duration-300 pointer-events-none z-20">
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 group-hover:border-thunder-yellow transition-colors" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20 group-hover:border-thunder-yellow transition-colors" />
      </div>

      {/* Card Content */}
      <div className="relative h-full bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col rounded-sm transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,200,0,0.15)] group-hover:-translate-y-1">
        {/* Texture Overlay */}
        <div className="absolute inset-0 bg-noise opacity-50 pointer-events-none z-0" />

        {/* Thumbnail / Icon Placeholder */}
        <div className="aspect-video w-full bg-surface relative overflow-hidden flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors shrink-0">
          {item.thumbnail_url ? (
            <NextImage 
              src={item.thumbnail_url} 
              alt={item.title} 
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            TYPE_ICONS[item.media_type] && (
              <div className="text-white/20 group-hover:text-thunder-yellow transition-colors duration-500">
              {(() => {
                  const Icon = TYPE_ICONS[item.media_type];
                  return <Icon className="h-16 w-16" />;
              })()}
              </div>
            )
          )}
          
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
          
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <span className="px-2 py-0.5 bg-thunder-yellow text-black text-[10px] font-bold uppercase tracking-widest transform -skew-x-12">
              {item.media_type}
            </span>
          </div>

          {/* Actions (Top Right) */}
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
             {isAuthor && (
               <button 
                 onClick={handleDelete}
                 className="p-2 rounded-full bg-black/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors backdrop-blur-md border border-white/10"
                 title="Delete Archive"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
             )}
             <BookmarkButton itemId={item.id} />
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col relative z-10 min-w-0">
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground font-mono overflow-hidden">
            <span className="shrink-0">{new Date(item.created_at).getFullYear()}</span>
            <span className="text-thunder-yellow shrink-0">{'///'}</span>
            <div className="flex gap-1 flex-wrap min-w-0">
              {item.topics?.slice(0, 2).map(t => {
                const slug = t.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                return (
                  <Link 
                    key={t} 
                    href={`/t/${slug}`}
                    className="text-foreground/80 hover:text-thunder-yellow uppercase tracking-wider text-[10px] hover:underline decoration-thunder-yellow/50 underline-offset-2 transition-colors truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <h3 className="mb-3 text-lg font-bold leading-tight text-foreground group-hover:text-thunder-yellow transition-colors line-clamp-2 font-headings">
            {item.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1 leading-relaxed">
            {item.description}
          </p>

          {/* Author Footer */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
            {item.author ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-thunder-yellow shrink-0">
                  {item.author.username[0].toUpperCase()}
                </div>
                <Link
                  href={`/u/${item.author.username}`}
                  className="text-xs text-muted-foreground group-hover:text-white transition-colors truncate hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.author.display_name || `@${item.author.username}`}
                </Link>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Unknown Author</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
