import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    emailid: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
      login(response.data)
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

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">RecruitPro</div>
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address <span style={{color: 'var(--error)'}}>*</span></label>
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
            <label>Password <span style={{color: 'var(--error)'}}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
