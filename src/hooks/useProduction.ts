import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Production } from '@/lib/types'
import { getMonthRange } from '@/utils/helpers'

export function useProduction(month?: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['production', month],
    queryFn: async () => {
      let query = supabase
        .from('production')
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
      return data as Production[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (production: Omit<Production, 'id' | 'created_at' | 'updated_at' | 'yield_percentage'>) => {
      const { data, error } = await supabase
        .from('production')
        .insert(production)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...production }: Partial<Production> & { id: string }) => {
      const { data, error } = await supabase
        .from('production')
        .update(production)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('production').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  return {
    production: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createProduction: createMutation.mutateAsync,
    updateProduction: updateMutation.mutateAsync,
    deleteProduction: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}