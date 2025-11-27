import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProfileIdentity } from "@/components/features/ProfileIdentity";
import { ProfileContent } from "@/components/features/ProfileContent";
import { CreateProfileButton } from "@/components/features/CreateProfileButton";

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params; 
  
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', username)
    .single();

  if (!profile) {
    // If profile doesn't exist, check if it's the current user trying to view their own "potential" profile
    const isCurrentUser = currentUser && (
      currentUser.user_metadata?.username === username || 
      currentUser.email?.split('@')[0].toLowerCase() === username.toLowerCase()
    );

    if (isCurrentUser) {
      // Return a "Complete Your Profile" state
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-2xl font-bold">Welcome, Scholar</h1>
            <p className="text-muted-foreground">Your dossier has not been initialized yet.</p>
            <div className="flex justify-center">
              <CreateProfileButton 
                userId={currentUser.id} 
                username={username} 
              />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground">Scholar not found in the archives.</p>
        </div>
      </div>
    );
  }

  // 2. Fetch Archives (Contributions)
  const { data: archives } = await supabase
    .from('knowledge_items')
    .select('*, author:profiles!author_id(username, display_name)')
    .eq('author_id', profile.id)
    .order('created_at', { ascending: false });

  // 3. Fetch Stats (Mocked for now if not in DB)
  const stats = {
    joinedYear: new Date(profile.created_at || '2023-01-01').getFullYear().toString(),
    contributions: archives?.length || 0
  };

  // MOCK DATA FALLBACK
  let displayArchives = archives || [];
  if (displayArchives.length === 0) {
    displayArchives = [
      {
        id: 'mock-1',
        title: 'The Architecture of Pre-Colonial Hausa Cities',
        description: 'An exploration of the urban planning and architectural styles of ancient Hausa city-states.',
        media_type: 'article',
        media_url: null,
        topics: ['Architecture', 'History'],
        created_at: '2023-11-01T12:00:00Z',
        author_id: profile.id,
        author: { username: profile.username, display_name: profile.display_name || profile.username }
      },
      {
        id: 'mock-2',
        title: 'Yoruba Cosmology and Quantum Mechanics',
        description: 'Drawing parallels between traditional Yoruba beliefs and modern quantum physics concepts.',
        media_type: 'pdf',
        media_url: null,
        topics: ['Philosophy', 'Science'],
        created_at: '2023-10-25T12:00:00Z',
        author_id: profile.id,
        author: { username: profile.username, display_name: profile.display_name || profile.username }
      },
      {
        id: 'mock-3',
        title: 'Igbo Ukwu: Bronze Casting Techniques',
        description: 'A technical analysis of the lost-wax casting methods used in Igbo Ukwu art.',
        media_type: 'audio',
        media_url: null,
        topics: ['Art', 'Technology'],
        created_at: '2023-10-15T12:00:00Z',
        author_id: profile.id,
        author: { username: profile.username, display_name: profile.display_name || profile.username }
      }
    ];
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-linear-to-b from-black via-background to-background -z-10" />
      <div className="fixed top-0 left-0 w-full h-96 bg-linear-to-b from-primary/5 to-transparent pointer-events-none z-0" />

      <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 relative">
          
          {/* Left Column: Identity (Sticky) */}
          <aside className="w-full lg:w-[35%] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] flex flex-col">
            <ProfileIdentity 
              profile={profile} 
              isOwnProfile={isOwnProfile} 
              stats={stats} 
            />
          </aside>

          {/* Right Column: Body of Work (Scrollable) */}
          <main className="w-full lg:w-[65%] min-h-screen">
            <ProfileContent 
              archives={displayArchives} 
              isOwnProfile={isOwnProfile}
              profile={profile}
            />
          </main>

        </div>
      </div>
    </div>
  );
}
