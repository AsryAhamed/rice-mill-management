import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { PADDY_TYPES } from '@/lib/types'
import type { Production } from '@/lib/types'

const productionSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  paddy_type: z.string().min(1, 'Paddy type is required'),
  input_paddy: z.string().min(1, 'Input paddy is required'),
  rice_output: z.string().min(1, 'Rice output is required'),
})

type ProductionFormData = z.infer<typeof productionSchema>

interface ProductionFormProps {
  onSubmit: (data: Omit<Production, 'id' | 'created_at' | 'updated_at' | 'yield_percentage'>) => Promise<void>
  onCancel: () => void
  initialData?: Production
  isLoading?: boolean
}

export function ProductionForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}: ProductionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductionFormData>({
    resolver: zodResolver(productionSchema),
    defaultValues: initialData
      ? {
          date: initialData.date,
          paddy_type: initialData.paddy_type,
          input_paddy: initialData.input_paddy.toString(),
          rice_output: initialData.rice_output.toString(),
        }
      : {
          date: new Date().toISOString().split('T')[0],
        },
  })

  const inputPaddy = watch('input_paddy')
  const riceOutput = watch('rice_output')

  const calculateYield = () => {
    const input = parseFloat(inputPaddy)
    const output = parseFloat(riceOutput)
    if (input && output && input > 0) {
      return ((output / input) * 100).toFixed(2)
    }
    return '0.00'
  }

  const handleFormSubmit = async (data: ProductionFormData) => {
    await onSubmit({
      date: data.date,
      paddy_type: data.paddy_type,
      input_paddy: parseFloat(data.input_paddy),
      rice_output: parseFloat(data.rice_output),
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          {...register('date')}
          error={errors.date?.message}
          required
        />

        <Select
          label="Paddy Type"
          {...register('paddy_type')}
          error={errors.paddy_type?.message}
          options={PADDY_TYPES.map((type) => ({ value: type, label: type }))}
          required
        />

        <Input
          label="Input Paddy (KG)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('input_paddy')}
          error={errors.input_paddy?.message}
          required
        />

        <Input
          label="Rice Output (KG)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('rice_output')}
          error={errors.rice_output?.message}
          required
        />

        <div className="md:col-span-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">
              Yield Percentage: <span className="text-xl font-bold">{calculateYield()}%</span>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Automatically calculated based on input paddy and rice output
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Production' : 'Add Production'}
        </Button>
      </div>
    </form>
  )
}