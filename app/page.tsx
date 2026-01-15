'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Proofy</h1>
        <p style={styles.tagline}>Save proof of your work. Upgrade when you grow.</p>
        <div style={styles.buttonGroup}>
          <button style={styles.primaryButton} onClick={() => router.push('/signup')}>
            Get Started Free
          </button>
          <button style={styles.secondaryButton} onClick={() => router.push('/login')}>
            Login
          </button>
        </div>
      </div>
    </main>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  hero: {
    textAlign: 'center' as const,
    maxWidth: '600px'
  },
  title: {
    fontSize: '72px',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
    marginBottom: '20px',
    textShadow: '0 4px 12px rgba(0,0,0,0.2)'
  },
  tagline: {
    fontSize: '24px',
    color: 'rgba(255,255,255,0.95)',
    margin: 0,
    marginBottom: '40px',
    fontWeight: 400,
    lineHeight: 1.5
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const
  },
  primaryButton: {
    padding: '16px 40px',
    fontSize: '18px',
    fontWeight: 600,
    background: '#fff',
    color: '#667eea',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  secondaryButton: {
    padding: '16px 40px',
    fontSize: '18px',
    fontWeight: 600,
    background: 'transparent',
    color: '#fff',
    border: '2px solid #fff',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s, background 0.2s'
  }
}
