import { ThunderCard } from "@/components/ui/design-system";
import { BarChart, Eye, Download, Headphones } from "lucide-react";

export default function ImpactPage() {
  return (
    <div className="min-h-screen p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-medium tracking-tight text-foreground mb-4 font-headings">
          Impact Dashboard
        </h1>
        <p className="text-xl text-muted-foreground font-light">
          Private analytics on your intellectual contributions.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <ThunderCard className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Eye className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Total Reads</span>
          </div>
          <p className="text-4xl font-bold font-mono">1,248</p>
          <p className="text-xs text-green-500">+12% this week</p>
        </ThunderCard>

        <ThunderCard className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Download className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Downloads</span>
          </div>
          <p className="text-4xl font-bold font-mono">856</p>
          <p className="text-xs text-green-500">+5% this week</p>
        </ThunderCard>

        <ThunderCard className="p-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Headphones className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Listens</span>
          </div>
          <p className="text-4xl font-bold font-mono">3,402</p>
          <p className="text-xs text-green-500">+24% this week</p>
        </ThunderCard>
      </div>

      <ThunderCard className="p-8 min-h-[400px] flex flex-col items-center justify-center text-muted-foreground border-dashed">
        <BarChart className="w-16 h-16 mb-4 opacity-20" />
        <p>Detailed engagement graph will appear here once you have more data.</p>
      </ThunderCard>
    </div>
  );
}
