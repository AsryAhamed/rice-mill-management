import { useState } from 'react'
import { useFilter } from '@/contexts/FilterContext'
import { useProduction } from '@/hooks/useProduction'
import { ProductionTable } from '@/components/production/ProductionTable'
import { ProductionModal } from '@/components/production/ProductionModal'
import { Button } from '@/components/common/Button'
import { Loader } from '@/components/common/Loader'
import { Plus, Download, AlertCircle } from 'lucide-react'
import { exportProductionToCSV } from '@/utils/csvExport'
import type { Production } from '@/lib/types'

export function Production() {
  const { selectedMonth } = useFilter()
  const {
    production,
    isLoading,
    error,
    createProduction,
    updateProduction,
    deleteProduction,
    isCreating,
    isUpdating,
  } = useProduction(selectedMonth)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduction, setEditingProduction] = useState<Production | undefined>()

  const handleAdd = () => {
    setEditingProduction(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (prod: Production) => {
    setEditingProduction(prod)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this production record?')) {
      try {
        await deleteProduction(id)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        alert('Failed to delete production record')
      }
    }
  }

  const handleSubmit = async (data: Omit<Production, 'id' | 'created_at' | 'updated_at' | 'yield_percentage'>) => {
    try {
      if (editingProduction) {
        await updateProduction({ id: editingProduction.id, ...data })
      } else {
        await createProduction(data)
      }
      setIsModalOpen(false)
      setEditingProduction(undefined)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert('Failed to save production record')
    }
  }

  const handleExport = () => {
    if (production.length === 0) {
      alert('No data to export')
      return
    }
    exportProductionToCSV(production)
  }

  const avgYield = production.length > 0
    ? production.reduce((sum, p) => sum + (p.yield_percentage || 0), 0) / production.length
    : 0

  if (isLoading) {
    return <Loader size="lg" text="Loading production..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load production records</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Production / Milling</h1>
          <p className="text-gray-600 mt-1">Track your rice production</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={production.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Add Production
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm font-medium text-blue-700">Total Records</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{production.length}</p>
        </div>
        <div className="card bg-orange-50 border-orange-200">
          <p className="text-sm font-medium text-orange-700">Total Input Paddy</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">
            {production.reduce((sum, p) => sum + p.input_paddy, 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })} KG
          </p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm font-medium text-green-700">Total Rice Output</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {production.reduce((sum, p) => sum + p.rice_output, 0).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })} KG
          </p>
        </div>
        <div className="card bg-purple-50 border-purple-200">
          <p className="text-sm font-medium text-purple-700">Average Yield</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">
            {avgYield.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <ProductionTable
          production={production}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <ProductionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingProduction(undefined)
        }}
        onSubmit={handleSubmit}
        initialData={editingProduction}
        isLoading={editingProduction ? isUpdating : isCreating}
      />
    </div>
  )
}