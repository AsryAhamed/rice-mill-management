import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Purchase } from '@/lib/types'
import { getMonthRange } from '@/utils/helpers'

export function usePurchases(month?: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['purchases', month],
    queryFn: async () => {
      let query = supabase
        .from('purchases')
        .select('*')
        .order('date', { ascending: false })

      if (month) {
        const range = getMonthRange(month)
        if (range) {
          query = query.gte('date', range.start).lte('date', range.end)
        }
      }

      const { data, error } = await query

      if (error) throw error
      return data as Purchase[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (purchase: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('purchases')
        .insert(purchase)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...purchase }: Partial<Purchase> & { id: string }) => {
      const { data, error } = await supabase
        .from('purchases')
        .update(purchase)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('purchases').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  return {
    purchases: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createPurchase: createMutation.mutateAsync,
    updatePurchase: updateMutation.mutateAsync,
    deletePurchase: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}