import { createClient } from '@/lib/supabase/server'
import { KnowledgeGrid } from '@/components/features/KnowledgeGrid'
import { ObserveButton } from '@/components/features/ObserveButton'
import { ThunderCard } from '@/components/ui/design-system'
import { notFound } from 'next/navigation'
import { Hash } from 'lucide-react'

interface TopicPageProps {
  params: {
    slug: string
  }
}

export const revalidate = 3600

export default async function TopicPage({ params }: TopicPageProps) {
  const supabase = await createClient()
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  // 1. Fetch Topic from Supabase
  const { data: topic, error } = await supabase
    .from('topics')
    .select('*')
    .ilike('title', decodedSlug)
    .single()

  if (error || !topic) {
    notFound()
  }

  // 2. Fetch Content from Supabase that references this topic
  // We use the `contains` filter for the array column `topics`
  const { data: content } = await supabase
    .from('knowledge_items')
    .select('*, author:profiles!author_id(username, display_name)')
    .contains('topics', [topic.title]) // Assuming topic.title matches the string in the array
    .order('created_at', { ascending: false });

  const items = content || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div 
          className="absolute inset-0 opacity-10 blur-[100px]"
          style={{ backgroundColor: topic.color_hex || '#3B82F6' }}
        />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
              style={{ color: topic.color_hex || '#fff' }}
            >
              <Hash className="w-8 h-8" />
            </div>
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              Topic Umbrella
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <h1 className="text-5xl md:text-7xl font-bold font-headings tracking-tight">
              {topic.title}
            </h1>
            <ObserveButton entityId={topic.title} entityType="topic" size="lg" />
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl font-light leading-relaxed">
            Explore knowledge items related to {topic.title}.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-headings">Related Knowledge</h2>
          <span className="text-sm text-muted-foreground font-mono">
            {items.length} Items Found
          </span>
        </div>

        {items.length > 0 ? (
          <KnowledgeGrid items={items} />
        ) : (
          <ThunderCard className="p-12 text-center border-dashed border-white/10 bg-transparent">
            <p className="text-muted-foreground text-lg">
              No knowledge items have been filed under this topic yet.
            </p>
          </ThunderCard>
        )}
      </div>
    </div>
  )
}
