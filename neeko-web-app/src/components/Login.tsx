import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

interface LoginProps {
  onSwitchToSignup: () => void
}

export const Login = ({ onSwitchToSignup }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!email || !password) {
      return
    }

    try {
      setIsSubmitting(true)
      await login(email, password)
    } catch {
      // Error is handled by context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting || !email || !password}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-switch">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToSignup}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
