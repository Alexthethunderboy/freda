"use client";

import { useSettingsStore } from "@/lib/settings-store";
import { Battery, MonitorPlay } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ConsumptionTab() {
  const { 
    audioSpeed, 
    setAudioSpeed, 
    keepScreenAwake, 
    setKeepScreenAwake 
  } = useSettingsStore();

  const [wakeLockSupported, setWakeLockSupported] = useState(true);

  // Handle Wake Lock Support
  // Handle Wake Lock Support
  useEffect(() => {
    // Check support asynchronously to avoid synchronous setState warning
    const checkSupport = () => {
      if (!('wakeLock' in navigator)) {
        setWakeLockSupported(false);
      }
    };
    checkSupport();
  }, []);

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium font-headings">Default Audio Speed</h3>
          <span className="text-sm text-muted-foreground">{audioSpeed}x</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {speeds.map((speed) => (
            <button
              key={speed}
              onClick={() => setAudioSpeed(speed)}
              className={cn(
                "px-4 py-2 text-sm font-medium border rounded-lg transition-all duration-300",
                audioSpeed === speed
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50 text-muted-foreground"
              )}
            >
              {speed}x
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium font-headings">Keep Screen Awake</h3>
              <MonitorPlay className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {wakeLockSupported 
                ? "Prevent screen from dimming while reading or listening" 
                : "Not supported by your browser"}
            </p>
          </div>
          <button
            disabled={!wakeLockSupported}
            onClick={() => setKeepScreenAwake(!keepScreenAwake)}
            className={cn(
              "w-12 h-6 rounded-full transition-colors duration-300 relative",
              !wakeLockSupported ? "opacity-50 cursor-not-allowed bg-secondary/20" :
              keepScreenAwake ? "bg-primary" : "bg-secondary/30"
            )}
          >
            <div 
              className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-background transition-transform duration-300 shadow-sm",
                keepScreenAwake ? "left-7" : "left-1"
              )} 
            />
          </button>
        </div>
        {!wakeLockSupported && (
          <div className="flex items-center gap-2 text-xs text-orange-500 bg-orange-500/10 p-2 rounded">
            <Battery className="w-3 h-3" />
            <span>Browser does not support Wake Lock API</span>
          </div>
        )}
      </section>
    </div>
  );
}
