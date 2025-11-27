'use client'

import { toast } from "sonner"
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ThunderButton } from '@/components/ui/design-system'
import { Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface OnboardingFormProps {
  userId: string
  email: string
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters")
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username,
          display_name: username,
          bio,
          updated_at: new Date().toISOString()
        })

      if (upsertError) throw upsertError

      toast.success("Dossier initialized successfully")

      // Refresh and redirect to the new profile
      router.refresh()
      router.push(`/u/${username}`)
      
    } catch (err: unknown) {
      console.error('Error creating profile:', err)
      const error = err as { message?: string };
      toast.error(error.message || 'Failed to create profile')
      setError(error.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-foreground font-mono"
            placeholder="username"
            required
          />
        </div>
        <p className="text-xs text-muted-foreground">Unique identifier for your dossier.</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-foreground resize-none"
          placeholder="Tell us about your research interests..."
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
          {error}
        </div>
      )}

      <ThunderButton type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Initializing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Initialize Dossier
          </>
        )}
      </ThunderButton>
    </form>
  )
}
