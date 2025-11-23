import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { PADDY_TYPES } from '@/lib/types'
import type { Purchase } from '@/lib/types'

const purchaseSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  supplier: z.string().min(1, 'Supplier name is required'),
  paddy_type: z.string().min(1, 'Paddy type is required'),
  quantity_kg: z.string().min(1, 'Quantity is required'),
  total_amount: z.string().min(1, 'Total amount is required'),
})

type PurchaseFormData = z.infer<typeof purchaseSchema>

interface PurchaseFormProps {
  onSubmit: (data: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  initialData?: Purchase
  isLoading?: boolean
}

export function PurchaseForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}: PurchaseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: initialData
      ? {
          date: initialData.date,
          supplier: initialData.supplier,
          paddy_type: initialData.paddy_type,
          quantity_kg: initialData.quantity_kg.toString(),
          total_amount: initialData.total_amount.toString(),
        }
      : {
          date: new Date().toISOString().split('T')[0],
        },
  })

  const handleFormSubmit = async (data: PurchaseFormData) => {
    await onSubmit({
      date: data.date,
      supplier: data.supplier,
      paddy_type: data.paddy_type,
      quantity_kg: parseFloat(data.quantity_kg),
      total_amount: parseFloat(data.total_amount),
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

        <Input
          label="Supplier Name"
          type="text"
          placeholder="Enter supplier name"
          {...register('supplier')}
          error={errors.supplier?.message}
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
          label="Quantity (KG)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('quantity_kg')}
          error={errors.quantity_kg?.message}
          required
        />

        <Input
          label="Total Amount (LKR)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('total_amount')}
          error={errors.total_amount?.message}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Purchase' : 'Add Purchase'}
        </Button>
      </div>
    </form>
  )
}