"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Palette, 
  Headphones, 
  Database, 
  ShieldAlert, 
  ChevronRight, 
  ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppearanceTab } from "./tabs/AppearanceTab";
import { ConsumptionTab } from "./tabs/ConsumptionTab";
import { DataSavingTab } from "./tabs/DataSavingTab";
import { AccountTab } from "./tabs/AccountTab";
import { ThunderCard, ThunderBadge } from "@/components/ui/design-system";

interface SettingsContainerProps {
  profile: { username: string; [key: string]: unknown };
}

const TABS = [
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme, fonts, and motion" },
  { id: "consumption", label: "Consumption", icon: Headphones, description: "Audio and playback settings" },
  { id: "data", label: "Data Saving", icon: Database, description: "Manage data usage" },
  { id: "account", label: "Account", icon: ShieldAlert, description: "Danger zone and privacy" },
];

export function SettingsContainer({ profile }: SettingsContainerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTabId = searchParams.get("tab") || "appearance";
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTabChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    // Use window.location.pathname to stay on the current page (profile page)
    // or just push the search params.
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleBackToMenu = () => {
    router.push('?tab=settings'); // Or whatever the default view should be, or just remove 'tab' param
  };

  const renderContent = () => {
    switch (activeTabId) {
      case "appearance": return <AppearanceTab />;
      case "consumption": return <ConsumptionTab />;
      case "data": return <DataSavingTab />;
      case "account": return <AccountTab username={profile?.username || "User"} />;
      default: return <AppearanceTab />;
    }
  };

  const activeTab = TABS.find(t => t.id === activeTabId) || TABS[0];
  const hasTabParam = searchParams.has("tab");
  const showMobileMenu = isMobile && !hasTabParam;

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] md:min-h-0 gap-8">
      {/* Sidebar / Mobile Menu */}
      <aside className={cn(
        "w-full md:w-72 flex-shrink-0 space-y-6",
        !showMobileMenu && isMobile ? "hidden" : "block"
      )}>
        <div className="mb-6 md:mb-8 px-4 md:px-0">
          <h1 className="text-4xl font-bold font-headings tracking-tight text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage your archive experience</p>
        </div>

        <nav className="space-y-2">
          {TABS.map((tab) => {
            const isActive = activeTabId === tab.id && (!isMobile || hasTabParam);
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 text-left group border border-transparent",
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]" 
                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/10"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isActive ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground group-hover:text-foreground"
                )}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="block font-bold text-sm tracking-wide">{tab.label}</span>
                  {isMobile && <span className="block text-xs text-muted-foreground mt-0.5">{tab.description}</span>}
                </div>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" />}
                {isMobile && !isActive && <ChevronRight className="w-4 h-4 text-muted-foreground/50" />}
              </button>
            );
          })}
          
          <button
            onClick={async () => {
              const { createClient } = await import("@/lib/supabase/client");
              const supabase = createClient();
              await supabase.auth.signOut();
              router.push('/login');
            }}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 text-left group border border-transparent hover:bg-red-500/10 text-muted-foreground hover:text-red-500 hover:border-red-500/20 mt-8"
          >
            <div className="p-2 rounded-lg transition-colors bg-white/5 text-muted-foreground group-hover:text-red-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="block font-bold text-sm tracking-wide">Sign Out</span>
              {isMobile && <span className="block text-xs text-muted-foreground mt-0.5">End your session</span>}
            </div>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 min-w-0",
        showMobileMenu ? "hidden" : "block",
        "animate-fade-in"
      )}>
        <ThunderCard className="h-full border-white/5 bg-card/50 backdrop-blur-sm p-0 overflow-hidden flex flex-col">
          {/* Mobile Header with Back Button */}
          {isMobile && (
            <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-10">
              <button 
                onClick={handleBackToMenu}
                className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold font-headings">{activeTab.label}</h2>
            </div>
          )}

          {/* Desktop Header */}
          <div className="hidden md:block p-8 border-b border-white/10 bg-white/5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-headings text-foreground">{activeTab.label}</h2>
                <p className="text-muted-foreground mt-1">{activeTab.description}</p>
              </div>
              <ThunderBadge variant="outline" className="opacity-50">
                {activeTabId.toUpperCase()}
              </ThunderBadge>
            </div>
          </div>

          <div className="p-4 md:p-8 flex-1">
            {renderContent()}
          </div>
        </ThunderCard>
      </main>
    </div>
  );
}
