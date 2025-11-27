import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function useBookmark(itemId: string) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    checkBookmarkStatus();
  }, [itemId]);

  const checkBookmarkStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .single();

      if (data) setIsBookmarked(true);
    } catch (error) {
      // Ignore error if not found (406)
      console.error('Error checking bookmark:', error);
    }
  };

  const toggleBookmark = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to bookmark items');
        return;
      }

      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId);

        if (error) throw error;
        setIsBookmarked(false);
        toast.success('Removed from bookmarks');
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.id, item_id: itemId });

        if (error) throw error;
        setIsBookmarked(true);
        toast.success('Added to bookmarks');
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setLoading(false);
    }
  };

  return { isBookmarked, loading, toggleBookmark };
}
