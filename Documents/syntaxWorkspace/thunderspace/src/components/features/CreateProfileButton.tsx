'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ThunderButton } from '@/components/ui/design-system'
import { Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CreateProfileButtonProps {
  userId: string
  username: string
}

export function CreateProfileButton({ userId, username }: CreateProfileButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreateProfile = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: username,
          display_name: username,
          bio: 'Scholar of the Thunder Archive.',
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      router.refresh()
    } catch (error: unknown) {
      console.error('Error creating profile (full):', error)
      const err = error as { message?: string; code?: string }
      
      // Fallback: Try creating with minimal fields if schema is outdated
      if (err.message?.includes('Could not find') || err.code === 'PGRST204') {
        try {
          console.log('Retrying with minimal fields...')
          const { error: retryError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              username: username,
              updated_at: new Date().toISOString()
            })
          
          if (retryError) throw retryError
          
          router.refresh()
          return // Success on retry
        } catch (retryError: unknown) {
          const retryErr = retryError as { message?: string }
          console.error('Error creating profile (retry):', retryErr)
          alert(`Failed to initialize dossier: ${retryErr.message}`)
        }
      } else {
        alert(`Failed to initialize dossier: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThunderButton 
      onClick={handleCreateProfile} 
      disabled={loading}
      size="lg"
      className="w-full sm:w-auto"
    >
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
  )
}
