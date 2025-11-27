'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ThunderBadge } from '@/components/ui/design-system'
import { User, Hash, Compass } from 'lucide-react'
import Link from 'next/link'

// Since I don't have ScrollArea in design-system, I'll use a simple overflow div
// I'll check if I can use a simple horizontal scroll

export function ExploreHeader() {
  const [observes, setObserves] = useState<{ target_topic: string | null; target_user: { username: string; avatar_url: string | null } | null }[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchObserves() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data } = await supabase
        .from('observes')
        .select(`
          target_topic,
          target_user:profiles!target_user_id(username, avatar_url)
        `)
        .eq('observer_id', user.id)
      
      if (data) {
        setObserves(data as unknown as { target_topic: string | null; target_user: { username: string; avatar_url: string | null } | null }[])
      }
      setLoading(false)
    }

    fetchObserves()
  }, [supabase])

  if (loading) return <div className="h-16 w-full animate-pulse bg-surface/50" />

  return (
    <div className="w-full border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <Link href="/explore">
            <ThunderBadge 
              variant="default" 
              className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
            >
              <Compass className="w-3 h-3" />
              For You
            </ThunderBadge>
          </Link>

          <Link href="/topics">
            <ThunderBadge 
              variant="outline" 
              className="cursor-pointer hover:bg-surface transition-colors flex items-center gap-1"
            >
              <Hash className="w-3 h-3" />
              Topics
            </ThunderBadge>
          </Link>

          <div className="w-px h-6 bg-border mx-2 shrink-0" />

          {observes.length === 0 ? (
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Observe topics to customize your feed
            </span>
          ) : (
            observes.map((obs, i) => (
              <Link 
                key={i} 
                href={obs.target_topic ? `/explore?topic=${obs.target_topic}` : `/u/${obs.target_user?.username}`}
              >
                <ThunderBadge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-surface transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  {obs.target_topic ? (
                    <>
                      <Hash className="w-3 h-3 text-primary" />
                      {obs.target_topic}
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 text-primary" />
                      {obs.target_user?.username || 'User'}
                    </>
                  )}
                </ThunderBadge>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
