import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { KnowledgeGrid, KnowledgeItem } from "@/components/features/KnowledgeGrid";
import { ThunderCard, ThunderButton } from "@/components/ui/design-system";
import { Folder, Plus } from "lucide-react";
import Link from "next/link";

export const revalidate = 0; // Dynamic

export default async function CollectionsPage() {
  const supabase = await createClient();
  
  // Check auth
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-bold mb-4">Your Library</h1>
        <p className="text-muted-foreground mb-8">Please sign in to access your collections.</p>
        <Link href="/login">
          <ThunderButton>Sign In</ThunderButton>
        </Link>
      </div>
    );
  }

  // Fetch folders
  const { data: folders } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch recent bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(`
      item:knowledge_items(*, author:profiles!author_id(username, display_name))
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const items = bookmarks?.map((b: { item: unknown }) => b.item as KnowledgeItem).filter(Boolean) || [];

  return (
    <div className="min-h-screen p-8">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-medium tracking-tight text-foreground mb-4 font-headings">
            Collections
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Your personal archive of saved knowledge.
          </p>
        </div>
        <ThunderButton variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          New Folder
        </ThunderButton>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {folders?.map((folder) => (
          <ThunderCard key={folder.id} className="flex items-center gap-4 p-6 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 group transition-colors">
            <Folder className="w-8 h-8 text-primary fill-primary/20 group-hover:scale-110 transition-transform" style={{ color: folder.color }} />
            <div>
              <h3 className="font-bold text-lg">{folder.name}</h3>
              <p className="text-xs text-muted-foreground">View items</p>
            </div>
          </ThunderCard>
        ))}
        
        {(!folders || folders.length === 0) && (
          <div className="col-span-full py-8 text-center text-muted-foreground border border-dashed border-border rounded-lg">
            No folders yet. Create one to organize your research.
          </div>
        )}
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2">Recently Saved</h2>
        <Suspense fallback={<div>Loading...</div>}>
          {items.length > 0 ? (
            <KnowledgeGrid items={items} />
          ) : (
            <p className="text-muted-foreground">No saved items yet.</p>
          )}
        </Suspense>
      </section>
    </div>
  );
}
