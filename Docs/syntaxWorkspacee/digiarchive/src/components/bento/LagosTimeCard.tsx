'use client';

import { useState, useEffect } from 'react';
import { InfoCard } from './InfoCard';
import { Clock } from 'lucide-react';

export function LagosTimeCard() {
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const updateTime = () => {
      // Get Lagos Time (UTC+1)
      const now = new Date();
      const lagosTime = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);

      setTime(lagosTime);

      const hour = parseInt(lagosTime.split(':')[0]);
      
      if (hour >= 1 && hour < 6) {
        setStatus("I'm probably sleeping (or debugging). Leave a message.");
      } else if (hour >= 6 && hour < 9) {
        setStatus("Waking up. Coffee first.");
      } else if (hour >= 9 && hour < 17) {
        setStatus("Deep work mode. Building ecosystems.");
      } else if (hour >= 17 && hour < 21) {
        setStatus("Creative flow. Music or research.");
      } else {
        setStatus("Winding down. Exploring consciousness.");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <InfoCard className="md:col-span-1 md:row-span-1 p-6 bg-black/40 border-white/5 group">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center gap-2 text-gray-500 opacity-70">
          <Clock className="w-4 h-4" />
          <span className="text-[10px] font-mono tracking-widest uppercase">Lagos, NG</span>
        </div>

        <div className="my-4">
          <h2 className="text-4xl font-display font-bold text-white tracking-tighter">
            {time}
          </h2>
          <div className="h-0.5 w-12 bg-white/20 mt-2" />
        </div>

        <p className="text-[11px] text-gray-400 font-mono leading-tight">
          <span className="text-white/40">Status:</span> {status}
        </p>
      </div>
    </InfoCard>
  );
}
