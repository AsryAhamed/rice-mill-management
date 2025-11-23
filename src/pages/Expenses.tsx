import { useState } from 'react'
import { useFilter } from '@/contexts/FilterContext'
import { useExpenses } from '@/hooks/useExpenses'
import { ExpenseTable } from '@/components/expenses/ExpenseTable'
import { ExpenseModal } from '@/components/expenses/ExpenseModal'
import { Button } from '@/components/common/Button'
import { Loader } from '@/components/common/Loader'
import { Plus, Download, AlertCircle } from 'lucide-react'
import { exportExpensesToCSV } from '@/utils/csvExport'
import type { Expense } from '@/lib/types'

export function Expenses() {
  const { selectedMonth } = useFilter()
  const {
    expenses,
    isLoading,
    error,
    createExpense,
    updateExpense,
    deleteExpense,
    isCreating,
    isUpdating,
  } = useExpenses(selectedMonth)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>()

  const handleAdd = () => {
    setEditingExpense(undefined)
    setIsModalOpen(true)
  }

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        alert('Failed to delete expense')
      }
    }
  }

  const handleSubmit = async (data: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingExpense) {
        await updateExpense({ id: editingExpense.id, ...data })
      } else {
        await createExpense(data)
      }
      setIsModalOpen(false)
      setEditingExpense(undefined)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert('Failed to save expense')
    }
  }

  const handleExport = () => {
    if (expenses.length === 0) {
      alert('No data to export')
      return
    }
    exportExpensesToCSV(expenses)
  }

  if (isLoading) {
    return <Loader size="lg" text="Loading expenses..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load expenses</p>
        </div>
      </div>
    )
  }

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0
    }
    acc[expense.category] += expense.amount
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and manage your expenses</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleExport}
            disabled={expenses.length === 0}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card bg-red-50 border-red-200">
          <p className="text-sm font-medium text-red-700">Total Expenses</p>
          <p className="text-2xl font-bold text-red-900 mt-1">{expenses.length}</p>
        </div>
        <div className="card bg-red-50 border-red-200">
          <p className="text-sm font-medium text-red-700">Total Amount</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {totalAmount.toLocaleString('en-LK', {
              style: 'currency',
              currency: 'LKR',
            })}
          </p>
        </div>
        <div className="card bg-red-50 border-red-200">
          <p className="text-sm font-medium text-red-700">Categories</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {Object.keys(expensesByCategory).length}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(expensesByCategory).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">{category}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {amount.toLocaleString('en-LK', {
                      style: 'currency',
                      currency: 'LKR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <ExpenseTable
          expenses={expenses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingExpense(undefined)
        }}
        onSubmit={handleSubmit}
        initialData={editingExpense}
        isLoading={editingExpense ? isUpdating : isCreating}
      />
    </div>
  )
}