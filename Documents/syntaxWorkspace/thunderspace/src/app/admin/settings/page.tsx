import { createClient } from "@/lib/supabase/server";
import { ThunderCard, ThunderButton } from "@/components/ui/design-system";
import { Input } from "@/components/ui/input";
import { updateSystemSettings } from "./actions";
import { Settings, AlertTriangle, UserPlus, Megaphone } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Fetch current settings
  const { data: settings } = await supabase
    .from("system_settings")
    .select("*")
    .eq("id", 1)
    .single();

  // Default values if table is empty (though SQL should have seeded it)
  const maintenanceMode = settings?.maintenance_mode ?? false;
  const registrationOpen = settings?.registration_open ?? true;
  const announcementMessage = settings?.announcement_message ?? "";

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold font-headings">System Settings</h1>
        <p className="text-muted-foreground mt-2">Global platform configuration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings Form */}
        <ThunderCard className="p-6 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-headings">Platform Controls</h3>
          </div>

          <form action={async (formData) => {
            "use server";
            await updateSystemSettings(formData);
          }} className="space-y-8">
            
            {/* Maintenance Mode */}
            <div className="flex items-start justify-between p-4 border border-border rounded-lg bg-secondary/5">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <label htmlFor="maintenance_mode" className="font-bold block">Maintenance Mode</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    When enabled, only admins can access the site. All other users will see a maintenance page.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="maintenance_mode" 
                  name="maintenance_mode" 
                  className="w-5 h-5 accent-primary"
                  defaultChecked={maintenanceMode}
                />
              </div>
            </div>

            {/* Registration Toggle */}
            <div className="flex items-start justify-between p-4 border border-border rounded-lg bg-secondary/5">
              <div className="flex gap-3">
                <UserPlus className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <label htmlFor="registration_open" className="font-bold block">Allow New Registrations</label>
                  <p className="text-sm text-muted-foreground mt-1">
                    If disabled, new users cannot sign up. Existing users can still log in.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="registration_open" 
                  name="registration_open" 
                  className="w-5 h-5 accent-primary"
                  defaultChecked={registrationOpen}
                />
              </div>
            </div>

            {/* Global Announcement */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-muted-foreground" />
                <label htmlFor="announcement_message" className="font-bold">Global Announcement Banner</label>
              </div>
              <Input 
                id="announcement_message" 
                name="announcement_message" 
                placeholder="Enter a message to display at the top of the site..." 
                defaultValue={announcementMessage}
              />
              <p className="text-xs text-muted-foreground">Leave empty to hide the banner.</p>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <ThunderButton type="submit" size="lg">
                Save Changes
              </ThunderButton>
            </div>
          </form>
        </ThunderCard>
      </div>
    </div>
  );
}
