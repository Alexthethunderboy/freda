import { createClient } from "@/lib/supabase/server";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { ThunderCard } from "@/components/ui/design-system";

export default async function UsersPage() {
  const supabase = await createClient();

  // Fetch all profiles
  // In a real app with thousands of users, we would implement server-side pagination here
  // using searchParams (page, limit) and supabase.range()
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
    return <div>Error loading users</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headings">User Management</h1>
        <p className="text-muted-foreground mt-2">Manage user accounts, roles, and permissions.</p>
      </header>

      <ThunderCard className="p-6">
        <DataTable columns={columns} data={profiles || []} />
      </ThunderCard>
    </div>
  );
}
