import { createClient } from "@/lib/supabase/server";
import { DataTable } from "../users/data-table"; // Reusing the DataTable component
import { columns } from "./columns";
import { ThunderCard } from "@/components/ui/design-system";

export default async function DataManagementPage() {
  const supabase = await createClient();

  // Fetch all knowledge items
  const { data: items, error } = await supabase
    .from('knowledge_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching items:", error);
    return <div>Error loading data</div>;
  }

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headings">Data Management</h1>
        <p className="text-muted-foreground mt-2">Manage knowledge items and content.</p>
      </header>

      <ThunderCard className="p-6">
        <DataTable columns={columns} data={items || []} />
      </ThunderCard>
    </div>
  );
}
