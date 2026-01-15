'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const login = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (error) {
      alert(error.message)
    } else {
      router.push('/dashboard')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login()
    }
  }

  return (
    <main style={styles.container}>
      <div style={styles.backgroundShapes}>
        <div style={styles.shape1}></div>
        <div style={styles.shape2}></div>
        <div style={styles.shape3}></div>
      </div>
      
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>✨</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.subtitle}>Sign in to your Proofy account</p>
        </div>

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>

          <button 
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }} 
            onClick={login}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account? {' '}
              <Link href="/signup" style={styles.link}>
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundShapes: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 0
  },
  shape1: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    top: '-100px',
    right: '-100px',
    backdropFilter: 'blur(50px)'
  },
  shape2: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.08)',
    bottom: '50px',
    left: '-50px',
    backdropFilter: 'blur(50px)'
  },
  shape3: {
    position: 'absolute',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.06)',
    top: '50%',
    right: '100px',
    backdropFilter: 'blur(50px)'
  },
  card: {
    background: '#fff',
    padding: '50px 40px',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    zIndex: 1
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  logo: {
    fontSize: '48px',
    marginBottom: '20px',
    animation: 'pulse 2s ease-in-out infinite'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginLeft: '4px'
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    marginTop: '10px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '10px'
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  link: {
    color: '#667eea',
    fontWeight: '600',
    textDecoration: 'none',
    cursor: 'pointer'
  }
}
