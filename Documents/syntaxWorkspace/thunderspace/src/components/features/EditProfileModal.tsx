'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { ThunderButton, ThunderCard } from '@/components/ui/design-system'
import { Loader2, X, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  display_name?: string
  username?: string
  bio?: string
}

interface EditProfileModalProps {
  profile: Profile
  isOpen: boolean
  onClose: () => void
}

export function EditProfileModal({ profile, isOpen, onClose }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  if (!isOpen) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters")
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          username,
          bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id)

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully' })
      
      // If username changed, redirect to new profile page
      if (username !== profile.username) {
        window.location.href = `/u/${username}`
      } else {
        router.refresh()
        setTimeout(() => {
          onClose()
        }, 1000)
      }
    } catch (err: unknown) {
      console.error('Error updating profile:', err)
      const error = err as { message?: string; code?: string }
      
      // Fallback: Try updating ONLY username if schema is outdated
      if (error.message?.includes('Could not find') || error.code === 'PGRST204') {
        try {
          const { error: retryError } = await supabase
            .from('profiles')
            .update({
              username,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id)

          if (retryError) throw retryError

          setMessage({ type: 'success', text: 'Updated username only. (Bio requires DB upgrade)' })
          router.refresh()
          setTimeout(() => {
            onClose()
          }, 2000)
          return
        } catch {
          setMessage({ type: 'error', text: 'Database schema mismatch. Please run the migration script.' })
        }
      } else {
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
      }
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <ThunderCard className="w-full max-w-lg relative animate-unfold border-primary/20">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold font-headings">Edit Dossier</h2>
          <p className="text-sm text-muted-foreground">Update your public scholar identity.</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg mb-6 text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
              placeholder="Your Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Username</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-foreground font-mono"
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Biography</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-foreground resize-none"
              placeholder="Tell us about your research..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <ThunderButton type="button" variant="ghost" onClick={onClose}>
              Cancel
            </ThunderButton>
            <ThunderButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </ThunderButton>
          </div>
        </form>
      </ThunderCard>
    </div>,
    document.body
  )
}
