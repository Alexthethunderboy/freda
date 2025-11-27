-- Fix the foreign key relationship to allow PostgREST joins
-- We need knowledge_items.author_id to reference public.profiles(id) instead of auth.users(id)

-- 1. Drop the existing constraint (referencing auth.users)
ALTER TABLE knowledge_items
DROP CONSTRAINT IF EXISTS knowledge_items_author_id_fkey;

-- 2. Add the new constraint (referencing public.profiles)
ALTER TABLE knowledge_items
ADD CONSTRAINT knowledge_items_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES public.profiles (id)
ON DELETE SET NULL;

-- 3. Verify the change (Optional, just for confirmation)
COMMENT ON CONSTRAINT knowledge_items_author_id_fkey ON knowledge_items IS 'Links to public.profiles for PostgREST joins';
