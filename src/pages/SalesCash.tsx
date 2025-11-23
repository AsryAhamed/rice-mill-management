import { useState } from 'react'
import { useFilter } from '@/contexts/FilterContext'
import { useSales } from '@/hooks/useSales'
import { SalesTable } from '@/components/sales/SalesTable'
import { SalesModal } from '@/components/sales/SalesModal'
import { Button } from '@/components/common/Button'
import { Loader } from '@/components/common/Loader'
import { Download, AlertCircle, DollarSign } from 'lucide-react'
import { exportSalesToCSV } from '@/utils/csvExport'
import type { Sale } from '@/lib/types'

export function SalesCash() {
  const { selectedMonth } = useFilter()
  const {
    sales,
    isLoading,
    error,
    updateSale,
    deleteSale,
    isUpdating,
  } = useSales(selectedMonth, 'Cash')

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
    exportSalesToCSV(sales, 'cash')
  }

  if (isLoading) {
    return <Loader size="lg" text="Loading cash sales..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load cash sales</p>
        </div>
      </div>
    )
  }

  const totalAmount = sales.reduce((sum, s) => sum + s.amount, 0)
  const totalQuantity = sales.reduce((sum, s) => sum + s.quantity, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cash Sales</h1>
              <p className="text-gray-600 mt-1">View all cash payment transactions</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-700">Total Cash Sales</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{sales.length}</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-700">Total Quantity</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {totalQuantity.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })} KG
          </p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-700">Total Amount</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {totalAmount.toLocaleString('en-LK', {
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