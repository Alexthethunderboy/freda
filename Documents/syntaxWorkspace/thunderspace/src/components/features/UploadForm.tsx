"use client"

import * as React from "react"
import { toast } from "sonner"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ThunderButton, ThunderCard, cn } from "@/components/ui/design-system"
import { Upload, FileText, Music, File, Loader2, Image as ImageIcon } from "lucide-react"

export function UploadForm() {
  const router = useRouter()
  const supabase = createClient()
  const [isUploading, setIsUploading] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)
  const [thumbnail, setThumbnail] = React.useState<File | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const [existingTopics, setExistingTopics] = React.useState<string[]>([])
  
  // Form State
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [mediaType, setMediaType] = React.useState<"pdf" | "audio" | "article">("pdf")
  const [selectedTopic, setSelectedTopic] = React.useState("")

  React.useEffect(() => {
    async function fetchTopics() {
      const { data } = await supabase.from('topics').select('title')
      if (data) {
        setExistingTopics(data.map(t => t.title))
      }
    }
    fetchTopics()
  }, [supabase])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file && mediaType !== 'article') return
    if (!title) return

    setIsUploading(true)

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // 2. Upload file if needed
      let mediaUrl = ""
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Math.random()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('knowledge_assets')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('knowledge_assets')
          .getPublicUrl(fileName)
        
        mediaUrl = publicUrl
      }

      // 3. Upload thumbnail if provided
      let thumbnailUrl = ""
      if (thumbnail) {
        const fileExt = thumbnail.name.split('.').pop()
        const fileName = `${user.id}/thumb_${Math.random()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('knowledge_assets')
          .upload(fileName, thumbnail)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('knowledge_assets')
            .getPublicUrl(fileName)
          thumbnailUrl = publicUrl
        }
      }

      // 4. Insert record
      const { error: insertError } = await supabase
        .from('knowledge_items')
        .insert({
          title,
          description,
          media_type: mediaType,
          media_url: mediaUrl,
          thumbnail_url: thumbnailUrl || null,
          topics: selectedTopic ? [selectedTopic] : [],
          author_id: user.id,
          content_text: mediaType === 'article' ? description : null
        })

      if (insertError) throw insertError

      // 5. Get profile for redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
      

      const username = profile?.username || user.email?.split('@')[0]
      toast.success("Knowledge uploaded successfully")
      router.push(`/u/${username}`)
      router.refresh()
    } catch (error) {
      console.error('Error uploading:', error)
      toast.error("Failed to upload content")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <ThunderCard className="max-w-2xl mx-auto mt-8 p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-medium tracking-tight">Upload Knowledge</h1>
          <p className="text-muted-foreground">Share your research with the community.</p>
        </div>

        {/* Media Type Selection */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'pdf', icon: FileText, label: 'PDF Document' },
            { id: 'audio', icon: Music, label: 'Audio File' },
            { id: 'article', icon: File, label: 'Article' }
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setMediaType(type.id as "pdf" | "audio" | "article")}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border transition-all",
                mediaType === type.id 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-border hover:bg-muted/50 text-muted-foreground"
              )}
            >
              <type.icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{type.label}</span>
            </button>
          ))}
        </div>

        {/* File Upload Area */}
        {mediaType !== 'article' && (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-12 text-center transition-colors",
              dragActive ? "border-primary bg-primary/5" : "border-border",
              file ? "bg-muted/30" : "hover:bg-muted/10"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              accept={mediaType === 'pdf' ? '.pdf' : 'audio/*'}
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="w-10 h-10 text-primary mb-2" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setFile(null)
                  }}
                  className="mt-4 text-sm text-red-500 hover:underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-10 h-10 text-muted-foreground mb-4" />
                <p className="font-medium">Drag & drop or click to upload</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports {mediaType === 'pdf' ? 'PDF' : 'MP3, WAV'} files
                </p>
              </div>
            )}
          </div>
        )}

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Cover Image (Optional)</label>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 border border-border rounded-md overflow-hidden bg-muted/20 flex items-center justify-center group">
              {thumbnail ? (
                <Image 
                  src={URL.createObjectURL(thumbnail)} 
                  alt="Preview" 
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground opacity-50" />
              )}
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleThumbnailChange}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Upload a custom thumbnail for your content.</p>
              <p className="text-xs opacity-70">Recommended: 16:9 aspect ratio</p>
            </div>
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-border bg-transparent focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., The History of Pre-Colonial Nigeria"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description / Abstract</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-32 px-3 py-2 rounded-md border border-border bg-transparent focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              placeholder="Provide a brief summary of the content..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Topic</label>
            <div className="relative">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full h-10 px-3 pr-10 rounded-md border border-border bg-surface/50 focus:outline-none focus:ring-1 focus:ring-primary appearance-none transition-colors"
                disabled={existingTopics.length === 0}
              >
                <option value="" disabled>Select a topic</option>
                {existingTopics.map(topic => (
                  <option key={topic} value={topic} className="bg-surface text-foreground">{topic}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </div>
            </div>
            {existingTopics.length === 0 && (
              <p className="text-xs text-amber-500 mt-1">
                No topics found. Please add topics in the Admin Dashboard first.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <ThunderButton 
            type="submit" 
            disabled={isUploading || (!file && mediaType !== 'article')}
            className="w-full sm:w-auto"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Publish Content'
            )}
          </ThunderButton>
        </div>
      </form>
    </ThunderCard>
  )
}
