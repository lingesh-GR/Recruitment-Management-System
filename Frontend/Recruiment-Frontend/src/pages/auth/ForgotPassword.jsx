import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function ForgotPassword() {
  const [emailid, setEmailid] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [theme, setTheme] = useState('dark')

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      // Call backend API: POST /forgot-password
      const response = await axios.post('http://localhost:8080/forgot-password', {
        emailid: emailid
      })
      
      // The backend returns a simple string on success
      setMessage('A password reset link has been sent to your email.')
      setEmailid('') // Clear the input
    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Failed to send reset link.')
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
          <h2>Forgot Password?</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        {/* Success Message */}
        {message && (
          <div style={{ background: 'rgba(0, 184, 148, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={emailid}
              onChange={(e) => {
                setEmailid(e.target.value)
                setError('')
              }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || message !== ''}>
            {loading ? <span className="spinner"></span> : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-footer">
          Remember your password? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword