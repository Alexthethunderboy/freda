"use client";

import { useEffect, useRef } from "react";

export const VoltageCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      size: number;
      color: string;
    }

    const sparks: Spark[] = [];
    const mouse = { x: 0, y: 0 };
    const lastMouse = { x: 0, y: 0 }; // Initialize with 0, will update on first move

    const createSpark = (x: number, y: number) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5; // Random speed
        // Electric blue variations (cyan to deep blue)
        // R: 0-50, G: 150-255, B: 200-255
        const r = Math.floor(Math.random() * 50);
        const g = Math.floor(Math.random() * 105) + 150;
        const b = Math.floor(Math.random() * 55) + 200;
        
        sparks.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            size: Math.random() * 2 + 1,
            color: `rgba(${r}, ${g}, ${b},`,
        });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      // Calculate distance from last spark emission point
      // We don't want to emit only when comparing to *last frame* mouse pos if mouse moved very fast
      // But creating based on mouse event is fine for high refresh rate mice
      
      const count = 3; // Sparks per move event
      for(let i=0; i<count; i++){
          createSpark(mouse.x + (Math.random() - 0.5) * 5, mouse.y + (Math.random() - 0.5) * 5);
      }
      
      lastMouse.x = mouse.x;
      lastMouse.y = mouse.y;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;

    const animate = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < sparks.length; i++) {
            const spark = sparks[i];
            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.life -= 0.02; // Fade out speed

            if (spark.life <= 0) {
                sparks.splice(i, 1);
                i--;
                continue;
            }

            ctx.beginPath();
            ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
            ctx.fillStyle = spark.color + spark.life + ")";
            ctx.fill();
        }
        animationFrameId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
    />
  );
};
