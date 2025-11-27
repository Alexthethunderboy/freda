import Link from 'next/link';
import { ThunderCard } from '@/components/ui/design-system';
import { User, ShieldCheck } from 'lucide-react';

interface AuthorCardProps {
  author: {
    id: string;
    username: string;
    display_name?: string;
    bio?: string;
    is_verified?: boolean;
  };
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <Link href={`/u/${author.username}`}>
      <ThunderCard className="h-full p-6 hover:border-primary/50 transition-colors group">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold font-headings text-lg truncate">
                {author.display_name || author.username}
              </h3>
              {author.is_verified && <ShieldCheck className="w-4 h-4 text-primary" />}
            </div>
            <p className="text-xs font-mono text-muted-foreground mb-3">@{author.username}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {author.bio || "No biography available."}
            </p>
          </div>
        </div>
      </ThunderCard>
    </Link>
  );
}
