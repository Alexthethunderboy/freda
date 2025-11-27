-- Fix Orphaned Items & Foreign Key Relationship

-- 1. Remove knowledge_items that reference non-existent profiles
-- This fixes the "insert or update on table ... violates foreign key constraint" error
DELETE FROM knowledge_items
WHERE author_id NOT IN (SELECT id FROM profiles);

-- 2. Drop the old foreign key to auth.users (if it exists)
ALTER TABLE knowledge_items
DROP CONSTRAINT IF EXISTS knowledge_items_author_id_fkey;

-- 3. Add new foreign key to public.profiles
-- This ensures that all future items must have a valid profile author
ALTER TABLE knowledge_items
ADD CONSTRAINT knowledge_items_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES public.profiles (id)
ON DELETE SET NULL;

-- 4. Verify
COMMENT ON CONSTRAINT knowledge_items_author_id_fkey ON knowledge_items IS 'Links to public.profiles for PostgREST joins';
