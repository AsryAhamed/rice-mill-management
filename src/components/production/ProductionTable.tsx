import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/common/Table'
import { Button } from '@/components/common/Button'
import { formatDate, formatNumber } from '@/utils/helpers'
import type { Production } from '@/lib/types'

interface ProductionTableProps {
  production: Production[]
  onEdit: (production: Production) => void
  onDelete: (id: string) => void
}

export function ProductionTable({ production, onEdit, onDelete }: ProductionTableProps) {
  const columns = useMemo<ColumnDef<Production>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => formatDate(row.original.date),
      },
      {
        accessorKey: 'paddy_type',
        header: 'Paddy Type',
      },
      {
        accessorKey: 'input_paddy',
        header: 'Input Paddy (KG)',
        cell: ({ row }) => formatNumber(row.original.input_paddy),
      },
      {
        accessorKey: 'rice_output',
        header: 'Rice Output (KG)',
        cell: ({ row }) => formatNumber(row.original.rice_output),
      },
      {
        accessorKey: 'yield_percentage',
        header: 'Yield %',
        cell: ({ row }) => (
          <span className="font-medium text-green-600">
            {row.original.yield_percentage ? formatNumber(row.original.yield_percentage) : '0.00'}%
          </span>
        ),
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

  return <DataTable columns={columns} data={production} searchPlaceholder="Search production..." />
}