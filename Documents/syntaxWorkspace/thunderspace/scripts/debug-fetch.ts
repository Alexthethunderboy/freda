import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

async function debugFetch() {
  console.log('🔍 Testing direct fetch...')
  console.log('URL:', supabaseUrl!.substring(0, 20) + '...')

  const url = `${supabaseUrl}/rest/v1/knowledge_items?select=*&limit=5`
  
  try {
    const res = await fetch(url, {
      headers: {
        'apikey': supabaseKey!,
        'Authorization': `Bearer ${supabaseKey!}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Status:', res.status, res.statusText)
    const text = await res.text()
    console.log('Body:', text)
  } catch (err) {
    console.error('Fetch error:', err)
  }
}

debugFetch()
