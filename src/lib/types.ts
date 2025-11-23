export interface Database {
  public: {
    Tables: {
      purchases: {
        Row: Purchase
        Insert: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Purchase, 'id' | 'created_at' | 'updated_at'>>
      }
      production: {
        Row: Production
        Insert: Omit<Production, 'id' | 'created_at' | 'updated_at' | 'yield_percentage'>
        Update: Partial<Omit<Production, 'id' | 'created_at' | 'updated_at' | 'yield_percentage'>>
      }
      sales: {
        Row: Sale
        Insert: Omit<Sale, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Sale, 'id' | 'created_at' | 'updated_at'>>
      }
      expenses: {
        Row: Expense
        Insert: Omit<Expense, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Expense, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}

export interface Purchase {
  id: string
  date: string
  supplier: string
  paddy_type: string
  quantity_kg: number
  total_amount: number
  created_at: string
  updated_at: string
}

export interface Production {
  id: string
  date: string
  paddy_type: string
  input_paddy: number
  rice_output: number
  yield_percentage?: number
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  date: string
  customer: string
  phone?: string
  rice_type: string
  quantity: number
  amount: number
  payment_type: 'Cash' | 'Loan' | 'BankTransfer'
  loan_status?: 'Paid' | 'Unpaid' | null
  bank_name?: string
  bank_account?: string
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  date: string
  category: string
  description?: string
  amount: number
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalPaddyQty: number
  totalPaddyAmount: number
  totalRiceOutput: number
  totalSalesRealised: number
  totalExpenses: number
  profit: number
}

export type PaddyType = 'Nadu' | 'Samba' | 'BPT' | 'IR20' | 'Other'
export type RiceType = 'Nadu' | 'Samba' | 'Basmati' | 'Keeri Samba' | 'Other'
export type PaymentType = 'Cash' | 'Loan' | 'BankTransfer'
export type LoanStatus = 'Paid' | 'Unpaid'

export const PADDY_TYPES: PaddyType[] = ['Nadu', 'Samba', 'BPT', 'IR20', 'Other']
export const RICE_TYPES: RiceType[] = ['Nadu', 'Samba', 'Basmati', 'Keeri Samba', 'Other']
export const PAYMENT_TYPES: PaymentType[] = ['Cash', 'Loan', 'BankTransfer']
export const LOAN_STATUSES: LoanStatus[] = ['Paid', 'Unpaid']