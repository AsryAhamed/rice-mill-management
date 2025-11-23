import { useNavigate } from 'react-router-dom'
import { useSales } from '@/hooks/useSales'
import { SalesForm } from '@/components/sales/SalesForm'
import { Button } from '@/components/common/Button'
import { ArrowLeft } from 'lucide-react'
import type { Sale } from '@/lib/types'

export function SalesEntry() {
  const navigate = useNavigate()
  const { createSale, isCreating } = useSales()

  const handleSubmit = async (data: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createSale(data)
      
      // Redirect based on payment type
      if (data.payment_type === 'Cash') {
        navigate('/sales/cash')
      } else if (data.payment_type === 'Loan') {
        navigate('/sales/loan')
      } else if (data.payment_type === 'BankTransfer') {
        navigate('/sales/bank')
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert('Failed to create sale')
    }
  }

  const handleCancel = () => {
    navigate('/sales/overview')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/sales/overview')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Sale Entry</h1>
          <p className="text-gray-600 mt-1">Add a new sales transaction</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="card max-w-4xl">
        <SalesForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isCreating}
        />
      </div>

      {/* Info */}
      <div className="card max-w-4xl bg-blue-50 border-blue-200">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          Quick Tips
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>After saving, you'll be redirected to the relevant sales section</li>
          <li>For loan sales, make sure to update the loan status when payment is received</li>
          <li>Bank transfer details are required for bank payment type</li>
        </ul>
      </div>
    </div>
  )
}