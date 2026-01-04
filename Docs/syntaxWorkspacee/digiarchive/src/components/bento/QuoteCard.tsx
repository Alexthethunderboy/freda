'use client';

import { useState, useEffect } from 'react';
import { InfoCard } from './InfoCard';
import { Quote } from 'lucide-react';
import quotes from '@/data/quotes.json';

export function QuoteCard() {
  const [quote, setQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <InfoCard variant="default" className="md:col-span-1 md:row-span-1 p-6 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Quote className="w-24 h-24 rotate-12" />
      </div>
      
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 text-yellow-500/60 mb-3 opacity-70">
          <Quote className="w-4 h-4" />
          <span className="text-[10px] font-mono tracking-widest uppercase">Daily Unlearning</span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm text-gray-200 italic leading-relaxed font-light">
            "{quote.text}"
          </p>
          <p className="text-[10px] font-mono text-gray-500 mt-4 text-right">— {quote.author}</p>
        </div>
      </div>
    </InfoCard>
  );
}
