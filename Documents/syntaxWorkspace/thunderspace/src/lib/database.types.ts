export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      knowledge_items: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          media_type: 'pdf' | 'audio' | 'article'
          media_url: string | null
          thumbnail_url: string | null
          topics: string[]
          author_id: string
          views_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          media_type: 'pdf' | 'audio' | 'article'
          media_url?: string | null
          thumbnail_url?: string | null
          topics?: string[]
          author_id: string
          views_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          media_type?: 'pdf' | 'audio' | 'article'
          media_url?: string | null
          thumbnail_url?: string | null
          topics?: string[]
          author_id?: string
          views_count?: number
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'super_admin'
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'super_admin'
          created_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          title: string
          color_hex: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          color_hex: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          color_hex?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}