import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Sale, PaymentType } from '@/lib/types'
import { getMonthRange } from '@/utils/helpers'

export function useSales(month?: string, paymentType?: PaymentType) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['sales', month, paymentType],
    queryFn: async () => {
      let query = supabase
        .from('sales')
        .select('*')
        .order('date', { ascending: false })

      if (month) {
        const range = getMonthRange(month)
        if (range) {
          query = query.gte('date', range.start).lte('date', range.end)
        }
      }

      if (paymentType) {
        query = query.eq('payment_type', paymentType)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Sale[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (sale: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('sales')
        .insert(sale)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...sale }: Partial<Sale> & { id: string }) => {
      const { data, error } = await supabase
        .from('sales')
        .update(sale)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('sales').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  return {
    sales: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createSale: createMutation.mutateAsync,
    updateSale: updateMutation.mutateAsync,
    deleteSale: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}