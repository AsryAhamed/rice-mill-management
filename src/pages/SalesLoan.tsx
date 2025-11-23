import { useState } from 'react'
import { useFilter } from '@/contexts/FilterContext'
import { useSales } from '@/hooks/useSales'
import { SalesTable } from '@/components/sales/SalesTable'
import { SalesModal } from '@/components/sales/SalesModal'
import { Button } from '@/components/common/Button'
import { Loader } from '@/components/common/Loader'
import { Download, AlertCircle, Wallet } from 'lucide-react'
import { exportSalesToCSV } from '@/utils/csvExport'
import type { Sale } from '@/lib/types'

export function SalesLoan() {
  const { selectedMonth } = useFilter()
  const {
    sales,
    isLoading,
    error,
    updateSale,
    deleteSale,
    isUpdating,
  } = useSales(selectedMonth, 'Loan')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | undefined>()

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await deleteSale(id)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        alert('Failed to delete sale')
      }
    }
  }

  const handleSubmit = async (data: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingSale) {
        await updateSale({ id: editingSale.id, ...data })
      }
      setIsModalOpen(false)
      setEditingSale(undefined)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert('Failed to update sale')
    }
  }

  const handleExport = () => {
    if (sales.length === 0) {
      alert('No data to export')
      return
    }
    exportSalesToCSV(sales, 'loan')
  }

  if (isLoading) {
    return <Loader size="lg" text="Loading loan sales..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load loan sales</p>
        </div>
      </div>
    )
  }

  const totalAmount = sales.reduce((sum, s) => sum + s.amount, 0)
  const paidAmount = sales
    .filter(s => s.loan_status === 'Paid')
    .reduce((sum, s) => sum + s.amount, 0)
  const unpaidAmount = sales
    .filter(s => s.loan_status === 'Unpaid')
    .reduce((sum, s) => sum + s.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Wallet className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Loan Sales</h1>
              <p className="text-gray-600 mt-1">Track loan payments and outstanding amounts</p>
            </div>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={handleExport}
          disabled={sales.length === 0}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-sm font-medium text-yellow-700">Total Loans</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">{sales.length}</p>
        </div>
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-sm font-medium text-yellow-700">Total Amount</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {totalAmount.toLocaleString('en-LK', {
              style: 'currency',
              currency: 'LKR',
            })}
          </p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-700">Paid</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {paidAmount.toLocaleString('en-LK', {
              style: 'currency',
              currency: 'LKR',
            })}
          </p>
        </div>
        <div className="card bg-red-50 border-red-200">
          <p className="text-sm font-medium text-red-700">Unpaid</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {unpaidAmount.toLocaleString('en-LK', {
              style: 'currency',
              currency: 'LKR',
            })}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <SalesTable
          sales={sales}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showLoanStatus={true}
        />
      </div>

      {/* Modal */}
      <SalesModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSale(undefined)
        }}
        onSubmit={handleSubmit}
        initialData={editingSale}
        isLoading={isUpdating}
      />
    </div>
  )
}