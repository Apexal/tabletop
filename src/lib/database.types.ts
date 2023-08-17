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
      tokens: {
        Row: {
          created_at: string
          display_name: string
          id: number
          thumbnail_url: string | null
          x: number | null
          y: number | null
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: number
          thumbnail_url?: string | null
          x?: number | null
          y?: number | null
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: number
          thumbnail_url?: string | null
          x?: number | null
          y?: number | null
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
