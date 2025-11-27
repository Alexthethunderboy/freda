'use server'

import { createClient } from '@/lib/supabase/server'

export async function incrementViewCount(itemId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.rpc('increment_view_count', {
    item_id: itemId
  })

  if (error) {
    console.error('Error incrementing view count:', error)
  }
}
