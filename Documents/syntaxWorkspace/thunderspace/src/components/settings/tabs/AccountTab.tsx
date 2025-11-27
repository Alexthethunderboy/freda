"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AccountTabProps {
  username: string;
}

export function AccountTab({ username }: AccountTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [loading, setLoading] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();
  
  const expectedText = `DELETE ${username}`;

  const handleDeleteAccount = async () => {
    if (confirmationText !== expectedText) return;
    
    setLoading(true);
    try {
      // Call Supabase Edge Function or API route to delete user
      // For now, we'll just sign out as a placeholder for actual deletion logic
      // which usually requires an admin client or RPC
      
      // In a real app: await supabase.rpc('delete_user_account')
      
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      console.error('Error deleting account:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <section className="space-y-4">
        <h3 className="text-lg font-medium font-headings text-red-500">Danger Zone</h3>
        
        <div className="border border-red-500/30 rounded-lg p-6 space-y-4 bg-red-500/5">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/10 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium text-red-500">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently remove your account and all of its contents from the UnlearnNaija platform. This action is not reversible, so please continue with caution.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors text-sm font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-background border border-border rounded-xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-unfold">
            <div className="space-y-2 text-center">
              <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold font-headings">Are you absolutely sure?</h3>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. This will permanently delete your account, remove your library card, and wipe your data from our servers.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">
                Type <span className="text-foreground font-bold">{expectedText}</span> to confirm
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full bg-secondary/10 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-red-500 transition-colors font-mono"
                placeholder={expectedText}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary/10 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={confirmationText !== expectedText || loading}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
