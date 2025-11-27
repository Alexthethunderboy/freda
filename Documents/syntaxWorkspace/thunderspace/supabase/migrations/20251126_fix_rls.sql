-- Ensure knowledge_items has public read policy
DROP POLICY IF EXISTS "Public knowledge items are viewable by everyone" ON knowledge_items;
CREATE POLICY "Public knowledge items are viewable by everyone" ON knowledge_items FOR SELECT USING (true);

-- Ensure profiles are viewable by everyone
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);

-- Bookmarks Policies
DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON bookmarks;
CREATE POLICY "Users can manage their own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Observes Policies
DROP POLICY IF EXISTS "Users can manage their own observations" ON observes;
CREATE POLICY "Users can manage their own observations" ON observes FOR ALL USING (auth.uid() = observer_id);

-- Folders Policies
DROP POLICY IF EXISTS "Users can manage their own folders" ON folders;
CREATE POLICY "Users can manage their own folders" ON folders FOR ALL USING (auth.uid() = user_id);
