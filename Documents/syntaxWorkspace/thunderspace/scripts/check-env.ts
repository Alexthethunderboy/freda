import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const service = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Checking keys...')
if (!anon) console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing')
if (!service) console.log('❌ SUPABASE_SERVICE_ROLE_KEY is missing')

if (anon && service) {
    if (anon === service) {
        console.log('❌ CRITICAL: NEXT_PUBLIC_SUPABASE_ANON_KEY is identical to SUPABASE_SERVICE_ROLE_KEY!')
        console.log('   Please update .env.local to use the correct Anon key.')
    } else {
        console.log('✅ Keys are different.')
        console.log('Anon length:', anon.length)
        console.log('Service length:', service.length)
        if (anon.startsWith('ey') && service.startsWith('ey')) {
             console.log('✅ Both start with "ey" (JWT format)')
        }
    }
}
