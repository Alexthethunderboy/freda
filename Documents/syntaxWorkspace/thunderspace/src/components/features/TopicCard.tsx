import Link from 'next/link';
import { ThunderCard } from '@/components/ui/design-system';
import { Hash } from 'lucide-react';

interface TopicCardProps {
  topic: {
    slug: string;
    title: string;
    description?: string;
    color_hex?: string;
  };
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/t/${topic.slug}`}>
      <ThunderCard className="h-full p-6 hover:border-primary/50 transition-colors group relative overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"
          style={{ backgroundColor: topic.color_hex ? `${topic.color_hex}20` : undefined }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="p-2 rounded-lg bg-white/5 border border-white/10"
              style={{ color: topic.color_hex || '#fff' }}
            >
              <Hash className="w-5 h-5" />
            </div>
            <h3 className="font-bold font-headings text-xl">{topic.title}</h3>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3">
            {topic.description || "Explore this topic."}
          </p>
        </div>
      </ThunderCard>
    </Link>
  );
}
