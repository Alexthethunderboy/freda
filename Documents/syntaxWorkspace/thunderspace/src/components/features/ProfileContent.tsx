'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArchiveCard, KnowledgeItem } from './ArchiveCard'
import { FolderOpen, Layers, Settings, PlusCircle } from 'lucide-react'
import { SettingsContainer } from '../settings/SettingsContainer'
import { RichPreviewModal } from './RichPreviewModal'
import { ThunderButton } from '../ui/design-system'
import Link from 'next/link'

interface ProfileContentProps {
  archives: KnowledgeItem[]
  collections?: unknown[]
  isOwnProfile?: boolean
  profile?: unknown
}

export function ProfileContent({ archives, collections = [], isOwnProfile = false, profile }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'contributions' | 'collections' | 'settings'>('contributions')
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)

  return (
    <div className="space-y-8">
      {/* Header with Tabs and Action */}
      <div className="flex items-center justify-between border-b border-white/10 pb-px">
        <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('contributions')}
            className={`relative pb-4 text-sm font-medium tracking-wider uppercase transition-colors whitespace-nowrap ${
              activeTab === 'contributions' ? 'text-white' : 'text-text-muted hover:text-white/70'
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Contributions
            </span>
            {activeTab === 'contributions' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('collections')}
            className={`relative pb-4 text-sm font-medium tracking-wider uppercase transition-colors whitespace-nowrap ${
              activeTab === 'collections' ? 'text-white' : 'text-text-muted hover:text-white/70'
            }`}
          >
            <span className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Collections
            </span>
            {activeTab === 'collections' && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              />
            )}
          </button>

          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`relative pb-4 text-sm font-medium tracking-wider uppercase transition-colors whitespace-nowrap ${
                activeTab === 'settings' ? 'text-white' : 'text-text-muted hover:text-white/70'
              }`}
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </span>
              {activeTab === 'settings' && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-electric-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                />
              )}
            </button>
          )}
        </div>

        {isOwnProfile && (
          <Link href="/upload" className="hidden md:block pb-2">
            <ThunderButton size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Archive
            </ThunderButton>
          </Link>
        )}
      </div>

      {/* Content Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'contributions' && (
            archives.length > 0 ? (
              <div className="columns-1 md:columns-2 gap-6 space-y-6">
                {archives.map((item) => (
                  <div key={item.id} className="break-inside-avoid">
                    <ArchiveCard item={item} onClick={setSelectedItem} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="Research in Progress" 
                description="This scholar is currently compiling their findings. Check back soon for published archives." 
              />
            )
          )}

          {activeTab === 'collections' && (
            collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Collection cards would go here */}
                <div className="p-8 border border-dashed border-white/10 rounded-xl text-center text-text-muted">
                  Collections implementation coming soon.
                </div>
              </div>
            ) : (
              <EmptyState 
                title="Empty Cabinet" 
                description="No curated collections have been made public yet." 
              />
            )
          )}

          {activeTab === 'settings' && isOwnProfile && (
            <div className="bg-surface/50 rounded-xl border border-white/5 overflow-hidden">
               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
               <SettingsContainer profile={profile as any} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedItem && (
          <RichPreviewModal 
            item={{
              ...selectedItem,
              type: selectedItem.media_type,
              summary: selectedItem.description,
              url: selectedItem.media_url || undefined,
              file: selectedItem.media_type === 'pdf' ? (selectedItem.media_url || undefined) : undefined,
              publicationDate: selectedItem.created_at,
              author: selectedItem.author ? { name: selectedItem.author.display_name } : undefined,
              topics: selectedItem.topics.map(t => ({ title: t }))
            }} 
            onClose={() => setSelectedItem(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-xl bg-white/5">
      <div className="w-20 h-20 mb-6 rounded-full bg-surface border border-white/10 flex items-center justify-center">
        <Layers className="w-8 h-8 text-text-muted opacity-50" />
      </div>
      <h3 className="text-xl font-bold font-headings text-white mb-2">{title}</h3>
      <p className="text-text-secondary max-w-md">{description}</p>
    </div>
  )
}
