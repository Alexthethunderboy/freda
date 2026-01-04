'use client';

import { useRef, useState, useEffect } from "react";
import { Pen, Eraser, RotateCcw, Save } from "lucide-react";

export function GraffitiWall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#4ade80");
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    ctx?.beginPath(); // Start a new path for next line
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="p-8 rounded-3xl bg-midnight/50 border border-white/10 backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white flex items-center gap-2">
            <Pen className="w-6 h-6 text-electric-storm" />
            The Graffiti Wall
          </h2>
          <p className="text-gray-400 text-sm mt-1">Leave your mark on the ecosystem.</p>
        </div>

        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
          <div className="flex gap-2">
            {["#4ade80", "#fbbf24", "#ef4444", "#818cf8", "#ffffff"].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-transform hover:scale-125 ${color === c ? 'scale-125 ring-2 ring-white' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <button onClick={clearCanvas} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video md:aspect-3/1 bg-black/60 rounded-2xl border border-white/5 touch-none overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          width={1200}
          height={400}
          className="w-full h-full cursor-crosshair"
        />
        
        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-mono text-gray-500 bg-black/80 px-3 py-1.5 rounded-full border border-white/5">
          <Save className="w-3 h-3" />
          PUBLIC DOMAIN DRAWING ZONE
        </div>
      </div>
    </div>
  );
}
