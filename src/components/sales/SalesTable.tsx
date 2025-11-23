import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Trash2 } from 'lucide-react'
import { DataTable } from '@/components/common/Table'
import { Button } from '@/components/common/Button'
import { formatDate, formatCurrency, formatNumber } from '@/utils/helpers'
import type { Sale } from '@/lib/types'

interface SalesTableProps {
  sales: Sale[]
  onEdit: (sale: Sale) => void
  onDelete: (id: string) => void
  showLoanStatus?: boolean
  showBankDetails?: boolean
}

export function SalesTable({ 
  sales, 
  onEdit, 
  onDelete,
  showLoanStatus = false,
  showBankDetails = false,
}: SalesTableProps) {
  const columns = useMemo<ColumnDef<Sale>[]>(
    () => {
      const baseColumns: ColumnDef<Sale>[] = [
        {
          accessorKey: 'date',
          header: 'Date',
          cell: ({ row }) => formatDate(row.original.date),
        },
        {
          accessorKey: 'customer',
          header: 'Customer',
        },
        {
          accessorKey: 'phone',
          header: 'Phone',
          cell: ({ row }) => row.original.phone || '-',
        },
        {
          accessorKey: 'rice_type',
          header: 'Rice Type',
        },
        {
          accessorKey: 'quantity',
          header: 'Quantity (KG)',
          cell: ({ row }) => formatNumber(row.original.quantity),
        },
        {
          accessorKey: 'amount',
          header: 'Amount',
          cell: ({ row }) => formatCurrency(row.original.amount),
        },
        {
          accessorKey: 'payment_type',
          header: 'Payment Type',
          cell: ({ row }) => {
            const type = row.original.payment_type
            const colors = {
              Cash: 'bg-green-100 text-green-800',
              Loan: 'bg-yellow-100 text-yellow-800',
              BankTransfer: 'bg-blue-100 text-blue-800',
            }
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>
                {type === 'BankTransfer' ? 'Bank Transfer' : type}
              </span>
            )
          },
        },
      ]

      if (showLoanStatus) {
        baseColumns.push({
          accessorKey: 'loan_status',
          header: 'Loan Status',
          cell: ({ row }) => {
            const status = row.original.loan_status
            if (!status) return '-'
            const colors = {
              Paid: 'bg-green-100 text-green-800',
              Unpaid: 'bg-red-100 text-red-800',
            }
            return (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
                {status}
              </span>
            )
          },
        })
      }

      if (showBankDetails) {
        baseColumns.push(
          {
            accessorKey: 'bank_name',
            header: 'Bank Name',
            cell: ({ row }) => row.original.bank_name || '-',
          },
          {
            accessorKey: 'bank_account',
            header: 'Account',
            cell: ({ row }) => row.original.bank_account || '-',
          }
        )
      }

      baseColumns.push({
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
      })

      return baseColumns
    },
    [onEdit, onDelete, showLoanStatus, showBankDetails]
  )

  return <DataTable columns={columns} data={sales} searchPlaceholder="Search sales..." />
}