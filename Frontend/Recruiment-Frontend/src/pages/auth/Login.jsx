import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    emailid: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        'http://localhost:8080/login',
        formData
      )

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('role', response.data.role)
      localStorage.setItem('name', response.data.name)
      localStorage.setItem('userId', response.data.id)
      localStorage.setItem('email', response.data.emailid)

      if (response.data.role === 'CANDIDATE') {
        navigate('/candidate/dashboard')
      } else if (response.data.role === 'RECRUITER') {
        navigate('/recruiter/dashboard')
      } else if (response.data.role === 'ADMIN') {
        navigate('/admin/dashboard')
      }

    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || 'Invalid EmailId or Password')
      } else {
        setError('Server is not reachable. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">RecruitPro</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="emailid"
              placeholder="Enter your email"
              value={formData.emailid}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Create Account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login;
