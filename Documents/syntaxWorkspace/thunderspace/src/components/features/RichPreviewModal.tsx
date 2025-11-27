'use client';

import { X, Download, Calendar, User, BookOpen } from 'lucide-react';
import { useState, MouseEvent } from "react";
import Image from "next/image";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { motion } from 'framer-motion';
import { ThunderButton, ThunderBadge } from '../ui/design-system';
import { BookmarkButton } from './BookmarkButton';

// Worker for PDF.js
import packageJson from '../../../package.json';
const pkg = packageJson as { dependencies?: Record<string, string> };
const dependencies = pkg.dependencies || {};
const pdfjsVersion = dependencies['pdfjs-dist'] ? dependencies['pdfjs-dist'].replace('^', '') : '3.11.174';

interface Citation {
  url: string;
  source: string;
}

interface Topic {
  title: string;
  colorHex?: string;
}

interface KnowledgeItem {
  id: string;
  type: 'pdf' | 'video' | 'image' | 'dataset' | 'audio' | 'article';
  file?: string;
  url?: string;
  thumbnail?: string;
  title: string;
  summary?: string;
  publicationDate?: string;
  author?: { name: string };
  topics?: Topic[];
  citations?: Citation[];
  [key: string]: unknown;
}

interface RichPreviewModalProps {
  item: KnowledgeItem;
  onClose: () => void;
}

export function RichPreviewModal({ item, onClose }: RichPreviewModalProps) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl h-[90vh] bg-surface rounded-lg overflow-hidden shadow-2xl border border-border flex flex-col md:flex-row"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center bg-void/50 overflow-hidden relative">
          {item.type === 'pdf' && item.file ? (
            <div className="w-full h-full overflow-auto custom-scrollbar">
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}>
                <Viewer fileUrl={item.file} plugins={[defaultLayoutPluginInstance]} theme="dark" />
              </Worker>
            </div>
          ) : item.type === 'video' && item.url ? (
            <div className="relative w-full h-full">
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="p-4 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              )}
              <iframe
                className="w-full h-full"
                src={isPlaying ? `${item.url}?autoplay=1` : item.url}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={item.title}
              ></iframe>
            </div>
          ) : item.type === 'image' && item.thumbnail ? (
            <div className="relative w-full h-full">
              <Image
                src={typeof item.thumbnail === 'string' ? item.thumbnail : '/placeholder.jpg'}
                alt={item.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          ) : item.type === 'dataset' ? (
            <div className="w-full h-full overflow-auto p-8 bg-card">
              <div className="border border-border rounded-sm overflow-hidden">
                <table className="w-full text-sm text-left text-text-secondary">
                  <thead className="text-xs text-text-muted uppercase bg-surface border-b border-border">
                    <tr>
                      <th className="px-6 py-3">Year</th>
                      <th className="px-6 py-3">Region</th>
                      <th className="px-6 py-3">Voter Turnout (%)</th>
                      <th className="px-6 py-3">Youth Participation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { year: 2015, region: 'South West', turnout: 45, youth: 'Low' },
                      { year: 2015, region: 'North East', turnout: 52, youth: 'Medium' },
                      { year: 2019, region: 'South West', turnout: 38, youth: 'Very Low' },
                      { year: 2019, region: 'North Central', turnout: 41, youth: 'Low' },
                      { year: 2023, region: 'South East', turnout: 62, youth: 'High' },
                      { year: 2023, region: 'North West', turnout: 58, youth: 'Medium' },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{row.year}</td>
                        <td className="px-6 py-4">{row.region}</td>
                        <td className="px-6 py-4 text-electric-blue">{row.turnout}%</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            row.youth === 'High' ? 'bg-green-500/20 text-green-400' : 
                            row.youth === 'Low' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {row.youth}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs text-text-muted text-center">Previewing first 6 rows of dataset</p>
            </div>
          ) : (
            <div className="text-text-muted">Preview not available</div>
          )}
        </div>

        {/* Sidebar / Details */}
        <div className="w-full md:w-96 p-8 bg-surface flex flex-col border-t md:border-t-0 md:border-l border-border overflow-y-auto">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <ThunderBadge variant="outline">{item.type}</ThunderBadge>
              {item.topics?.map((t: { title: string, colorHex?: string }) => (
                <span key={t.title} className="text-xs font-bold" style={{ color: t.colorHex || '#FACC15' }}>
                  {t.title}
                </span>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{item.title}</h2>
            
            <div className="prose prose-invert prose-sm text-text-secondary mb-8">
              {item.summary}
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-electric-blue" />
                <span>Published: <span className="text-white">{item.publicationDate || 'Unknown'}</span></span>
              </div>
              
              {item.author && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <User className="w-4 h-4 text-electric-blue" />
                  <span>Curator: <span className="text-white">{item.author.name}</span></span>
                </div>
              )}

              {item.citations && item.citations.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                    <BookOpen className="w-3 h-3" /> Citations
                  </h4>
                  <ul className="space-y-2">
                    {item.citations.map((cite: Citation, i: number) => (
                      <li key={i} className="text-xs text-text-secondary">
                        <a href={cite.url} target="_blank" rel="noopener noreferrer" className="hover:text-electric-blue hover:underline">
                          {cite.source}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex gap-3">
            <ThunderButton className="flex-1 gap-2" size="lg">
              <Download className="h-4 w-4" />
              Download Asset
            </ThunderButton>
            <div className="flex items-center">
              <BookmarkButton itemId={item.id} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
