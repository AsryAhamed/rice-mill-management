import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  Factory,
  TrendingUp,
  DollarSign,
  Wallet,
  CreditCard,
  Receipt,
} from 'lucide-react'
import { cn } from '@/utils/helpers'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Paddy Purchase', href: '/purchases', icon: ShoppingCart },
  { name: 'Production', href: '/production', icon: Factory },
  { 
    name: 'Sales',
    icon: TrendingUp,
    children: [
      { name: 'New Sale', href: '/sales/entry', icon: Receipt },
      { name: 'All Sales', href: '/sales/overview', icon: TrendingUp },
      { name: 'Cash Sales', href: '/sales/cash', icon: DollarSign },
      { name: 'Loan Sales', href: '/sales/loan', icon: Wallet },
      { name: 'Bank Transfer', href: '/sales/bank', icon: CreditCard },
    ],
  },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
                <div className="ml-8 space-y-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.href}
                      to={child.href}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        )
                      }
                    >
                      <child.icon className="w-4 h-4" />
                      <span>{child.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}