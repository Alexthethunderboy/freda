-- Add views_count column to knowledge_items
alter table knowledge_items 
add column if not exists views_count integer default 0;

-- Create a function to atomically increment view count
create or replace function increment_view_count(item_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update knowledge_items
  set views_count = views_count + 1
  where id = item_id;
end;
$$;

-- Grant execute permission to public (or authenticated if you prefer, but views can be public)
grant execute on function increment_view_count(uuid) to public;
grant execute on function increment_view_count(uuid) to anon;
grant execute on function increment_view_count(uuid) to authenticated;
