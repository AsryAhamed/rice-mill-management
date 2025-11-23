import type { LucideIcon } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/utils/helpers'

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  type?: 'currency' | 'number'
  trend?: {
    value: number
    isPositive: boolean
  }
  colorClass?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  type = 'currency',
  trend,
  colorClass = 'bg-primary-500',
}: StatsCardProps) {
  const formattedValue = type === 'currency' 
    ? formatCurrency(value)
    : formatNumber(value) + ' KG'

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${colorClass} bg-opacity-10`}>
          <Icon className={`w-8 h-8 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  )
}