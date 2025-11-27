"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Helper to check superadmin status
async function checkSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "superadmin") {
    throw new Error("Forbidden: Super Admin access required");
  }
  
  return supabase;
}

export async function updateUserRole(userId: string, newRole: 'user' | 'admin' | 'superadmin') {
  try {
    const supabase = await checkSuperAdmin();
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, error: 'Failed to update user role' };
  }
}

export async function banUser(userId: string) {
  // In a real app, we might have a 'banned' column or status
  // For now, we'll just remove their role or set a flag if we had one
  // Let's assume we add a 'banned' boolean to profiles or use Supabase Auth ban (which requires admin API)
  // Since we don't have the Service Role key exposed to the client/server actions easily without env vars,
  // we will update a metadata field in profiles if possible, or just fail for now if we can't do true auth ban.
  
  // ALTERNATIVE: We can just delete the user for "Ban" in this MVP, or add a 'status' column.
  // The plan mentioned "Ban/Suspend User (a toggle switch)".
  // I'll add a 'is_banned' column to profiles in a future update if needed, but for now let's just log it
  // or maybe we can use the 'settings' jsonb column to store ban status.
  
  try {
    const supabase = await checkSuperAdmin();
    
    // Using settings jsonb to store ban status for now
    // We would need middleware to check this status to actually block access
    const { data: profile } = await supabase.from('profiles').select('settings').eq('id', userId).single();
    const currentSettings = profile?.settings || {};
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        settings: { ...currentSettings, banned: true } 
      })
      .eq('id', userId);

    if (error) throw error;

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error banning user:', error);
    return { success: false, error: 'Failed to ban user' };
  }
}

export async function unbanUser(userId: string) {
  try {
    const supabase = await checkSuperAdmin();
    
    const { data: profile } = await supabase.from('profiles').select('settings').eq('id', userId).single();
    const currentSettings = profile?.settings || {};
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        settings: { ...currentSettings, banned: false } 
      })
      .eq('id', userId);

    if (error) throw error;

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error unbanning user:', error);
    return { success: false, error: 'Failed to unban user' };
  }
}

export async function deleteUser(userId: string) {
  try {
    const supabase = await checkSuperAdmin();
    
    // Note: Deleting from profiles might cascade to auth.users if configured, 
    // BUT usually we can't delete from auth.users via standard client without Service Role.
    // However, if we delete the profile, the app might consider them "gone".
    // Ideally we call an Edge Function for this.
    // For this MVP, we will try to delete the profile.
    
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}
