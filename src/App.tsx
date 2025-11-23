import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { FilterProvider } from '@/contexts/FilterContext'
import { Layout } from '@/components/layout/Layout'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Purchases } from '@/pages/Purchases'
import { Production } from '@/pages/Production'
import { SalesEntry } from '@/pages/SalesEntry'
import { SalesOverview } from '@/pages/SalesOverview'
import { SalesCash } from '@/pages/SalesCash'
import { SalesLoan } from '@/pages/SalesLoan'
import { SalesBank } from '@/pages/SalesBank'
import { Expenses } from '@/pages/Expenses'
import { Loader } from '@/components/common/Loader'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <FilterProvider>
              <Layout />
            </FilterProvider>
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="production" element={<Production />} />
        <Route path="sales/entry" element={<SalesEntry />} />
        <Route path="sales/overview" element={<SalesOverview />} />
        <Route path="sales/cash" element={<SalesCash />} />
        <Route path="sales/loan" element={<SalesLoan />} />
        <Route path="sales/bank" element={<SalesBank />} />
        <Route path="expenses" element={<Expenses />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App