'use client';

import { motion } from 'framer-motion';

interface RadarData {
  label: string;
  value: number; // 0 to 1
}

interface RadarChartProps {
  data: RadarData[];
  size?: number;
  color?: string;
}

export function RadarChart({ data, size = 120, color = "#4ade80" }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.4;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (value: number, angle: number) => {
    const r = radius * value;
    return {
      x: center + r * Math.sin(angle),
      y: center - r * Math.cos(angle),
    };
  };

  const points = data.map((d, i) => getPoint(d.value, i * angleStep));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Web circles */}
        {[0.25, 0.5, 0.75, 1].map((r) => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={radius * r}
            fill="none"
            stroke="white"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {data.map((_, i) => {
          const point = getPoint(1, i * angleStep);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="white"
              strokeOpacity="0.1"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d={pathData}
          fill={color}
          fillOpacity="0.2"
          stroke={color}
          strokeWidth="2"
        />

        {/* Labels */}
        {data.map((d, i) => {
          const point = getPoint(1.2, i * angleStep);
          return (
            <text
              key={i}
              x={point.x}
              y={point.y}
              fontSize="8"
              fill="white"
              fillOpacity="0.4"
              textAnchor="middle"
              className="font-mono uppercase"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
