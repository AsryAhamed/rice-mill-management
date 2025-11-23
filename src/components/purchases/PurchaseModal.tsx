import { Modal } from '@/components/common/Modal'
import { PurchaseForm } from './PurchaseForm'
import type { Purchase } from '@/lib/types'

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  initialData?: Purchase
  isLoading?: boolean
}

export function PurchaseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: PurchaseModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Purchase' : 'Add New Purchase'}
      size="lg"
    >
      <PurchaseForm
        onSubmit={onSubmit}
        onCancel={onClose}
        initialData={initialData}
        isLoading={isLoading}
      />
    </Modal>
  )
}