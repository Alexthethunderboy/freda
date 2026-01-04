'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight, Hash } from 'lucide-react';

const COMMANDS = {
  help: "Available commands: help, ls, about, clear, contact, whoami",
  ls: "projects/  experiments/  archive/  manifesto.txt",
  about: "Digiarchive Lab v1.0.4. A playground for experimental UI and radical tech.",
  whoami: "Architect. Builder. Unlearner.",
  contact: "Reach out via the Uplink portal on the home page.",
};

export function MockTerminal() {
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([
    { cmd: 'system.init()', output: 'Digiarchive Lab Environment initialized...' },
    { cmd: 'help', output: COMMANDS.help }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    if (!cmd) return;

    let output = `Command not found: ${cmd}. Type 'help' for available commands.`;
    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }
    
    if (cmd in COMMANDS) {
      output = COMMANDS[cmd as keyof typeof COMMANDS];
    }

    setHistory(prev => [...prev, { cmd: input, output }]);
    setInput('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-green-500/20 bg-black/90 shadow-2xl font-mono text-sm">
      {/* Terminal Header */}
      <div className="bg-neutral-900 px-4 py-2 border-b border-green-500/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-green-500" />
          <span className="text-[10px] text-green-500/70 uppercase tracking-widest">the_lab_terminal</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/20" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
          <div className="w-2 h-2 rounded-full bg-green-500/20" />
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={scrollRef}
        className="p-4 h-64 overflow-y-auto scrollbar-hide space-y-2 selection:bg-green-500/30"
      >
        {history.map((entry, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2 text-green-500/50">
              <ChevronRight className="w-3 h-3" />
              <span>{entry.cmd}</span>
            </div>
            <div className="text-green-500/90 pl-5 leading-relaxed">
              {entry.output}
            </div>
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Hash className="w-3 h-3 text-green-500" />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-500 placeholder:text-green-500/20"
            placeholder="Type a command..."
            autoFocus
          />
        </form>
      </div>

      <div className="bg-green-500/5 px-4 py-1.5 border-t border-green-500/10 flex items-center justify-between text-[10px] text-green-500/30">
        <span>STATUS: ACTIVE</span>
        <span>AUTH: ROOT@DIGIARCHIVE</span>
      </div>
    </div>
  );
}
