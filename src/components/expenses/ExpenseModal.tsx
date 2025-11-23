import { Modal } from '@/components/common/Modal'
import { ExpenseForm } from './ExpenseForm'
import type { Expense } from '@/lib/types'

interface ExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  initialData?: Expense
  isLoading?: boolean
}

export function ExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: ExpenseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense' : 'Add New Expense'}
      size="lg"
    >
      <ExpenseForm
        onSubmit={onSubmit}
        onCancel={onClose}
        initialData={initialData}
        isLoading={isLoading}
      />
    </Modal>
  )
}