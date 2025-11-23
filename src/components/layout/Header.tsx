import { useAuth } from '@/contexts/AuthContext'
import { useFilter } from '@/contexts/FilterContext'
import { LogOut, Calendar } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { getCurrentMonth } from '@/utils/helpers'

export function Header() {
  const { user, logout } = useAuth()
  const { selectedMonth, setSelectedMonth } = useFilter()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">
              Rice Mill Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Month Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                max={getCurrentMonth()}
                className="input py-1.5 text-sm"
              />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}