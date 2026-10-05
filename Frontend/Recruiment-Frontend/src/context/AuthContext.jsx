import { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const name = localStorage.getItem('name')
    const userId = localStorage.getItem('userId')
    const email = localStorage.getItem('email')

    if (token) {
      setUser({ token, role, name, userId, email })
    }
    setLoading(false)
  }, [])

  // Call this after successful login
  const login = (userData) => {
    localStorage.setItem('token', userData.token)
    localStorage.setItem('role', userData.role)
    localStorage.setItem('name', userData.name)
    localStorage.setItem('userId', userData.id)
    localStorage.setItem('email', userData.emailid)

    setUser({
      token: userData.token,
      role: userData.role,
      name: userData.name,
      userId: userData.id,
      email: userData.emailid
    })
  }

  // Call this to logout
  const logout = () => {
    localStorage.clear()
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Custom hook — use this in any component to get user data
export const useAuth = () => {
  return useContext(AuthContext)
}