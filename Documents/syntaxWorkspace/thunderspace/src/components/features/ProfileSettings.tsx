'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ThunderButton, ThunderCard } from '@/components/ui/design-system'
import { Settings, Save, Loader2, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string;
  username: string;
  settings?: {
    analytics_enabled?: boolean;
    public_profile?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface ProfileSettingsProps {
  profile: Profile
}

export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const [username, setUsername] = useState(profile?.username || '')
  const [loading, setLoading] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(profile?.settings?.analytics_enabled ?? true)
  const [publicProfile, setPublicProfile] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          settings: {
            ...profile?.settings,
            analytics_enabled: analyticsEnabled,
            public_profile: publicProfile
          }
        })
        .eq('id', profile.id)

      if (!error) {
        router.refresh()
      } else {
        console.error('Error updating profile:', error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThunderCard className="p-6 space-y-6">
      <h3 className="font-bold flex items-center gap-2">
        <Settings className="w-4 h-4" /> Settings
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter username"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm">Enable Analytics</span>
          <button 
            onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
            className={`w-8 h-4 rounded-full relative transition-colors ${analyticsEnabled ? 'bg-primary' : 'bg-muted'}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${analyticsEnabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm">Public Profile</span>
          <button 
            onClick={() => setPublicProfile(!publicProfile)}
            className={`w-8 h-4 rounded-full relative transition-colors ${publicProfile ? 'bg-primary' : 'bg-muted'}`}
          >
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${publicProfile ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        <ThunderButton 
          onClick={handleSave} 
          disabled={loading} 
          className="w-full"
          size="sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </ThunderButton>
      </div>

      <div className="pt-4 border-t border-border">
        <form action="/auth/signout" method="post">
          <button className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium py-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </ThunderCard>
  )
}
