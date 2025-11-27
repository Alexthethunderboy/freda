

interface HighlightProps {
  text: string;
  highlight: string;
  className?: string;
}

export function Highlight({ text, highlight, className }: HighlightProps) {
  if (!highlight.trim()) {
    return <span className={className}>{text}</span>;
  }
  
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span className={className}>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="bg-thunder-yellow/30 text-white rounded-[2px] px-0.5 font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}
