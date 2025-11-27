import { createClient } from "@/lib/supabase/server";
import { ThunderCard } from "@/components/ui/design-system";
import { Users, Database, HardDrive, Activity } from "lucide-react";
import { LineChart, BarChart } from "@/components/admin/charts";

import { TopicsManager } from "@/components/admin/TopicsManager";
import { ArchivesManager } from "@/components/admin/ArchivesManager";

export default async function AdminPage() {
  const supabase = await createClient();
  
  // 1. Fetch Key Metrics
  const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  const { count: archiveCount } = await supabase.from('knowledge_items').select('*', { count: 'exact', head: true });
  
  // Mock storage stat (would need RLS on storage buckets or admin API to get real size)
  const storageUsed = "1.2 GB";

  // 2. Fetch Data for User Growth Chart (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', sevenDaysAgo.toISOString());

  // Aggregate users by day
  const signupMap = new Map<string, number>();
  // Initialize last 7 days with 0
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    signupMap.set(d.toLocaleDateString(), 0);
  }

  recentUsers?.forEach(user => {
    const date = new Date(user.created_at || '').toLocaleDateString();
    if (signupMap.has(date)) {
      signupMap.set(date, (signupMap.get(date) || 0) + 1);
    }
  });

  const signupData = Array.from(signupMap.entries())
    .map(([name, value]) => ({ name, value }))
    .reverse(); // Show oldest to newest

  // 3. Fetch Data for System Activity (Total Counts for now as proxy)
  const { count: observesCount } = await supabase.from('observes').select('*', { count: 'exact', head: true });
  const { count: foldersCount } = await supabase.from('folders').select('*', { count: 'exact', head: true });
  const { count: bookmarksCount } = await supabase.from('bookmarks').select('*', { count: 'exact', head: true });

  const activityData = [
    { name: 'Archives', value: archiveCount || 0 },
    { name: 'Observes', value: observesCount || 0 },
    { name: 'Folders', value: foldersCount || 0 },
    { name: 'Bookmarks', value: bookmarksCount || 0 },
  ];

  // 4. Fetch Topics for Management
  const { data: topics } = await supabase.from('topics').select('*').order('title');

  // 5. Fetch Archives for Management (New)
  const { data: archivesData } = await supabase
    .from('knowledge_items')
    .select('id, title, created_at, media_type, author:profiles!author_id(username)')
    .order('created_at', { ascending: false })
    .limit(50);

  // Transform data to match ArchiveItem interface (author array -> single object)
  const archives = archivesData?.map(item => ({
    ...item,
    author: Array.isArray(item.author) ? item.author[0] : item.author
  })) || [];

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headings">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">System performance and key metrics.</p>
      </header>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={userCount || 0} 
          icon={Users} 
          trend="Lifetime"
        />
        <StatCard 
          title="Total Archives" 
          value={archiveCount || 0} 
          icon={Database} 
          trend="Lifetime"
        />
        <StatCard 
          title="Storage Used" 
          value={storageUsed} 
          icon={HardDrive} 
          trend="Estimated"
        />
        <StatCard 
          title="System Health" 
          value="98%" 
          icon={Activity} 
          trend="Operational"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ThunderCard className="p-6">
          <h3 className="text-xl font-bold font-headings mb-6">User Growth (Last 7 Days)</h3>
          <LineChart data={signupData} />
        </ThunderCard>

        <ThunderCard className="p-6">
          <h3 className="text-xl font-bold font-headings mb-6">Content Distribution</h3>
          <BarChart data={activityData} />
        </ThunderCard>
      </div>

      {/* Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <ArchivesManager initialArchives={archives || []} />
        </div>
        
        <div className="lg:col-span-1">
          <TopicsManager initialTopics={topics || []} />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend: string;
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <ThunderCard className="p-6 flex items-start justify-between hover:border-primary/50 transition-colors">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-bold font-headings">{value}</h3>
        <p className="text-xs text-green-500 mt-2">{trend}</p>
      </div>
      <div className="p-3 bg-primary/10 rounded-lg text-primary">
        <Icon className="w-6 h-6" />
      </div>
    </ThunderCard>
  );
}
