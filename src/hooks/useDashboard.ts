import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { DashboardStats } from '@/lib/types'
import { getMonthRange } from '@/utils/helpers'

export function useDashboard(month?: string) {
  return useQuery({
    queryKey: ['dashboard', month],
    queryFn: async () => {
      const range = month ? getMonthRange(month) : null

      // Purchases
      let purchasesQuery = supabase.from('purchases').select('quantity_kg, total_amount')
      if (range) {
        purchasesQuery = purchasesQuery.gte('date', range.start).lte('date', range.end)
      }
      const { data: purchases } = await purchasesQuery

      // Production
      let productionQuery = supabase.from('production').select('rice_output')
      if (range) {
        productionQuery = productionQuery.gte('date', range.start).lte('date', range.end)
      }
      const { data: production } = await productionQuery

      // Sales (only realized - Cash and Paid Loans)
      let salesQuery = supabase
        .from('sales')
        .select('amount, payment_type, loan_status')
      if (range) {
        salesQuery = salesQuery.gte('date', range.start).lte('date', range.end)
      }
      const { data: sales } = await salesQuery

      // Expenses
      let expensesQuery = supabase.from('expenses').select('amount')
      if (range) {
        expensesQuery = expensesQuery.gte('date', range.start).lte('date', range.end)
      }
      const { data: expenses } = await expensesQuery

      // Calculate stats
      const totalPaddyQty = purchases?.reduce((sum, p) => sum + Number(p.quantity_kg), 0) || 0
      const totalPaddyAmount = purchases?.reduce((sum, p) => sum + Number(p.total_amount), 0) || 0
      const totalRiceOutput = production?.reduce((sum, p) => sum + Number(p.rice_output), 0) || 0
      
      // Only count Cash sales and Paid Loan sales as realised
      const totalSalesRealised = sales?.reduce((sum, s) => {
        if (s.payment_type === 'Cash' || s.payment_type === 'BankTransfer') {
          return sum + Number(s.amount)
        }
        if (s.payment_type === 'Loan' && s.loan_status === 'Paid') {
          return sum + Number(s.amount)
        }
        return sum
      }, 0) || 0

      const totalExpenses = expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
      const profit = totalSalesRealised - totalPaddyAmount - totalExpenses

      const stats: DashboardStats = {
        totalPaddyQty,
        totalPaddyAmount,
        totalRiceOutput,
        totalSalesRealised,
        totalExpenses,
        profit,
      }

      return stats
    },
  })
}