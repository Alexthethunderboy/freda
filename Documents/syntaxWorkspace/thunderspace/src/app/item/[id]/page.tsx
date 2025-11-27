import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ThunderCard, ThunderBadge, ThunderButton } from "@/components/ui/design-system";
import { ArrowLeft, Calendar, User, Share2, BookOpen } from "lucide-react";
import Link from "next/link";
import { BookmarkButton } from "@/components/features/BookmarkButton";
import { ObserveButton } from "@/components/features/ObserveButton";

export const revalidate = 60;

export default async function ItemPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from('knowledge_items')
    .select('*')
    .eq('id', id)
    .single();

  if (!item) return notFound();

  // Fetch related items
  const { data: relatedItems } = await supabase
    .from('knowledge_items')
    .select('*')
    .contains('topics', item.topics || [])
    .neq('id', item.id)
    .limit(3);

  return (
    <div className="min-h-screen p-8 flex justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Archive
        </Link>

        <ThunderCard className="overflow-hidden bg-card border-border">
          {/* Header */}
          <div className="p-8 border-b border-border space-y-6">
            <div className="flex gap-2 flex-wrap">
              <ThunderBadge variant="primary" className="uppercase tracking-wider">
                {item.media_type}
              </ThunderBadge>
              {item.topics?.map((topic: string) => (
                <ThunderBadge key={topic} variant="outline" className="uppercase tracking-wider">
                  {topic}
                </ThunderBadge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-headings leading-tight">
              {item.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-muted-foreground font-mono">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Author ID: {item.author_id.slice(0, 8)}...</span>
                <ObserveButton targetUserId={item.author_id} entityType="author" size="sm" className="h-6 px-2 text-xs" />
              </div>
            </div>
          </div>

          {/* Content / Preview */}
          <div className="p-8 space-y-8">
            {item.thumbnail_url && (
              <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden border border-border">
                <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed text-foreground/90">
                {item.description}
              </p>
            </div>

            {/* Media Action Area */}
            <div className="bg-surface rounded-lg p-8 flex flex-col items-center justify-center gap-4 border border-border border-dashed">
              <p className="text-muted-foreground">
                {item.media_type === 'pdf' ? 'PDF Document Available' : 
                 item.media_type === 'audio' ? 'Audio Recording Available' : 
                 'Full Article Content'}
              </p>
              
              <div className="flex gap-4">
                <ThunderButton size="lg">
                  {item.media_type === 'pdf' ? 'Read PDF' : 
                   item.media_type === 'audio' ? 'Listen Now' : 
                   'Read Article'}
                </ThunderButton>
                <BookmarkButton itemId={item.id} />
                <ThunderButton variant="ghost" size="lg">
                  <Share2 className="w-4 h-4" />
                </ThunderButton>
              </div>
            </div>
          </div>
        </ThunderCard>

        {/* Related Knowledge */}
        {relatedItems && relatedItems.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headings flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> Related Knowledge
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedItems.map((related) => (
                <Link key={related.id} href={`/item/${related.id}`}>
                  <ThunderCard className="h-full hover:border-primary transition-colors group p-4 space-y-3">
                    {related.thumbnail_url && (
                      <div className="w-full h-32 rounded-md overflow-hidden bg-muted/20 mb-2">
                        <img src={related.thumbnail_url} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <h3 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">{related.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{related.description}</p>
                    <div className="flex gap-2 pt-2">
                      <ThunderBadge variant="outline" className="text-[10px]">{related.media_type}</ThunderBadge>
                    </div>
                  </ThunderCard>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
