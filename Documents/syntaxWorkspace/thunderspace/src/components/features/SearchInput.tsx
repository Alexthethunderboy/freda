'use client'

import { Search, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { useState, useTransition } from 'react'

export function SearchInput() {
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState(searchParams.get('q') || '')

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }
    
    startTransition(() => {
      replace(`/search?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="max-w-2xl relative mb-4">
      {isPending ? (
        <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      )}
      <input 
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          handleSearch(e.target.value)
        }}
        placeholder="Search archives..." 
        className="w-full h-12 pl-10 pr-4 bg-surface border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary transition-all"
      />
    </div>
  )
}
