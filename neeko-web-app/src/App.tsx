import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { Upload } from './components/Upload'
import './App.css'

type AuthPage = 'login' | 'signup'

function App() {
  const { isAuthenticated, isLoading } = useAuth()
  const [currentAuthPage, setCurrentAuthPage] = useState<AuthPage>('login')

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        {currentAuthPage === 'login' ? (
          <Login onSwitchToSignup={() => setCurrentAuthPage('signup')} />
        ) : (
          <Signup onSwitchToLogin={() => setCurrentAuthPage('login')} />
        )}
      </>
    )
  }

  return (
    <>
      <Upload />
    </>
  )
}

export default App
