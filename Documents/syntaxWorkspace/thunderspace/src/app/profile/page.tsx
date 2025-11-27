import { createClient } from "@/lib/supabase/server";
import { ThunderCard, ThunderButton, ThunderBadge } from "@/components/ui/design-system";
import { BarChart, Upload, User as UserIcon, Shield } from "lucide-react";
import Link from "next/link";
import { LibraryCard } from "@/components/features/LibraryCard";
import { ProfileSettings } from "@/components/features/ProfileSettings";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container max-w-md mx-auto py-20 px-4 text-center min-h-[60vh] flex flex-col justify-center">
        <ThunderCard className="p-10 space-y-8 border-dashed">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-headings">Join the Archive</h1>
            <p className="text-muted-foreground leading-relaxed">
              Sign in to curate your collections, track your impact, and contribute to the knowledge base.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/login" className="w-full">
              <ThunderButton className="w-full" size="lg">Sign In</ThunderButton>
            </Link>
            <Link href="/signup" className="w-full">
              <ThunderButton variant="outline" className="w-full" size="lg">Create Account</ThunderButton>
            </Link>
          </div>
        </ThunderCard>
      </div>
    );
  }

  // Fetch profile data
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 space-y-8">
      {/* Header with Library Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
          <LibraryCard 
            username={profile?.username || user.email?.split('@')[0] || 'Scholar'} 
            userId={user.id} 
            className="shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500"
            showDownload={true}
          />
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold font-headings mb-2">{profile?.username || user.email?.split('@')[0]}</h1>
              <p className="text-muted-foreground font-mono">{user.email}</p>
              <div className="flex gap-2 mt-4">
                <ThunderBadge variant="outline">Scholar</ThunderBadge>
                <ThunderBadge variant="primary">Contributor</ThunderBadge>
              </div>
            </div>
            <Link href="/upload">
              <ThunderButton size="lg">
                <Upload className="w-4 h-4 mr-2" />
                Upload Knowledge
              </ThunderButton>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ThunderCard className="p-6 bg-surface/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Reads</p>
              <p className="text-3xl font-bold font-mono">1,248</p>
            </ThunderCard>
            <ThunderCard className="p-6 bg-surface/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Contributions</p>
              <p className="text-3xl font-bold font-mono">12</p>
            </ThunderCard>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-border pb-2">
              <Shield className="w-5 h-5" /> Recent Activity
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <ThunderCard key={i} className="p-4 hover:bg-surface/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">Uploaded &quot;The History of Lagos&quot;</p>
                      <p className="text-xs text-muted-foreground mt-1">2 days ago • History</p>
                    </div>
                    <ThunderBadge variant="outline" className="text-[10px]">PDF</ThunderBadge>
                  </div>
                </ThunderCard>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Settings */}
        <div className="space-y-6">
          <ProfileSettings profile={profile} />
        </div>
      </div>
    </div>
  );
}
