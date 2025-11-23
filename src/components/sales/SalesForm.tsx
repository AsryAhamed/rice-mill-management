import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { RICE_TYPES, PAYMENT_TYPES, LOAN_STATUSES } from '@/lib/types'
import type { Sale } from '@/lib/types'

const salesSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  customer: z.string().min(1, 'Customer name is required'),
  phone: z.string().optional(),
  rice_type: z.string().min(1, 'Rice type is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  amount: z.string().min(1, 'Amount is required'),
  payment_type: z.string().min(1, 'Payment type is required'),
  loan_status: z.string().optional(),
  bank_name: z.string().optional(),
  bank_account: z.string().optional(),
}).refine(
  (data) => {
    if (data.payment_type === 'Loan') {
      return !!data.loan_status
    }
    return true
  },
  {
    message: 'Loan status is required for loan payments',
    path: ['loan_status'],
  }
).refine(
  (data) => {
    if (data.payment_type === 'BankTransfer') {
      return !!data.bank_name && !!data.bank_account
    }
    return true
  },
  {
    message: 'Bank details are required for bank transfers',
    path: ['bank_name'],
  }
)

type SalesFormData = z.infer<typeof salesSchema>

interface SalesFormProps {
  onSubmit: (data: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  onCancel: () => void
  initialData?: Sale
  isLoading?: boolean
}

export function SalesForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}: SalesFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SalesFormData>({
    resolver: zodResolver(salesSchema),
    defaultValues: initialData
      ? {
          date: initialData.date,
          customer: initialData.customer,
          phone: initialData.phone || '',
          rice_type: initialData.rice_type,
          quantity: initialData.quantity.toString(),
          amount: initialData.amount.toString(),
          payment_type: initialData.payment_type,
          loan_status: initialData.loan_status || '',
          bank_name: initialData.bank_name || '',
          bank_account: initialData.bank_account || '',
        }
      : {
          date: new Date().toISOString().split('T')[0],
          payment_type: 'Cash',
        },
  })

  const paymentType = watch('payment_type')

  const handleFormSubmit = async (data: SalesFormData) => {
    await onSubmit({
      date: data.date,
      customer: data.customer,
      phone: data.phone || undefined,
      rice_type: data.rice_type,
      quantity: parseFloat(data.quantity),
      amount: parseFloat(data.amount),
      payment_type: data.payment_type as 'Cash' | 'Loan' | 'BankTransfer',
      loan_status: data.payment_type === 'Loan' ? (data.loan_status as 'Paid' | 'Unpaid') : undefined,
      bank_name: data.payment_type === 'BankTransfer' ? data.bank_name : undefined,
      bank_account: data.payment_type === 'BankTransfer' ? data.bank_account : undefined,
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
          label="Customer Name"
          type="text"
          placeholder="Enter customer name"
          {...register('customer')}
          error={errors.customer?.message}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          {...register('phone')}
          error={errors.phone?.message}
        />

        <Select
          label="Rice Type"
          {...register('rice_type')}
          error={errors.rice_type?.message}
          options={RICE_TYPES.map((type) => ({ value: type, label: type }))}
          required
        />

        <Input
          label="Quantity (KG)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('quantity')}
          error={errors.quantity?.message}
          required
        />

        <Input
          label="Amount (LKR)"
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('amount')}
          error={errors.amount?.message}
          required
        />

        <Select
          label="Payment Type"
          {...register('payment_type')}
          error={errors.payment_type?.message}
          options={PAYMENT_TYPES.map((type) => ({ 
            value: type, 
            label: type === 'BankTransfer' ? 'Bank Transfer' : type 
          }))}
          required
        />

        {paymentType === 'Loan' && (
          <Select
            label="Loan Status"
            {...register('loan_status')}
            error={errors.loan_status?.message}
            options={LOAN_STATUSES.map((status) => ({ value: status, label: status }))}
            required
          />
        )}

        {paymentType === 'BankTransfer' && (
          <>
            <Input
              label="Bank Name"
              type="text"
              placeholder="Enter bank name"
              {...register('bank_name')}
              error={errors.bank_name?.message}
              required
            />

            <Input
              label="Bank Account"
              type="text"
              placeholder="Enter bank account number"
              {...register('bank_account')}
              error={errors.bank_account?.message}
              required
            />
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Sale' : 'Add Sale'}
        </Button>
      </div>
    </form>
  )
}