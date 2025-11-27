"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserRole, banUser, unbanUser, deleteUser } from "./actions";
import { toast } from "sonner";

export type UserProfile = {
  id: string;
  email: string; // Note: We might not get email directly from profiles unless we sync it or join with auth (which is hard). 
                 // For now, we'll assume we might not have it or it's in the profile if we added it.
                 // Actually, the plan said "User ID, Email, Role...". 
                 // Supabase profiles usually don't have email by default unless synced.
                 // I'll assume we display ID or Username if email is missing, or fetch it if possible.
                 // Let's stick to what's in the profile schema: username, full_name, role.
  username: string;
  full_name: string;
  role: 'user' | 'admin' | 'superadmin';
  created_at: string;
  settings: {
    banned?: boolean;
    [key: string]: unknown;
  };
};

export const columns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <div className={`font-medium ${
          role === 'superadmin' ? 'text-red-500' : 
          role === 'admin' ? 'text-blue-500' : 
          'text-muted-foreground'
        }`}>
          {role.toUpperCase()}
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
          Joined
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
      const user = row.original;
      const isBanned = user.settings?.banned;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => {
              const result = await updateUserRole(user.id, 'admin');
              if (result.success) toast.success("User promoted to Admin");
              else toast.error(result.error);
            }}>
              Promote to Admin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => {
              const result = await updateUserRole(user.id, 'user');
              if (result.success) toast.success("User demoted to User");
              else toast.error(result.error);
            }}>
              Demote to User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className={isBanned ? "text-green-500" : "text-orange-500"}
              onClick={async () => {
                const result = isBanned ? await unbanUser(user.id) : await banUser(user.id);
                if (result.success) toast.success(isBanned ? "User unbanned" : "User banned");
                else toast.error(result.error);
              }}
            >
              {isBanned ? "Unban User" : "Ban User"}
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500"
              onClick={async () => {
                if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
                  const result = await deleteUser(user.id);
                  if (result.success) toast.success("User deleted");
                  else toast.error(result.error);
                }
              }}
            >
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
