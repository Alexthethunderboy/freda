"use client";

import { toast } from "sonner";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LibraryCard } from "@/components/features/LibraryCard";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface Profile {
  id: string;
  username: string;
  display_name?: string;
  bio?: string;
  [key: string]: unknown;
}

interface ProfileTabProps {
  profile: Profile;
}

export function ProfileTab({ profile }: ProfileTabProps) {
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

// ...

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic validation
      if (username.length < 3) {
        throw new Error("Username must be at least 3 characters");
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          username,
          bio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (err: unknown) {
      console.error('Error updating profile:', err);
      const error = err as { message?: string; code?: string };
      if (error.message?.includes('Could not find') || error.code === 'PGRST204') {
        toast.error("Database schema mismatch. Please run the migration script.");
      } else {
        toast.error(error.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold font-headings text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Public Identity
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              This information will be displayed on your public profile and archives.
            </p>
          </div>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50"
                placeholder="Your Name"
              />
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50 font-mono"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50 resize-none leading-relaxed"
                placeholder="Tell the archives about yourself..."
              />
              <p className="text-xs text-muted-foreground text-right">{bio.length}/500</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-primary/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </form>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold font-headings text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full" />
              Library Card
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your unique digital artifact. Download it to share your scholar status.
            </p>
          </div>
          
          <div className="relative group perspective-1000">
            <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="transform transition-transform duration-500 group-hover:rotate-y-6 group-hover:rotate-x-6 preserve-3d">
              <LibraryCard 
                username={username || "User"} 
                userId={profile.id} 
                showDownload={true}
                className="w-full shadow-2xl border-white/10"
              />
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground font-mono">
            <div className="flex justify-between mb-2">
              <span>ID_REF</span>
              <span className="text-foreground">{profile.id}</span>
            </div>
            <div className="flex justify-between">
              <span>STATUS</span>
              <span className="text-green-500">ACTIVE</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
