import { useState } from 'react'
import { useFilter } from '@/contexts/FilterContext'
import { usePurchases } from '@/hooks/usePurchases'
import { PurchaseTable } from '@/components/purchases/PurchaseTable'
import { PurchaseModal } from '@/components/purchases/PurchaseModal'
import { Button } from '@/components/common/Button'
import { Loader } from '@/components/common/Loader'
import { Plus, Download, AlertCircle } from 'lucide-react'
import { exportPurchasesToCSV } from '@/utils/csvExport'
import type { Purchase } from '@/lib/types'

export function Purchases() {
  const { selectedMonth } = useFilter()
  const {
    purchases,
    isLoading,
    error,
    createPurchase,
    updatePurchase,
    deletePurchase,
    isCreating,
    isUpdating,
  } = usePurchases(selectedMonth)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPurchase, setEditingPurchase] = useState<Purchase | undefined>()

  const handleAdd = () => {
    setEditingPurchase(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (purchase: Purchase) => {
    setEditingPurchase(purchase)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      try {
        await deletePurchase(id)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        alert('Failed to delete purchase')
      }
    }
  }

  const handleSubmit = async (data: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingPurchase) {
        await updatePurchase({ id: editingPurchase.id, ...data })
      } else {
        await createPurchase(data)
      }
      setIsModalOpen(false)
      setEditingPurchase(undefined)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert('Failed to save purchase')
    }
  }

  const handleExport = () => {
    if (purchases.length === 0) {
      alert('No data to export')
      return
    }
    exportPurchasesToCSV(purchases)
  }

  if (isLoading) {
    return <Loader size="lg" text="Loading purchases..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load purchases</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paddy Purchase</h1>
          <p className="text-gray-600 mt-1">Manage your paddy purchases</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={purchases.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Add Purchase
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm font-medium text-blue-700">Total Purchases</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{purchases.length}</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-700">Total Quantity</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {purchases.reduce((sum, p) => sum + p.quantity_kg, 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })} KG
          </p>
        </div>
        <div className="card bg-purple-50 border-purple-200">
          <p className="text-sm font-medium text-purple-700">Total Amount</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {purchases.reduce((sum, p) => sum + p.total_amount, 0).toLocaleString('en-LK', {
              style: 'currency',
              currency: 'LKR',
            })}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <PurchaseTable
          purchases={purchases}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingPurchase(undefined)
        }}
        onSubmit={handleSubmit}
        initialData={editingPurchase}
        isLoading={editingPurchase ? isUpdating : isCreating}
      />
    </div>
  )
}