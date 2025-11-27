
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

// 🔑 SERVICE_ROLE_KEY is required for seeding data (bypasses RLS policies)
// To find it: Supabase Dashboard → Settings → API → Copy "service_role" key
// Add to .env.local as: SUPABASE_SERVICE_ROLE_KEY=your_key_here
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  WARNING: Using anon key instead of service role key.')
  console.warn('   This will likely fail due to RLS policies.')
  console.warn('   Add SUPABASE_SERVICE_ROLE_KEY to .env.local for seeding.\n')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const TOPICS = ['History', 'Politics', 'Culture', 'Art', 'Philosophy', 'Economics', 'Technology', 'Literature']
const MEDIA_TYPES = ['pdf', 'audio', 'article']

const TITLES = [
  "The Unlearning of Colonial Habits",
  "Nigeria's Economic Future: A Critical Analysis",
  "Art as Resistance in Lagos",
  "Pre-Colonial Political Structures",
  "Modern African Philosophy",
  "The Digital Divide in Education",
  "Reimagining Urban Spaces",
  "Oral Traditions and Digital Media",
  "The Politics of Oil",
  "Cultural Preservation in the 21st Century"
]

const DESCRIPTIONS = [
  "An in-depth look at how we can deconstruct inherited systems.",
  "Exploring the intersection of tradition and modernity.",
  "A critical review of recent policy changes.",
  "Understanding the roots of our current social dynamics.",
  "A collection of essays on the future of the continent.",
  "Analyzing the impact of technology on local communities.",
  "A study of historical events that shaped the nation.",
  "Perspectives on identity and belonging.",
  "Investigating the role of art in social change.",
  "A comprehensive guide to understanding the local economy."
]

async function seed() {
  console.log('Starting seed...')

  // 1. Create a mock user/profile if it doesn't exist
  const email = `seed_${Date.now()}@example.com`
  const password = 'password123'
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  let userId = authData.user?.id

  if (authError) {
    console.log('Could not create new user, trying to sign in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com', // Try a default test user
      password: 'password123'
    })
    if (signInError) {
        console.error('Could not sign in. Please ensure you have a user or provide SERVICE_ROLE_KEY.')
        // Attempt to fetch *any* profile to use as author if we can't auth
        const { data: profiles } = await supabase.from('profiles').select('id').limit(1)
        if (profiles && profiles.length > 0) {
            userId = profiles[0].id
            console.log('Using existing profile:', userId)
        } else {
             console.error('No profiles found and cannot auth.')
        }
    } else {
        userId = signInData.user.id
    }
  }

  if (!userId) {
      console.log("Proceeding without explicit User ID (might fail if RLS is strict)")
  } else {
      console.log("Seeding data for User:", userId)
  }

  const items = []
  for (let i = 0; i < 20; i++) {
    const title = TITLES[Math.floor(Math.random() * TITLES.length)] + ` ${i + 1}`
    const description = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)]
    const type = MEDIA_TYPES[Math.floor(Math.random() * MEDIA_TYPES.length)]
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]
    
    items.push({
      title,
      description,
      media_type: type,
      media_url: type === 'pdf' ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : null,
      content_text: type === 'article' ? description.repeat(10) : null,
      topics: [topic],
      author_id: userId,
      created_at: new Date().toISOString()
    })
  }

  const { error } = await supabase.from('knowledge_items').insert(items)

  if (error) {
    if (error.code === 'PGRST205') {
        console.error('\n❌ Error: Table "knowledge_items" not found.')
        console.error('👉 Please run the SQL in "supabase/schema.sql" in your Supabase SQL Editor to create the tables.\n')
    } else {
        console.error('Error inserting items:', error)
    }
  } else {
    console.log('✅ Successfully inserted 20 items.')
  }
}

seed()
