"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type KnowledgeItem = {
  id: string;
  title: string;
  media_type: string;
  created_at: string;
  topics: string[];
};

export const columns: ColumnDef<KnowledgeItem>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("title")}</span>;
    },
  },
  {
    accessorKey: "media_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("media_type") as string;
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-mono ${
          type === 'pdf' ? 'bg-red-500/10 text-red-500' :
          type === 'audio' ? 'bg-blue-500/10 text-blue-500' :
          'bg-green-500/10 text-green-500'
        }`}>
          {type?.toUpperCase() || 'UNKNOWN'}
        </span>
      );
    },
  },
  {
    accessorKey: "topics",
    header: "Topics",
    cell: ({ row }) => {
      const topics = row.getValue("topics") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {topics?.slice(0, 2).map(t => (
            <span key={t} className="text-xs bg-secondary/10 px-1 rounded">{t}</span>
          ))}
          {topics?.length > 2 && <span className="text-xs text-muted-foreground">+{topics.length - 2}</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return new Date(row.getValue("created_at")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Link href={`/knowledge/${item.id}`} target="_blank">
          <Button variant="ghost" size="sm">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </Link>
      );
    },
  },
];
