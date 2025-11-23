import { useFilter } from '@/contexts/FilterContext'
import { useDashboard } from '@/hooks/useDashboard'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Loader } from '@/components/common/Loader'
import {
  ShoppingCart,
  Factory,
  TrendingUp,
  Receipt,
  DollarSign,
  AlertCircle,
} from 'lucide-react'

export function Dashboard() {
  const { selectedMonth } = useFilter()
  const { data: stats, isLoading, error } = useDashboard(selectedMonth)

  if (isLoading) {
    return <Loader size="lg" text="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  const profitColorClass = (stats?.profit ?? 0) >= 0 ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your rice mill operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Paddy Purchase"
          value={stats?.totalPaddyAmount ?? 0}
          icon={ShoppingCart}
          type="currency"
          colorClass="bg-blue-500"
        />

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Paddy Quantity</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.totalPaddyQty.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} KG
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-10">
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <StatsCard
          title="Total Rice Output"
          value={stats?.totalRiceOutput ?? 0}
          icon={Factory}
          type="number"
          colorClass="bg-purple-500"
        />

        <StatsCard
          title="Total Sales (Realised)"
          value={stats?.totalSalesRealised ?? 0}
          icon={TrendingUp}
          type="currency"
          colorClass="bg-green-500"
        />

        <StatsCard
          title="Total Expenses"
          value={stats?.totalExpenses ?? 0}
          icon={Receipt}
          type="currency"
          colorClass="bg-orange-500"
        />

        <StatsCard
          title="Net Profit"
          value={stats?.profit ?? 0}
          icon={DollarSign}
          type="currency"
          colorClass={profitColorClass}
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            About Realised Sales
          </h3>
          <p className="text-sm text-primary-700">
            Realised sales include all cash sales, bank transfers, and paid loan sales. 
            Unpaid loan sales are not counted in the realised amount.
          </p>
        </div>

        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Profit Calculation
          </h3>
          <p className="text-sm text-blue-700">
            Net Profit = Realised Sales - Total Paddy Purchase Amount - Total Expenses
          </p>
        </div>
      </div>
    </div>
  )
}