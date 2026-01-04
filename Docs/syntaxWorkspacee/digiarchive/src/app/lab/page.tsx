'use client';

import { ArrowLeft, Terminal, GitBranch, Sparkles, Cpu } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MockTerminal } from "@/components/lab/MockTerminal";
import { GitHubPulse } from "@/components/lab/GitHubPulse";
import { TechStackAura } from "@/components/lab/TechStackAura";

export default function LabPage() {
  const projects = [
    { 
      name: "Unlearn Naija", 
      description: "Digital platform for cultural re-education and activism.", 
      stack: "Next.js, Supabase", 
      status: "In Development",
      href: "https://unlearn-archive.vercel.app"
    },
    { 
      name: "Shopper", 
      description: "A modern, full-stack e-commerce platform.", 
      stack: "React, Node", 
      status: "Live",
      href: "https://shopper-chi-six.vercel.app/"
    },
    { 
      name: "JRUN", 
      description: "Service platform connecting clients with providers.", 
      stack: "React, Firebase", 
      status: "Live",
      href: "https://jrun-nu.vercel.app/"
    },
    { 
      name: "Weather App", 
      description: "Real-time weather updates with intuitive UI.", 
      stack: "React, OpenWeather", 
      status: "Live",
      href: "https://thunderweather.vercel.app/"
    },
    { 
      name: "Spotify Playlist Gen", 
      description: "Create personalized playlists based on preferences.", 
      stack: "React, Spotify API", 
      status: "Live",
      href: "https://playlistgenerator.vercel.app/"
    },
  ];

  return (
    <div className="min-h-screen bg-[#000510] selection:bg-green-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-24 md:pt-32 space-y-24 md:space-y-32">
        <Link 
          href="/" 
          className="fixed top-24 left-4 md:left-8 flex items-center gap-2 text-neutral-500 hover:text-white transition-all z-40 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/5 hover:border-white/20 group font-mono text-[10px] uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>../back</span>
        </Link>

        <div>
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 md:mb-20">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-green-500">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center backdrop-blur-xl">
                  <Terminal className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-mono italic">
                    ~/the<span className="text-white">_lab</span>
                  </h1>
                  <p className="text-[10px] md:text-xs font-mono text-neutral-500 uppercase tracking-[0.3em] mt-1 md:mt-2">Experimental Sandbox v1.0.4</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-neutral-500 font-mono text-[10px] md:text-xs border border-white/5 py-1.5 px-4 rounded-full bg-white/5 backdrop-blur-md">
              <Cpu className="w-3 h-3 text-green-500 animate-pulse" />
              EXPERIMENTAL OVERRIDE ACTIVE
            </div>
          </header>

          <div className="grid lg:grid-cols-12 gap-12 md:gap-16 items-start">
            <section className="lg:col-span-7 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <Sparkles className="w-5 h-5 text-green-500" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-mono uppercase italic">Interactive Console</h2>
                </div>
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl font-mono">
                  A custom bridge between human intent and machine execution. Input directives to traverse the lab's hidden architecture.
                </p>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-green-500/10 rounded-4xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="relative">
                  <MockTerminal />
                </div>
              </div>
            </section>

            <section className="lg:col-span-5 space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <Cpu className="w-5 h-5 text-green-500" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-mono uppercase italic">Tech Stack Aura</h2>
                </div>
                <p className="text-neutral-500 text-sm md:text-base leading-relaxed max-w-xl font-mono">
                  Visual mapping of core technologies and their frequency within the forge.
                </p>
              </div>
              <div className="bg-black/40 rounded-4xl border border-white/5 p-8 backdrop-blur-xl">
                <TechStackAura />
              </div>
            </section>
          </div>

          <div className="pt-24 md:pt-32 grid lg:grid-cols-12 gap-16 md:gap-24">
            <section className="lg:col-span-8 space-y-12">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight font-mono uppercase italic">Project Forge</h2>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{projects.length} UNITS DETECTED</span>
              </div>
              <div className="grid gap-6">
                {projects.map((project, i) => (
                  <motion.a 
                    key={i} 
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group border border-white/5 bg-white/2 p-6 md:p-8 rounded-4xl relative hover:bg-white/5 hover:border-green-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-green-500 transition-colors font-mono">{project.name}</h3>
                        <div className={`w-2 h-2 rounded-full ring-4 ring-black ${project.status === 'Live' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]'}`} />
                      </div>
                      <p className="text-neutral-500 text-sm md:text-base max-w-md font-mono line-clamp-2">{project.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-6 text-[10px] md:text-xs font-mono">
                      <div className="flex flex-col items-end gap-2">
                        <span className="flex items-center gap-2 text-neutral-600">
                          <GitBranch className="w-3 h-3 md:w-4 md:h-4" />
                          deploy/production
                        </span>
                        <span className="bg-white/5 px-3 py-1.5 rounded-full text-green-500/80 border border-green-500/10">
                          {project.stack}
                        </span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </section>

            <aside className="lg:col-span-4 space-y-12">
               <div className="p-8 rounded-4xl border border-white/5 bg-black/40 backdrop-blur-xl sticky top-32">
                  <GitHubPulse />
               </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
