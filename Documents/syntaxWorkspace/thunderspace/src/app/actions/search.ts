'use server'

import { createClient } from '@/lib/supabase/server'

export type SearchResult = {
  id: string
  title: string
  description: string | null
  media_type: string | null
  topics: string[] | null
  author_id: string | null
}

export async function searchKnowledgeItems(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  const supabase = await createClient()
  
  // Perform a simple OR search across multiple columns
  // Note: For production, consider using Supabase's full text search capabilities
  const { data, error } = await supabase
    .from('knowledge_items')
    .select('id, title, description, media_type, topics, author_id')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,topics.cs.{${query}}`) // topics.cs checks if array contains value
    .limit(10)

  if (error) {
    console.error('Search error:', error)
    return []
  }

  return data || []
}
