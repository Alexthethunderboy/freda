import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { KnowledgeGrid } from "@/components/features/KnowledgeGrid";
import { ExploreHeader } from "@/components/ExploreHeader";
import { ThunderButton } from "@/components/ui/design-system";
import Link from "next/link";

export const revalidate = 0; // Dynamic for personalized feed

interface ExplorePageProps {
  searchParams: { topic?: string };
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { topic } = await searchParams;

  let items = [];
  let isPersonalized = false;

  if (topic) {
    // 1. Topic Filter (Explicit)
    const { data } = await supabase
      .from('knowledge_items')
      .select('*, author:profiles!author_id(username, display_name)')
      .contains('topics', [topic])
      .limit(20);
    items = data || [];
  } else if (user) {
    // 2. Personalized Feed (Observed Authors & Topics)
    isPersonalized = true;
    
    // Fetch observations
    const { data: observations } = await supabase
      .from('observes')
      .select('target_user_id, target_topic')
      .eq('observer_id', user.id);

    const observedUserIds = observations?.map(o => o.target_user_id).filter(Boolean) || [];
    const observedTopics = observations?.map(o => o.target_topic).filter(Boolean) || [];

    if (observedUserIds.length > 0 || observedTopics.length > 0) {
      let query = supabase.from('knowledge_items').select('*, author:profiles!author_id(username, display_name)').limit(30);
      
      // OR logic for authors and topics is tricky in Supabase simple query builder.
      // We'll fetch a bit broadly or use an RPC if performance matters.
      // For now, we'll try to match either.
      // Since .or() expects a string syntax:
      
      const conditions = [];
      if (observedUserIds.length > 0) {
        conditions.push(`author_id.in.(${observedUserIds.join(',')})`);
      }
      // Note: topics is an array column, so we can't easily use .in() or .or() with it in the same simple query string for "contains".
      // We might need to do two queries or just fetch latest if no complex logic.
      // Simplified approach: Fetch latest items and filter in memory if dataset is small, OR just fetch by authors for now.
      
      // Let's prioritize Authors for the "Feed" feel.
      if (observedUserIds.length > 0) {
         query = query.in('author_id', observedUserIds);
      }
      
      // If we also want topics, we might need a separate query and merge, or use a raw SQL function.
      // For MVP/Phase 1, let's stick to Author feed if available, else fallback to latest.
      
      const { data } = await query.order('created_at', { ascending: false });
      items = data || [];
      
      // If we have topics but no authors, or mixed, we might want to fetch by topic too.
      if (observedTopics.length > 0) {
         // This is a second query to merge.
         const { data: topicItems } = await supabase
           .from('knowledge_items')
           .select('*, author:profiles!author_id(username, display_name)')
           .overlaps('topics', observedTopics) // overlaps is better for array overlap
           .limit(20)
           .order('created_at', { ascending: false });
           
         if (topicItems) {
           // Merge and dedupe
           const existingIds = new Set(items.map(i => i.id));
           topicItems.forEach(item => {
             if (!existingIds.has(item.id)) {
               items.push(item);
             }
           });
         }
      }
    } else {
      // User follows nothing -> Show latest/trending
      const { data } = await supabase.from('knowledge_items').select('*, author:profiles!author_id(username, display_name)').limit(20).order('created_at', { ascending: false });
      items = data || [];
      isPersonalized = false; // Fallback effectively
    }
  } else {
    // 3. Public/Guest Feed (Latest)
    const { data } = await supabase.from('knowledge_items').select('*, author:profiles!author_id(username, display_name)').limit(20).order('created_at', { ascending: false });
    items = data || [];
  }

  // Sort merged items by date
  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="min-h-screen">
      <ExploreHeader />
      
      <header className="px-8 pt-8 pb-8 border-b border-border/40">
        <h1 className="text-4xl font-medium tracking-tight text-foreground mb-4 font-headings">
          {topic ? `#${topic}` : 'Explore'}
        </h1>
        <p className="text-md text-muted-foreground font-light max-w-2xl leading-relaxed">
          {topic 
            ? `Curated archives related to ${topic}.`
            : isPersonalized 
              ? 'Your personalized feed based on Authors and Topics you observe.'
              : 'Discover the latest archives from the community.'
          }
        </p>
        {!user && !topic && (
          <div className="mt-4">
            <Link href="/login">
              <ThunderButton size="sm" variant="outline">Sign in to customize your feed</ThunderButton>
            </Link>
          </div>
        )}
      </header>
      <main className="animate-fade-in">
        <Suspense fallback={<div className="p-8 text-muted-foreground">Loading feed...</div>}>
          {items.length > 0 ? (
            <KnowledgeGrid items={items} />
          ) : (
             <div className="p-12 text-center text-muted-foreground">
               <p>No archives found. Try observing more authors or topics!</p>
               <Link href="/search" className="text-primary hover:underline mt-2 block">Find content to observe</Link>
             </div>
          )}
        </Suspense>
      </main>
    </div>
  );
}
