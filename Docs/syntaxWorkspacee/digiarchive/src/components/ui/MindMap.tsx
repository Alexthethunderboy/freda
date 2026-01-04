'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { Link as LinkIcon, ExternalLink, X, BookOpen, Sparkles, Network } from "lucide-react";

interface SubNode {
  id: string;
  label: string;
  description: string;
}

interface Node {
  id: string;
  label: string;
  x: number; // Percent relative to container
  y: number; // Percent relative to container
  color: string;
  url?: string;
  subNodes?: SubNode[];
  synthesis?: string;
}

const initialNodes: Node[] = [
  { 
    id: "root", 
    label: "Digiarchive", x: 50, y: 50, color: "#ffffff",
    synthesis: "The central nexus of all unlearning and building activity. A digital garden of evolving thoughts."
  },
  { 
    id: "cannabis", 
    label: "Cannabis", x: 30, y: 25, color: "#4ade80", url: "/psychonaut",
    subNodes: [
      { id: "c1", label: "Legalization", description: "The fight for decriminalization and economic justice." },
      { id: "c2", label: "Terpenes", description: "The aromatic compounds that define the vibe and medical effects." }
    ],
    synthesis: "Reclaiming the botanical heritage of West Africa through education and activism."
  },
  { 
    id: "history", 
    label: "History", x: 70, y: 25, color: "#fbbf24",
    subNodes: [
      { id: "h1", label: "Colonial Scars", description: "Analyzing the impact of 19th-century legislation on modern identity." },
      { id: "h2", label: "Oral Traditions", description: "Preserving wisdom through digital storytelling." }
    ],
    synthesis: "Unlearning the colonial narrative to rediscover indigenous truths."
  },
  { 
    id: "law", 
    label: "Law", x: 30, y: 75, color: "#ef4444",
    synthesis: "Critiquing the current legal frameworks that marginalize indigenous practices."
  },
  { 
    id: "consciousness", 
    label: "Consciousness", x: 70, y: 75, color: "#818cf8",
    subNodes: [
      { id: "n1", label: "Neuroplasticity", description: "How 'unlearning' physically rewires our brains." }
    ],
    synthesis: "Exploring the depth of human awareness and its role in societal transformation."
  },
  { id: "substack", label: "The Med Griot", x: 85, y: 50, color: "#f472b6", url: "https://themedgriot.substack.com/" },
  { id: "research", label: "Research Docs", x: 15, y: 50, color: "#22d3ee", url: "https://unlearn-archive.vercel.app/" },
];

const initialConnections = [
  ["root", "cannabis"],
  ["root", "history"],
  ["root", "law"],
  ["root", "consciousness"],
  ["root", "substack"],
  ["root", "research"],
  ["cannabis", "history"],
  ["cannabis", "law"],
  ["history", "consciousness"],
];

export function MindMap() {
  const [nodes, setNodes] = useState(initialNodes);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleDrag = (id: string, info: any) => {
    setNodes(prev => prev.map(node => {
      if (node.id === id) {
        const deltaXPercent = (info.delta.x / containerSize.width) * 100;
        const deltaYPercent = (info.delta.y / containerSize.height) * 100;
        return { 
          ...node, 
          x: Math.min(Math.max(node.x + deltaXPercent, 5), 95), 
          y: Math.min(Math.max(node.y + deltaYPercent, 5), 95) 
        };
      }
      return node;
    }));
  };

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[700px] bg-black/40 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden touch-none"
    >
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
        <div className="flex items-center gap-2 text-white/40 font-mono text-[8px] md:text-[10px] uppercase tracking-widest bg-black/60 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-white/5 backdrop-blur-md">
          <Network className="w-2 md:w-3 h-2 md:h-3 text-electric-storm" />
          Interactive Knowledge Graph
        </div>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {initialConnections.map(([fromId, toId], i) => {
          const from = nodes.find(n => n.id === fromId)!;
          const to = nodes.find(n => n.id === toId)!;
          return (
            <motion.line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="white"
              strokeWidth="1"
              strokeOpacity="0.05"
            />
          );
        })}
      </svg>

      {nodes.map((node) => (
        <div key={node.id}>
           <motion.div
            drag
            dragMomentum={false}
            onDrag={(e, info) => handleDrag(node.id, info)}
            style={{ 
              left: `${node.x}%`, 
              top: `${node.y}%`,
              position: 'absolute',
              x: '-50%',
              y: '-50%'
            }}
            className="group z-10"
          >
            <div 
              onClick={() => {
                setSelectedNode(node);
                if (node.subNodes) toggleNode(node.id);
              }}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full border bg-black/80 backdrop-blur-sm transition-all hover:scale-110 active:scale-95 flex items-center gap-2 cursor-pointer shadow-xl ${
                selectedNode?.id === node.id ? 'ring-2 ring-white/20' : ''
              }`}
              style={{ borderColor: `${node.color}40`, color: node.color }}
            >
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full" style={{ backgroundColor: node.color }} />
              <span className="text-[10px] md:text-sm font-bold whitespace-nowrap">{node.label}</span>
              {node.subNodes && (
                <div className="text-[8px] font-mono opacity-50 ml-1">
                  {expandedNodes.has(node.id) ? '−' : '+'}
                </div>
              )}
            </div>

            {/* Orbiting Subnodes */}
            <AnimatePresence>
              {expandedNodes.has(node.id) && node.subNodes?.map((sub, idx) => {
                const angle = (idx * (360 / node.subNodes!.length) * Math.PI) / 180;
                const distance = containerSize.width < 640 ? 60 : 80;
                return (
                  <motion.div
                    key={sub.id}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{ 
                      scale: 1, 
                      x: Math.cos(angle) * distance, 
                      y: Math.sin(angle) * distance 
                    }}
                    exit={{ scale: 0, x: 0, y: 0 }}
                    className="absolute top-1/2 left-1/2 -ml-8 md:-ml-12 -mt-3 md:-mt-4 w-16 md:w-24 p-1 md:p-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md text-center"
                  >
                    <span className="text-[8px] md:text-[10px] font-bold text-white/60 line-clamp-1">{sub.label}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      ))}

      {/* Deep-Dive Side Panel */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 bottom-0 w-full sm:w-80 bg-neutral-900/90 backdrop-blur-xl border-l border-white/10 p-6 md:p-8 z-30 flex flex-col gap-6 shadow-2xl overflow-y-auto"
          >
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors text-white/40"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                <BookOpen className="w-3 h-3" />
                Deep Dive Synthesis
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color }} />
                {selectedNode.label}
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs md:text-sm text-neutral-300 leading-relaxed italic">
              "{selectedNode.synthesis || "Exploring the nuances of " + selectedNode.label + ". Synthesis in progress..."}"
            </div>

            {selectedNode.subNodes && (
              <div className="space-y-4">
                <h4 className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-neutral-500">Connecting Thoughts</h4>
                <div className="space-y-3">
                  {selectedNode.subNodes.map(sub => (
                    <div key={sub.id} className="p-3 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="text-[10px] md:text-[11px] font-bold text-white mb-1">{sub.label}</div>
                      <div className="text-[9px] md:text-[10px] text-neutral-500 leading-tight">{sub.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-white/5">
              {selectedNode.url ? (
                <Link href={selectedNode.url} className="w-full py-3 rounded-xl bg-white text-black font-bold text-center flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors text-xs md:text-sm">
                  Explore Hub
                  <ExternalLink className="w-4 h-4" />
                </Link>
              ) : (
                <div className="text-center text-[10px] font-mono text-neutral-600 uppercase">
                  Synthesis 85% Complete
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-[8px] md:text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-black/40 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/5 backdrop-blur-md">
        Drag nodes • Click for details
      </div>
    </div>
  );
}
