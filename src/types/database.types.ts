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
      purchases: {
        Row: {
          id: string
          date: string
          supplier: string
          paddy_type: string
          quantity_kg: number
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          supplier: string
          paddy_type: string
          quantity_kg: number
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          supplier?: string
          paddy_type?: string
          quantity_kg?: number
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          date: string
          customer: string
          phone: string
          rice_type: string
          quantity: number
          amount: number
          payment_type: 'Cash' | 'Credit' | 'UPI'
          loan_status: string
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          customer: string
          phone: string
          rice_type: string
          quantity: number
          amount: number
          payment_type: 'Cash' | 'Credit' | 'UPI'
          loan_status?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          customer?: string
          phone?: string
          rice_type?: string
          quantity?: number
          amount?: number
          payment_type?: 'Cash' | 'Credit' | 'UPI'
          loan_status?: string
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      production: {
        Row: {
          id: string
          date: string
          paddy_type: string
          input_paddy: number
          rice_output: number
          yield_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          paddy_type: string
          input_paddy: number
          rice_output: number
          yield_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          paddy_type?: string
          input_paddy?: number
          rice_output?: number
          yield_percentage?: number
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          date: string
          category: string
          description: string
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          category: string
          description: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          category?: string
          description?: string
          amount?: number
          created_at?: string
          updated_at?: string
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