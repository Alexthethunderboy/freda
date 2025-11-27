'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function checkSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "superadmin") {
    throw new Error("Unauthorized: Super Admin access required");
  }

  return { supabase, user };
}

export async function updateSystemSettings(formData: FormData) {
  try {
    const { supabase, user } = await checkSuperAdmin();

    const maintenanceMode = formData.get("maintenance_mode") === "on";
    const registrationOpen = formData.get("registration_open") === "on";
    const announcementMessage = formData.get("announcement_message") as string;

    const { error } = await supabase
      .from("system_settings")
      .update({
        maintenance_mode: maintenanceMode,
        registration_open: registrationOpen,
        announcement_message: announcementMessage,
        updated_at: new Date().toISOString(),
        updated_by: user.id
      })
      .eq("id", 1);

    if (error) throw error;

    revalidatePath("/admin/settings");
    return { success: true, message: "Settings updated successfully" };
  } catch (error: unknown) {
    console.error("Error updating settings:", error);
    const err = error as { message?: string };
    return { success: false, message: err.message || "An error occurred" };
  }
}
