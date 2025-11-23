import { Modal } from '@/components/common/Modal'
import { SalesForm } from './SalesForm'
import type { Sale } from '@/lib/types'

interface SalesModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Sale, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  initialData?: Sale
  isLoading?: boolean
}

export function SalesModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: SalesModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Sale' : 'Add New Sale'}
      size="xl"
    >
      <SalesForm
        onSubmit={onSubmit}
        onCancel={onClose}
        initialData={initialData}
        isLoading={isLoading}
      />
    </Modal>
  )
}