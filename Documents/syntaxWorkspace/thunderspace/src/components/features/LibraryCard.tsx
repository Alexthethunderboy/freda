'use client'

import { useRef } from 'react'
import QRCode from 'react-qr-code'
import { Download } from 'lucide-react'
import { toPng } from 'html-to-image'

interface LibraryCardProps {
  username: string
  userId: string
  className?: string
  showDownload?: boolean
}

export function LibraryCard({ username, userId, className, showDownload = false }: LibraryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (cardRef.current) {
      try {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 })
        const link = document.createElement('a')
        link.download = `${username}-library-card.png`
        link.href = dataUrl
        link.click()
      } catch (err) {
        console.error('Failed to download card', err)
      }
    }
  }

  // Generate a deterministic pattern based on username
  const generatePattern = (seed: string) => {
    // Simple hash to number
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Generate colors
    const c1 = `hsl(${Math.abs(hash % 360)}, 70%, 60%)`
    const c2 = `hsl(${Math.abs((hash >> 8) % 360)}, 70%, 40%)`
    
    return { c1, c2 }
  }

  const { c1, c2 } = generatePattern(username)

  return (
    <div className={`group relative ${className}`}>
      <div 
        ref={cardRef}
        className="relative w-full aspect-[1.586] rounded-xl overflow-hidden shadow-2xl bg-black"
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            opacity: 0.9
          }}
        >
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                 backgroundSize: '20px 20px' 
               }} 
          />
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 w-2/3 h-full bg-white/10 transform -skew-x-12" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-black/10 rounded-tr-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full p-4 md:p-6 flex flex-col justify-between text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-1">UnlearnNaija</h3>
              <h2 className="text-lg md:text-2xl font-bold font-headings truncate max-w-[180px] md:max-w-none">{username}</h2>
              <p className="text-[10px] md:text-xs font-mono opacity-70 mt-1">{userId.slice(0, 8)}</p>
            </div>
            <div className="bg-white p-1.5 md:p-2 rounded-lg shadow-lg">
              <QRCode 
                value={`https://unlearnnaija.com/u/${username}`} 
                size={48} 
                className="w-12 h-12 md:w-16 md:h-16"
                level="M" 
              />
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div className="text-[8px] md:text-[10px] font-mono opacity-60">
              VALID SCHOLAR<br />
              ACCESS GRANTED
            </div>
            <div className="w-10 h-6 md:w-12 md:h-8 border border-white/30 rounded flex items-center justify-center">
              <div className="w-6 h-3 md:w-8 md:h-4 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-sm opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {showDownload && (
        <button 
          onClick={handleDownload}
          className="overflow-hidden absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
          title="Download Library Card"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          <Download className="w-4 h-4 relative z-10" />
        </button>
      )}
    </div>
  )
}
