import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/features/OnboardingForm";
import { ThunderCard } from "@/components/ui/design-system";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if profile already exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  if (profile?.username) {
    redirect(`/u/${profile.username}`);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <ThunderCard className="max-w-md w-full p-8 space-y-8 border-primary/20">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-headings">Welcome to The Archive</h1>
          <p className="text-muted-foreground">Initialize your scholar dossier to continue.</p>
        </div>

        <div className="flex justify-center w-full">
          <OnboardingForm
            userId={user.id}
            email={user.email!}
          />
        </div>
      </ThunderCard>
    </div>
  );
}
