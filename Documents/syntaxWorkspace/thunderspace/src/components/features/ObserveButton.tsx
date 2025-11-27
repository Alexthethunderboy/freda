'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from "sonner"
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ObserveButtonProps {
  entityId?: string // ID of the User or Topic (optional if topic string is used directly, but spec says entityId)
  entityType: 'author' | 'topic'
  targetUserId?: string // Backwards compatibility or mapping
  topic?: string // Backwards compatibility or mapping
  initialIsObserving?: boolean
  onToggle?: () => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function ObserveButton({ 
  entityId, 
  entityType, 
  targetUserId, 
  topic, 
  initialIsObserving = false, 
  onToggle, 
  className, 
  size = 'sm' 
}: ObserveButtonProps) {
  const [loading, setLoading] = useState(false)
  const [isObserving, setIsObserving] = useState(initialIsObserving)
  const supabase = createClient()
  const router = useRouter()

  // Resolve actual target ID/Topic from props
  const resolvedTargetUserId = targetUserId || (entityType === 'author' ? entityId : undefined)
  const resolvedTopic = topic || (entityType === 'topic' ? entityId : undefined)

  const checkStatus = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase.from('observes').select('id').eq('observer_id', user.id)

      if (resolvedTargetUserId) {
        query = query.eq('target_user_id', resolvedTargetUserId)
      } else if (resolvedTopic) {
        query = query.eq('target_topic', resolvedTopic)
      } else {
        return
      }

      const { data } = await query.single()
      if (data) setIsObserving(true)
    } catch {
      // Ignore error if row not found
    }
  }, [supabase, resolvedTargetUserId, resolvedTopic])

  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  const handleObserve = async () => {
    if (!resolvedTargetUserId && !resolvedTopic) {
      console.error("No target specified for observation")
      return
    }

    // Optimistic UI
    const previousState = isObserving
    setIsObserving(!previousState)
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      if (previousState) {
        // Unobserve
        let query = supabase.from('observes').delete().eq('observer_id', user.id)
        
        if (resolvedTargetUserId) {
          query = query.eq('target_user_id', resolvedTargetUserId)
        } else if (resolvedTopic) {
          query = query.eq('target_topic', resolvedTopic)
        }

        const { error } = await query
        if (error) throw error
        
        toast.success(`Unobserved ${entityType}`)
      } else {
        // Observe
        const { error } = await supabase
          .from('observes')
          .insert({
            observer_id: user.id,
            target_user_id: resolvedTargetUserId,
            target_topic: resolvedTopic
          })

        if (error) throw error
        
        toast.success(`Observing ${entityType}`)
      }

      if (onToggle) onToggle()
      router.refresh()

    } catch (err) {
      console.error("Observation Error:", JSON.stringify(err, null, 2))
      setIsObserving(previousState) // Rollback
      toast.error("Failed to update observation status")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleObserve}
      disabled={loading}
      className={`
        group relative flex items-center justify-center gap-2 rounded-full transition-all duration-300 font-medium overflow-hidden
        ${size === 'sm' ? 'px-4 py-2 text-xs' : size === 'md' ? 'px-6 py-2.5 text-sm' : 'px-8 py-3 text-sm'}
        ${className}
        ${loading ? 'opacity-80 cursor-wait' : ''}
      `}
    >
      {/* Background Layer */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        isObserving 
          ? 'bg-white/10 border border-white/20' 
          : 'bg-linear-to-r from-primary via-electric-blue to-purple-600 opacity-100 group-hover:opacity-90'
      }`} />
      
      {/* Content Layer */}
      <div className={`relative flex items-center gap-2 ${isObserving ? 'text-white' : 'text-white'}`}>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isObserving ? (
          <Eye className="w-4 h-4 text-green-400" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
        <span className="uppercase tracking-wider font-bold">
          {isObserving ? 'Observing' : 'Observe'}
        </span>
      </div>
    </button>
  )
}
