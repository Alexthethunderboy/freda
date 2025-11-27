"use client";

import { Bookmark, Loader2 } from "lucide-react";
import { useBookmark } from "@/hooks/use-bookmark";

export function BookmarkButton({ itemId }: { itemId: string }) {
  const { isBookmarked, loading, toggleBookmark } = useBookmark(itemId);

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toggleBookmark();
        }} 
        disabled={loading}
        className={`p-2 rounded-full transition-all duration-300 ${
          isBookmarked 
            ? "bg-primary text-black shadow-[0_0_15px_rgba(var(--primary),0.4)]" 
            : "bg-black/40 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
        }`}
        title={isBookmarked ? "Unsave" : "Save to Bookmarks"}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
        )}
      </button>
    </div>
  );
}
