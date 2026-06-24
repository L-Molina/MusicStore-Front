import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const isAuthenticated = Boolean(token)

  const login = useCallback(async (email, password, remember) => {
    // Sin backend: simula login exitoso con cualquier email/contraseña
    // Cuando el backend esté disponible, reemplazar esto por la llamada a la API
    const fakeUser = { id: 1, nombre: email.split('@')[0], email }
    const fakeToken = 'local-dev-token'

    if (remember) {
      localStorage.setItem('token', fakeToken)
      localStorage.setItem('user', JSON.stringify(fakeUser))
    }

    setToken(fakeToken)
    setUser(fakeUser)
  }, [])

  const register = useCallback(async (userData, remember) => {
    // Sin backend: simula registro exitoso
    const fakeUser = {
      id: Date.now(),
      nombre: userData.nombre,
      email: userData.email,
    }
    const fakeToken = 'local-dev-token'

    if (remember) {
      localStorage.setItem('token', fakeToken)
      localStorage.setItem('user', JSON.stringify(fakeUser))
    }

    setToken(fakeToken)
    setUser(fakeUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, token, isAuthenticated, login, register, logout }),
    [user, token, isAuthenticated, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}