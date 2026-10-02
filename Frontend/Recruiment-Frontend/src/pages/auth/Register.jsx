import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    emailid: '',
    password: '',
    phone: '',
    role: ''
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setServerError('')
  }

  const selectRole = (role) => {
    setFormData({ ...formData, role: role })
    setErrors({ ...errors, role: '' })
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.emailid.trim()) {
      newErrors.emailid = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.emailid)) {
      newErrors.emailid = 'Enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length > 20) {
      newErrors.password = 'Password must be 20 characters or less'
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone is required'
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits'
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setLoading(true)

    try {
      await axios.post('http://localhost:8080/register', formData)
      navigate('/login')
    } catch (err) {
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object') {
          setErrors(err.response.data)
        } else {
          setServerError(err.response.data)
        }
      } else {
        setServerError('Server is not reachable. Please try again.')
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
          <h2>Create Account</h2>
          <p>Join as a Candidate or Recruiter</p>
        </div>

        {serverError && <div className="error-message">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="emailid"
              placeholder="Enter your email"
              value={formData.emailid}
              onChange={handleChange}
              className={errors.emailid ? 'input-error' : ''}
            />
            {errors.emailid && <span className="field-error">{errors.emailid}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter 10 digit phone number"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>I am a</label>
            <div className="role-selector">
              <div
                className={`role-option ${formData.role === 'CANDIDATE' ? 'active' : ''}`}
                onClick={() => selectRole('CANDIDATE')}
              >
                🎯 Candidate
              </div>
              <div
                className={`role-option ${formData.role === 'RECRUITER' ? 'active' : ''}`}
                onClick={() => selectRole('RECRUITER')}
              >
                💼 Recruiter
              </div>
            </div>
            {errors.role && <span className="field-error">{errors.role}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default Register