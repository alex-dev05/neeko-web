import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

interface SignupProps {
  onSwitchToLogin: () => void
}

export const Signup = ({ onSwitchToLogin }: SignupProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const { signup, error, clearError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setPasswordError('')

    if (!email || !password || !confirmPassword) {
      return
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    try {
      setIsSubmitting(true)
      await signup(email, password, name)
    } catch {
      // Error is handled by context
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {error && <div className="auth-error">{error}</div>}
        {passwordError && <div className="auth-error">{passwordError}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name (Optional)</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={isSubmitting}
            />
          </div>
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
              placeholder="Enter your password (min 6 characters)"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="auth-button"
            disabled={isSubmitting || !email || !password || !confirmPassword}
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-switch">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="link-button"
              onClick={onSwitchToLogin}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
