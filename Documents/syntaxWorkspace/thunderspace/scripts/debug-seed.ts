import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debug() {
  console.log('🔍 Starting debug...')

  // 1. Try to select (Read test)
  console.log('👉 Testing SELECT...')
  const { data: selectData, error: selectError } = await supabase.from('knowledge_items').select('count', { count: 'exact', head: true })
  
  if (selectError) {
    console.error('❌ SELECT failed:', JSON.stringify(selectError, null, 2))
  } else {
    console.log('✅ SELECT success. Count:', selectData)
  }

  // 2. Try to insert one item (Write test)
  console.log('👉 Testing INSERT...')
  const item = {
    title: "Debug Item " + Date.now(),
    description: "Debug description",
    media_type: "article",
    topics: ["Technology"],
    // No author_id
  }

  const { data: insertData, error: insertError } = await supabase.from('knowledge_items').insert(item).select()

  if (insertError) {
    console.error('❌ INSERT failed:', JSON.stringify(insertError, null, 2))
  } else {
    console.log('✅ INSERT success:', insertData)
  }
}

debug()
