import { Modal } from '@/components/common/Modal'
import { ProductionForm } from './ProductionForm'
import type { Production } from '@/lib/types'

interface ProductionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Production, 'id' | 'created_at' | 'updated_at' | 'yield_percentage'>) => Promise<void>
  initialData?: Production
  isLoading?: boolean
}

export function ProductionModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: ProductionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Production' : 'Add New Production'}
      size="lg"
    >
      <ProductionForm
        onSubmit={onSubmit}
        onCancel={onClose}
        initialData={initialData}
        isLoading={isLoading}
      />
    </Modal>
  )
}