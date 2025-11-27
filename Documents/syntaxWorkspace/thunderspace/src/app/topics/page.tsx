import { createClient } from '@/lib/supabase/server'
import { ThunderCard, ThunderBadge } from '@/components/ui/design-system'
import Link from 'next/link'
import { Hash } from 'lucide-react'

export const revalidate = 3600 // Revalidate every hour

export default async function TopicsPage() {
  const supabase = await createClient()
  
  const { data: topics, error } = await supabase
    .from('topics')
    .select('*')
    .order('title')

  if (error) {
    console.error('Error fetching topics:', error)
    return (
      <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center">
        <p className="text-red-500">Failed to load topics. Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headings tracking-tight">
            Explore Topics
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-light">
            Dive into our curated collection of knowledge streams. From ancient history to quantum mechanics.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics?.map((topic) => (
            <Link key={topic.id} href={`/t/${topic.slug}`} className="group">
              <ThunderCard className="h-full p-8 hover:border-primary/50 transition-all duration-500 group-hover:bg-white/5 relative overflow-hidden">
                {/* Background Glow */}
                <div 
                  className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: topic.color_hex || '#fff' }}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors"
                      style={{ color: topic.color_hex || '#fff' }}
                    >
                      <Hash className="w-6 h-6" />
                    </div>
                    <ThunderBadge variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore
                    </ThunderBadge>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold font-headings mb-2 group-hover:text-primary transition-colors">
                      {topic.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </ThunderCard>
            </Link>
          ))}
        </div>

        {(!topics || topics.length === 0) && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <p className="text-muted-foreground">No topics found. The archive is expanding...</p>
          </div>
        )}
      </div>
    </div>
  )
}
