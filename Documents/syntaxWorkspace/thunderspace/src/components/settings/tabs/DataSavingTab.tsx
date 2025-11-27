"use client";

import { useSettingsStore } from "@/lib/settings-store";
import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function DataSavingTab() {
  const { lowDataMode, setLowDataMode } = useSettingsStore();

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium font-headings">Low Data Mode</h3>
              {lowDataMode ? <WifiOff className="w-4 h-4 text-muted-foreground" /> : <Wifi className="w-4 h-4 text-muted-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground">
              Reduces image quality and disables auto-play to save bandwidth
            </p>
          </div>
          <button
            onClick={() => setLowDataMode(!lowDataMode)}
            className={cn(
              "w-12 h-6 rounded-full transition-colors duration-300 relative",
              lowDataMode ? "bg-primary" : "bg-secondary/30"
            )}
          >
            <div 
              className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-background transition-transform duration-300 shadow-sm",
                lowDataMode ? "left-7" : "left-1"
              )} 
            />
          </button>
        </div>
        
        {lowDataMode && (
          <div className="p-4 bg-secondary/5 border border-border rounded-lg text-sm text-muted-foreground">
            <p>
              <strong>Note:</strong> High-resolution images and heavy media assets will be replaced with optimized versions.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
