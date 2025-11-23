import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import type { Expense } from '@/lib/types'

const EXPENSE_CATEGORIES = [
  'Labor',
  'Electricity',
  'Maintenance',
  'Transportation',
  'Packaging',
  'Administrative',
  'Rent',
  'Other',
]

const expenseSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  amount: z.string().min(1, 'Amount is required'),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  onSubmit: (data: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  initialData?: Expense
  isLoading?: boolean
}

export function ExpenseForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData
      ? {
          date: initialData.date,
          category: initialData.category,
          description: initialData.description || '',
          amount: initialData.amount.toString(),
        }
      : {
          date: new Date().toISOString().split('T')[0],
        },
  })

  const handleFormSubmit = async (data: ExpenseFormData) => {
    await onSubmit({
      date: data.date,
      category: data.category,
      description: data.description || undefined,
      amount: parseFloat(data.amount),
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
          label="Category"
          {...register('category')}
          error={errors.category?.message}
          options={EXPENSE_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          required
        />

        <div className="md:col-span-2">
          <label className="label">Description</label>
          <textarea
            {...register('description')}
            placeholder="Enter expense description"
            rows={3}
            className="input resize-none"
          />
          {errors.description && (
            <p className="error-message">{errors.description.message}</p>
          )}
        </div>

        <Input
          label="Amount (LKR)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount')}
          error={errors.amount?.message}
          required
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  )
}