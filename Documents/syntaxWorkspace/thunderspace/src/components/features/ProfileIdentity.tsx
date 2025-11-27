'use client'

import { LibraryCard } from './LibraryCard'
import { ThunderButton, ThunderCard, ThunderBadge } from '@/components/ui/design-system'
import { Calendar, ShieldCheck, Edit, BookOpen } from 'lucide-react';
import { ObserveButton } from './ObserveButton'
import Image from 'next/image'

interface Profile {
  id: string;
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string | null;
  is_verified?: boolean;
  [key: string]: unknown;
}

interface ProfileIdentityProps {
  profile: Profile
  isOwnProfile: boolean
  stats: {
    joinedYear: string
    contributions: number
  }
}

import { useState, useRef } from 'react'
import { EditProfileModal } from './EditProfileModal'
import { toPng } from 'html-to-image'
import { toast } from 'sonner'
import { Download } from 'lucide-react'

// ... imports

export function ProfileIdentity({ profile, isOwnProfile, stats }: ProfileIdentityProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const downloadRef = useRef<HTMLDivElement>(null)

  const handleDownloadCard = async () => {
    if (!downloadRef.current) return

    try {
      // Capture the hidden, flat card
      const dataUrl = await toPng(downloadRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, // Higher quality
        backgroundColor: 'transparent'
      })
      const link = document.createElement('a')
      link.download = `${profile.username}-library-card.png`
      link.href = dataUrl
      link.click()
      toast.success("Library Card downloaded successfully")
    } catch (err) {
      console.error(err)
      toast.error("Failed to download Library Card")
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hidden Card for Capture - Clean, no transforms */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none">
        <div ref={downloadRef} className="w-[600px]"> {/* Fixed width for consistent high-res export */}
          <LibraryCard 
            username={profile.username} 
            userId={profile.id} 
            showDownload={false}
          />
        </div>
      </div>

      {/* Hero: Library Card with Glow */}
      <div className="relative group perspective-1000">
        <div className="transform transition-transform duration-700 group-hover:rotate-y-6 group-hover:rotate-x-6 preserve-3d">
          <LibraryCard 
            username={profile.username} 
            userId={profile.id} 
            className="shadow-2xl shadow-black/50 border-white/10"
            showDownload={false} 
          />
        </div>
        {/* Organic Glow */}
        <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-secondary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-700 -z-10" />
      </div>

      <div className="px-8 pb-8 pt-6 relative">
        <div className={`flex flex-col md:flex-row items-start ${profile.avatar_url ? 'md:items-end' : ''} gap-6`}>
          {/* Avatar */}
          {/* Avatar */}
          {profile.avatar_url && (
            <div className="relative group">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-surface bg-surface shadow-2xl relative z-10">
                <Image 
                  src={profile.avatar_url} 
                  alt={profile.display_name || profile.username} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="absolute -inset-2 bg-linear-to-r from-primary via-electric-blue to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
            </div>
          )}

      {/* Identity Info */}
      <div className="space-y-6 flex-1">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-headings tracking-tight text-white leading-none flex items-center gap-3">
            {profile.display_name || profile.username}
            {profile.is_verified && <ShieldCheck className="w-6 h-6 text-primary" />}
          </h1>
          <p className="text-sm font-mono text-primary mt-2 opacity-80 flex items-center gap-2">
            @{profile.username.toLowerCase().replace(/\s+/g, '')}
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-muted-foreground">Scholar ID: {profile.id.slice(0, 8)}</span>
          </p>
        </div>

        {/* Bio Plaque */}
        <ThunderCard className="relative p-6 border-l-2 border-l-primary border-y-0 border-r-0 rounded-r-xl bg-linear-to-r from-white/5 to-transparent backdrop-blur-sm">
          <p className="text-muted-foreground leading-relaxed font-light italic">
            &quot;{profile.bio || "This scholar has not yet inscribed their biography. The dossier remains incomplete."}&quot;
          </p>
        </ThunderCard>
      </div>
    </div>

      {/* Action Stack */}
      <div className="space-y-3 mt-6">
        {isOwnProfile ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ThunderButton 
                variant="outline" 
                className="w-full justify-between group h-12"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Dossier
                <Edit className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </ThunderButton>
              
              <ThunderButton 
                variant="outline" 
                className="w-full justify-between group h-12"
                onClick={handleDownloadCard}
              >
                Get Card
                <Download className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </ThunderButton>
            </div>
            
            <EditProfileModal 
              profile={profile} 
              isOpen={isEditModalOpen} 
              onClose={() => setIsEditModalOpen(false)} 
            />
          </>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <ObserveButton entityId={profile.id} entityType="author" size="lg" />
          </div>
        )}
      </div>

      {/* Metadata Footer */}
      <div className="pt-6 border-t border-white/10 flex flex-col gap-3 text-xs font-mono text-muted-foreground mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-primary" />
            <span>Joined {stats.joinedYear}</span>
          </div>
          <ThunderBadge variant="outline" className="opacity-50">SCHOLAR</ThunderBadge>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-3 h-3 text-primary" />
          <span>{stats.contributions} Contributions</span>
        </div>
      </div>
    </div>
  </div>
  )
}
