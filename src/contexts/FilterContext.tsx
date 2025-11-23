import React, { createContext, useContext, useState } from 'react'
import { getCurrentMonth } from '@/utils/helpers'

interface FilterContextType {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth())

  return (
    <FilterContext.Provider value={{ selectedMonth, setSelectedMonth }}>
      {children}
    </FilterContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}