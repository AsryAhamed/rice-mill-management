import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  username: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hard-coded credentials
const VALID_USERNAME = 'samhan'
const VALID_PASSWORD = 'Samhan356'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('rice-mill-user')

    // 🔥 Safe state update (no React warnings)
    queueMicrotask(() => {
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    })
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const user = { username }
      setUser(user)
      localStorage.setItem('rice-mill-user', JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('rice-mill-user')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
