
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load env vars from .env.local and .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  WARNING: Using anon key instead of service role key.')
  console.warn('   This will likely fail due to RLS policies.')
  console.warn('   Add SUPABASE_SERVICE_ROLE_KEY to .env.local for seeding.\n')
}

// Use service key if available to bypass RLS, otherwise use anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey

const supabase = createClient(supabaseUrl, supabaseKey!)

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
    console.log('Could not create new user:', authError.message)
    console.log('Trying to sign in with test user...')
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })
    
    if (signInError) {
        console.error('Could not sign in:', signInError.message)
        console.error('Please ensure you have a user or provide SUPABASE_SERVICE_ROLE_KEY in .env.local')
        
        // If we have a service key, we don't strictly need a user for the insert to work (RLS bypassed),
        // but we need a user_id for the author_id field.
        if (supabaseServiceKey) {
             console.log('Service key detected. Attempting to fetch an existing user to use as author...')
             const { data: users, error: userError } = await supabase.auth.admin.listUsers()
             if (users && users.users.length > 0) {
                 userId = users.users[0].id
                 console.log('Using existing user from admin list:', userId)
             } else {
                 console.log('No users found via admin API. Creating items with null author.')
             }
        } else {
             // Attempt to fetch *any* profile to use as author if we can't auth
            const { data: profiles } = await supabase.from('profiles').select('id').limit(1)
            if (profiles && profiles.length > 0) {
                userId = profiles[0].id
                console.log('Using existing profile:', userId)
            } else {
                 console.error('No profiles found and cannot auth.')
            }
        }
    } else {
        userId = signInData.user.id
        console.log('Signed in as test user:', userId)
    }
  } else {
      userId = authData.user?.id
      console.log('Created and signed in as new user:', userId)
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
