import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/common/Table'
import { Button } from '@/components/common/Button'
import { formatDate, formatCurrency, formatNumber } from '@/utils/helpers'
import type { Purchase } from '@/lib/types'

interface PurchaseTableProps {
  purchases: Purchase[]
  onEdit: (purchase: Purchase) => void
  onDelete: (id: string) => void
}

export function PurchaseTable({ purchases, onEdit, onDelete }: PurchaseTableProps) {
  const columns = useMemo<ColumnDef<Purchase>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.date),
      },
      {
        accessorKey: 'supplier',
        header: 'Supplier',
      },
      {
        accessorKey: 'paddy_type',
        header: 'Paddy Type',
      },
      {
        accessorKey: 'quantity_kg',
        header: 'Quantity (KG)',
        cell: ({ row }) => formatNumber(row.original.quantity_kg),
      },
      {
        accessorKey: 'total_amount',
        header: 'Total Amount',
        cell: ({ row }) => formatCurrency(row.original.total_amount),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row.original)}
              className="text-blue-600 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row.original.id)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  )

  return <DataTable columns={columns} data={purchases} searchPlaceholder="Search purchases..." />
}