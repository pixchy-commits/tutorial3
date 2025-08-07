

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// For server-side operations, we'll create a separate server client when needed
export function createServerClient() {
  // This will be used in server components if needed
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          type: 'expense' | 'revenue'
          color: string
          icon: string
          subcategories: string[] | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'expense' | 'revenue'
          color: string
          icon: string
          subcategories?: string[] | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'expense' | 'revenue'
          color?: string
          icon?: string
          subcategories?: string[] | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'expense' | 'revenue'
          amount: number
          description: string
          category_id: string | null
          category_name: string
          subcategory: string | null
          date: string
          tags: string[] | null
          payment_method: string | null
          recurring: boolean | null
          recurring_frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'expense' | 'revenue'
          amount: number
          description: string
          category_id?: string | null
          category_name: string
          subcategory?: string | null
          date: string
          tags?: string[] | null
          payment_method?: string | null
          recurring?: boolean | null
          recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'expense' | 'revenue'
          amount?: number
          description?: string
          category_id?: string | null
          category_name?: string
          subcategory?: string | null
          date?: string
          tags?: string[] | null
          payment_method?: string | null
          recurring?: boolean | null
          recurring_frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          category_name: string
          amount: number
          period: 'monthly' | 'yearly'
          alert_threshold: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          category_name: string
          amount: number
          period: 'monthly' | 'yearly'
          alert_threshold?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          category_name?: string
          amount?: number
          period?: 'monthly' | 'yearly'
          alert_threshold?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          currency: string | null
          timezone: string | null
          preferences: Record<string, unknown> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          currency?: string | null
          timezone?: string | null
          preferences?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          currency?: string | null
          timezone?: string | null
          preferences?: Record<string, unknown> | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      create_default_categories_for_user: {
        Args: {
          user_uuid: string
        }
        Returns: void
      }
    }
  }
}
