import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const TOPICS = [
  // Sciences
  { title: 'Physics', color: '#3B82F6', description: 'Matter, energy, space, time, and the fundamental forces of the universe.' },
  { title: 'Biology', color: '#10B981', description: 'Life, organisms, genetics, evolution, and biological systems.' },
  { title: 'Chemistry', color: '#F59E0B', description: 'Substances, properties, reactions, and the composition of matter.' },
  { title: 'Astronomy', color: '#6366F1', description: 'Celestial bodies, the cosmos, and the universe beyond Earth.' },
  { title: 'Earth Science', color: '#22C55E', description: 'Geology, meteorology, oceanography, and planetary systems.' },
  { title: 'Computer Science', color: '#0EA5E9', description: 'Computation, algorithms, AI, and information systems.' },
  { title: 'Mathematics', color: '#8B5CF6', description: 'Numbers, structure, space, change, and logic.' },
  { title: 'Medicine', color: '#EF4444', description: 'Health, disease, treatment, and medical research.' },
  
  // Humanities
  { title: 'History', color: '#D97706', description: 'Past events, civilizations, and the evolution of human societies.' },
  { title: 'Philosophy', color: '#A855F7', description: 'Fundamental questions about existence, knowledge, values, and reason.' },
  { title: 'Literature', color: '#F97316', description: 'Written works, poetry, storytelling, and literary analysis.' },
  { title: 'Linguistics', color: '#EC4899', description: 'Language, structure, meaning, and communication.' },
  { title: 'Religion', color: '#14B8A6', description: 'Belief systems, spirituality, theology, and ritual practices.' },
  { title: 'Archaeology', color: '#B45309', description: 'Human history and prehistory through the excavation of artifacts.' },
  
  // Social Sciences
  { title: 'Psychology', color: '#D946EF', description: 'The mind, behavior, mental processes, and emotional experience.' },
  { title: 'Sociology', color: '#84CC16', description: 'Society, social behavior, culture, and community dynamics.' },
  { title: 'Economics', color: '#10B981', description: 'Production, distribution, consumption, and wealth.' },
  { title: 'Political Science', color: '#EF4444', description: 'Governance, power, policy, and international relations.' },
  { title: 'Anthropology', color: '#F43F5E', description: 'Human societies, cultures, and their development.' },
  { title: 'Geography', color: '#06B6D4', description: 'Places, environments, and the relationship between people and their surroundings.' },
  
  // Arts
  { title: 'Visual Arts', color: '#F472B6', description: 'Painting, sculpture, drawing, and visual expression.' },
  { title: 'Music', color: '#8B5CF6', description: 'Sound, composition, performance, and musical theory.' },
  { title: 'Cinema', color: '#F43F5E', description: 'Film, filmmaking, screenwriting, and cinematic history.' },
  { title: 'Architecture', color: '#64748B', description: 'Design, construction, and the built environment.' },
  { title: 'Performing Arts', color: '#A855F7', description: 'Theater, dance, opera, and live performance.' },
  { title: 'Design', color: '#EC4899', description: 'Graphic design, industrial design, fashion, and user experience.' },
  
  // Applied Fields
  { title: 'Engineering', color: '#3B82F6', description: 'Application of science to build structures, machines, and systems.' },
  { title: 'Business', color: '#14B8A6', description: 'Commerce, management, entrepreneurship, and corporate strategy.' },
  { title: 'Law', color: '#78716C', description: 'Legal systems, justice, rights, and regulations.' },
  { title: 'Education', color: '#F59E0B', description: 'Teaching, learning, pedagogy, and educational systems.' },
  { title: 'Journalism', color: '#6366F1', description: 'News, reporting, media, and mass communication.' },
  { title: 'Agriculture', color: '#65A30D', description: 'Farming, food production, and sustainable land use.' },
  
  // Missing Topics from Seed Data
  { title: 'Art', color: '#EC4899', description: 'Creative expression and cultural artifacts.' },
  { title: 'Politics', color: '#EF4444', description: 'Governance, power dynamics, and public policy.' },
  { title: 'Culture', color: '#8B5CF6', description: 'Social behavior, institutions, and norms found in human societies.' },
  { title: 'Technology', color: '#0EA5E9', description: 'The application of scientific knowledge for practical purposes.' },
]

async function seedTopics() {
  console.log('🌱 Seeding Supabase topics...')

  for (const topic of TOPICS) {
    const slug = topic.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
    
    const { error } = await supabase
      .from('topics')
      .upsert({
        title: topic.title,
        slug: slug,
        description: topic.description,
        color_hex: topic.color,
      }, { onConflict: 'slug' })

    if (error) {
      console.error(`❌ Failed to upsert ${topic.title}:`, error.message)
    } else {
      console.log(`✅ Upserted topic: ${topic.title}`)
    }
  }

  console.log('✨ Topic seeding complete!')
}

seedTopics()
