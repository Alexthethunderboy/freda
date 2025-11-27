import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { KnowledgeGrid } from "@/components/features/KnowledgeGrid";
import { SidebarFilter } from "@/components/features/SidebarFilter";
import { SearchInput } from "@/components/features/SearchInput";
import { AuthorCard } from "@/components/features/AuthorCard";
import { TopicCard } from "@/components/features/TopicCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const revalidate = 0; // Dynamic for search

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; topics?: string | string[]; types?: string | string[] };
}) {
  const supabase = await createClient();
  const { q: query = '', topics: topicsParam, types: typesParam } = await searchParams;
  
  const topics = Array.isArray(topicsParam) ? topicsParam : topicsParam ? [topicsParam] : [];
  const types = Array.isArray(typesParam) ? typesParam : typesParam ? [typesParam] : [];

  // Parallel Data Fetching
  const [postsRes, authorsRes, topicsRes] = await Promise.all([
    // 1. Posts Query
    (async () => {
      let dbQuery = supabase
        .from('knowledge_items')
        .select('*, author:profiles!author_id(username, display_name)')
        .order('created_at', { ascending: false });

      if (query) dbQuery = dbQuery.textSearch('title', query);
      if (topics.length > 0) dbQuery = dbQuery.contains('topics', topics);
      if (types.length > 0) dbQuery = dbQuery.in('media_type', types);
      
      return dbQuery;
    })(),

    // 2. Authors Query
    (async () => {
      if (!query) return { data: [] };
      return supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(20);
    })(),

    // 3. Topics Query
    (async () => {
      if (!query) return { data: [] };
      return supabase
        .from('topics')
        .select('*')
        .ilike('title', `%${query}%`)
        .limit(20);
    })()
  ]);

  const posts = postsRes.data || [];
  const authors = authorsRes.data || [];
  const foundTopics = topicsRes.data || [];

  // Fetch unique topics for filter (sidebar)
  const { data: allItems } = await supabase.from('knowledge_items').select('topics');
  const allTopics = allItems?.flatMap(item => item.topics) || [];
  const uniqueTopics = Array.from(new Set(allTopics)).map(t => ({ title: t }));

  return (
    <div className="flex min-h-screen">
      <Suspense fallback={<div className="w-64 shrink-0 border-r border-border bg-surface p-6 hidden lg:block" />}>
        <SidebarFilter topics={uniqueTopics} />
      </Suspense>
      <div className="flex-1">
        <header className="px-8 pt-12 pb-8 border-b border-border/40">
          <h1 className="text-4xl font-medium tracking-tight text-foreground mb-6 font-headings">
            Global Search
          </h1>
          
          <SearchInput />

          <p className="text-muted-foreground font-light mt-4">
            Found {posts.length} posts, {authors.length} authors, {foundTopics.length} topics
            {query && ` for "${query}"`}
          </p>
        </header>

        <div className="p-8">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="mb-8 bg-surface border border-white/10 p-1 rounded-full inline-flex">
              <TabsTrigger value="posts" className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-black transition-all">
                Posts ({posts.length})
              </TabsTrigger>
              <TabsTrigger value="authors" className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-black transition-all">
                Authors ({authors.length})
              </TabsTrigger>
              <TabsTrigger value="topics" className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-black transition-all">
                Topics ({foundTopics.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="animate-fade-in">
              <Suspense fallback={<div className="text-muted-foreground">Loading posts...</div>}>
                <KnowledgeGrid items={posts} />
              </Suspense>
            </TabsContent>

            <TabsContent value="authors" className="animate-fade-in">
              {authors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {authors.map((author: any) => (
                    <AuthorCard key={author.id} author={author} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Try searching for &quot;architecture&quot;, &quot;history&quot;, or &quot;science&quot;.</p>
              )}
            </TabsContent>

            <TabsContent value="topics" className="animate-fade-in">
              {foundTopics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {foundTopics.map((topic: any) => (
                    <TopicCard key={topic.id} topic={topic} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No topics found matching &quot;{query}&quot;.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

