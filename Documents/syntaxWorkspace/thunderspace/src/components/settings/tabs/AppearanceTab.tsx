"use client";

import { useTheme } from "next-themes";
import { useSettingsStore } from "@/lib/settings-store";
import { Monitor, Moon, Sun, Type, Zap, ZapOff } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const { 
    fontSize, 
    setFontSize, 
    reducedMotion, 
    setReducedMotion 
  } = useSettingsStore();

  // Apply font size effect
  useEffect(() => {
    const root = document.documentElement;
    // Reset classes
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    
    switch (fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'normal':
        root.classList.add('text-base');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      case 'xl':
        root.classList.add('text-xl');
        break;
    }
  }, [fontSize]);

  // Apply reduced motion effect
  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="space-y-4">
        <h3 className="text-lg font-medium font-headings">Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-300 gap-2",
              theme === "light" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground"
            )}
          >
            <Sun className="w-6 h-6" />
            <span className="text-sm font-medium">Light</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-300 gap-2",
              theme === "dark" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground"
            )}
          >
            <Moon className="w-6 h-6" />
            <span className="text-sm font-medium">Dark</span>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={cn(
              "flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-300 gap-2",
              theme === "system" 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground"
            )}
          >
            <Monitor className="w-6 h-6" />
            <span className="text-sm font-medium">System</span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium font-headings">Font Size</h3>
          <span className="text-sm text-muted-foreground capitalize">{fontSize}</span>
        </div>
        <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
          <Type className="w-4 h-4 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="3"
            step="1"
            value={
              fontSize === 'small' ? 0 : 
              fontSize === 'normal' ? 1 : 
              fontSize === 'large' ? 2 : 3
            }
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val === 0) setFontSize('small');
              if (val === 1) setFontSize('normal');
              if (val === 2) setFontSize('large');
              if (val === 3) setFontSize('xl');
            }}
            className="w-full h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <Type className="w-6 h-6 text-foreground" />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium font-headings">Reduced Motion</h3>
              {reducedMotion ? <ZapOff className="w-4 h-4 text-muted-foreground" /> : <Zap className="w-4 h-4 text-muted-foreground" />}
            </div>
            <p className="text-sm text-muted-foreground">Disable complex animations</p>
          </div>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={cn(
              "w-12 h-6 rounded-full transition-colors duration-300 relative",
              reducedMotion ? "bg-primary" : "bg-secondary/30"
            )}
          >
            <div 
              className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-background transition-transform duration-300 shadow-sm",
                reducedMotion ? "left-7" : "left-1"
              )} 
            />
          </button>
        </div>
      </section>
    </div>
  );
}
