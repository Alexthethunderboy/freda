import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { KnowledgeGrid } from "@/components/features/KnowledgeGrid";
import { SidebarFilter } from "@/components/features/SidebarFilter";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const supabase = await createClient();

  // Fetch items
  const { data: items, error } = await supabase
    .from('knowledge_items')
    .select('*, author:profiles!author_id(username, display_name)')
    .order('views_count', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error("Error fetching home items:", JSON.stringify(error, null, 2));
  } else {
    console.log("Fetched home items count:", items?.length);
  }

  // Fetch all topics for the filter
  const { data: topicsData } = await supabase.from('topics').select('title, color_hex').order('title');
  const uniqueTopics = topicsData?.map(t => ({ title: t.title, colorHex: t.color_hex })) || [];

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <Suspense fallback={<div className="w-64 shrink-0 border-r border-border bg-surface p-6 hidden lg:block" />}>
        <SidebarFilter topics={uniqueTopics} />
      </Suspense>
      <div className="flex-1 min-w-0">
        <header className="px-4 md:px-8 pt-12 pb-8 border-b border-border/40">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-foreground mb-4 font-headings">
              The Archive
            </h1>
            <p className="text-md text-muted-foreground font-light max-w-7xl leading-relaxed">
              A curated collection of declassified knowledge. <br className="hidden "/>
              Deconstruct the past to build the future.
            </p>
          </div>
        </header>
        <Suspense fallback={<div className="p-8 text-muted-foreground">Loading archive...</div>}>
          <div className="animate-fade-in">
            <KnowledgeGrid items={items || []} />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

