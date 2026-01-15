'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')
  const [clientName, setClientName] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const router = useRouter()

  useEffect(() => {
    initDashboard()
  }, [])

  // Initialize dashboard: check login, get profile & projects
  const initDashboard = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      router.push('/login')
      return
    }

    // Fetch profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', userData.user.id)
      .single()

    // If profile does NOT exist, create it
    if (!profile) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          is_premium: false
        })
        .select()
        .single()

      if (insertError) console.error('Profile insert error:', insertError)
      else profile = newProfile
    }

    if (profileError) console.error('Profile fetch error:', profileError)
    else setIsPremium(profile.is_premium)

    fetchProjects()
  }

  // Fetch projects + proof entries
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, entries(*)')
      .order('created_at', { ascending: false })
    if (error) console.error('Fetch projects error:', error)
    else setProjects(data || [])
  }

  // Add project (enforce free limit)
  const addProject = async () => {
    const { data: userData } = await supabase.auth.getUser()

    // Count current projects
    const { data: userProjects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userData.user.id)

    if (!isPremium && userProjects.length >= 3) {
      alert('Free plan limit reached (3 projects). Upgrade to Premium to add more!')
      return
    }

    const { error } = await supabase.from('projects').insert({
      title,
      client_name: clientName,
      description: '',
      user_id: userData.user.id
    })

    if (error) alert(error.message)
    else {
      setTitle('')
      setClientName('')
      fetchProjects()
    }
  }

  // Delete project
  const deleteProject = async (projectId) => {
    if (!confirm('Delete this project?')) return
    const { error } = await supabase.from('projects').delete().eq('id', projectId)
    if (error) alert(error.message)
    else fetchProjects()
  }

  // Add proof entry
  const addProof = async (projectId, note, proofLink) => {
    const { error } = await supabase.from('entries').insert({
      project_id: projectId,
      note: note || '',
      proof_link: proofLink || ''
    })
    if (error) alert(error.message)
    else fetchProjects()
  }

  // Delete proof
  const deleteProof = async (proofId) => {
    if (!confirm('Delete this proof entry?')) return
    const { error } = await supabase.from('entries').delete().eq('id', proofId)
    if (error) alert(error.message)
    else fetchProjects()
  }

  // Stripe Upgrade
const handleUpgrade = () => {
  alert(
    "Premium is available!\n\n" +
    "Please message us to upgrade:\n" +
    "WhatsApp: +8801711966276\n" +
    // "or Email: support@yourapp.com\n\n" +
    "We will activate Premium for you within 24 hours."
  )
}

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Manage your projects and proof entries</p>
        </div>
        <div style={styles.headerActions}>
          {isPremium && <div style={styles.premiumBadge}>✨ Premium</div>}
          <button style={styles.logoutButton} onClick={handleLogout}>
            <span style={styles.logoutIcon}>→</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Premium Banner */}
      {!isPremium && (
        <div style={styles.premiumBanner}>
          <div>
            <h3 style={styles.bannerTitle}>Free Plan</h3>
            <p style={styles.bannerText}>You are limited to 3 projects. Upgrade to unlock unlimited projects!</p>
          </div>
          <button style={styles.upgradeButton} onClick={handleUpgrade}>
            Upgrade to Premium ✨
          </button>
        </div>
      )}

      {/* Add Project Form */}
      <div style={styles.addProjectCard}>
        <h2 style={styles.cardTitle}>Create New Project</h2>
        <div style={styles.addProjectForm}>
          <input
            style={styles.input}
            placeholder="Project Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="Client Name"
            value={clientName}
            onChange={e => setClientName(e.target.value)}
          />
          <button style={styles.button} onClick={addProject}>
            <span style={styles.buttonText}>+ Add Project</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div style={styles.projectsSection}>
        <h2 style={styles.sectionTitle}>
          Your Projects 
          <span style={styles.projectCount}>({projects.length})</span>
        </h2>
        {projects.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No projects yet. Create your first project above!</p>
          </div>
        ) : (
          <div style={styles.projectsGrid}>
            {projects.map(project => (
              <div key={project.id} style={styles.projectCard}>
                <div style={styles.projectHeader}>
                  <div>
                    <h3 style={styles.projectTitle}>{project.title}</h3>
                    <p style={styles.clientName}>👤 {project.client_name}</p>
                  </div>
                  <button style={styles.deleteButton} onClick={() => deleteProject(project.id)}>
                    🗑️ Delete
                  </button>
                </div>

                {/* Proof Entry Form */}
                <ProofEntryForm project={project} addProof={addProof} />

                {/* Proof Entries List */}
                <div style={styles.entriesSection}>
                  <h4 style={styles.entriesTitle}>Proof Entries ({project.entries?.length || 0})</h4>
                  {project.entries && project.entries.length > 0 ? (
                    <div style={styles.entriesList}>
                      {project.entries.map(entry => (
                        <div key={entry.id} style={styles.entryCard}>
                          <div style={styles.entryContent}>
                            <p style={styles.entryNote}>📝 {entry.note}</p>
                            <a 
                              href={entry.proof_link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              style={styles.entryLink}
                            >
                              🔗 {entry.proof_link}
                            </a>
                          </div>
                          <button style={styles.deleteProofButton} onClick={() => deleteProof(entry.id)}>
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.noEntries}>No proof entries yet. Add one above!</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

// Proof Entry Form
function ProofEntryForm({ project, addProof }) {
  const [note, setNote] = useState('')
  const [proofLink, setProofLink] = useState('')

  const handleAdd = () => {
    addProof(project.id, note, proofLink)
    setNote('')
    setProofLink('')
  }

  return (
    <div style={styles.proofForm}>
      <input
        style={styles.inputSmall}
        placeholder="Add a note..."
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <input
        style={styles.inputSmall}
        placeholder="Proof link (URL)"
        value={proofLink}
        onChange={e => setProofLink(e.target.value)}
      />
      <button style={styles.buttonSmall} onClick={handleAdd}>
        + Add Proof
      </button>
    </div>
  )
}

// Styles
const styles = {
  container: { 
    padding: '40px 20px', 
    maxWidth: 1200, 
    margin: '0 auto', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    paddingBottom: 60
  },
  header: {
    display: 'flex',
    
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap'
  },
  logoutButton: {
    background: '#fff',
    color: '#374151',
    border: 'none',
    borderRadius: 10,
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.2s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    
  logoutIcon: {
    fontSize: 18,
    fontWeight: 700,
    transform: 'rotate(-90deg)',
    display: 'inline-block'
  },gap: 6
  },justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    flexWrap: 'wrap',
    gap: 15
  },
  title: {
    fontSize: 42,
    fontWeight: 700,
    color: '#fff',
    margin: 0,
    marginBottom: 5,
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    margin: 0
  },
  premiumBadge: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: 25,
    fontSize: 14,
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)'
  },
  premiumBanner: { 
    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', 
    padding: 25, 
    borderRadius: 16, 
    marginBottom: 25, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    flexWrap: 'wrap',
    gap: 15
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#d97706',
    margin: 0,
    marginBottom: 5
  },
  bannerText: {
    fontSize: 14,
    color: '#92400e',
    margin: 0
  },
  upgradeButton: { 
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 10, 
    padding: '12px 24px', 
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  addProjectCard: {
    background: '#fff',
    borderRadius: 16,
    padding: 25,
    marginBottom: 30,
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1f2937',
    margin: 0,
    marginBottom: 20
  },
  addProjectForm: { 
    display: 'flex', 
    gap: 12, 
    flexWrap: 'wrap'
  },
  input: { 
    padding: '14px 16px', 
    flex: 1, 
    minWidth: 200,
    borderRadius: 10, 
    border: '2px solid #e5e7eb',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'inherit'
  },
  button: { 
    padding: '14px 28px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 10, 
    cursor: 'pointer',
    fontSize: 15,
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    whiteSpace: 'nowrap'
  },
  buttonText: {
    display: 'inline-block'
  },
  projectsSection: {
    marginTop: 30
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 20,
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  projectCount: {
    fontSize: 20,
    fontWeight: 400,
    opacity: 0.8,
    marginLeft: 8
  },
  emptyState: {
    background: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 60,
    textAlign: 'center',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    margin: 0
  },
  projectsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: 25
  },
  projectCard: { 
    background: '#fff',
    borderRadius: 16, 
    padding: 25, 
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: '2px solid #f3f4f6'
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937',
    margin: 0,
    marginBottom: 8
  },
  clientName: {
    fontSize: 15,
    color: '#6b7280',
    margin: 0
  },
  deleteButton: { 
    background: '#fee2e2',
    color: '#dc2626', 
    border: 'none', 
    borderRadius: 8, 
    padding: '8px 16px', 
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    transition: 'background 0.2s'
  },
  proofForm: { 
    display: 'flex', 
    gap: 10, 
    marginBottom: 20,
    padding: 15,
    background: '#f9fafb',
    borderRadius: 12,
    flexWrap: 'wrap'
  },
  inputSmall: { 
    padding: '10px 14px', 
    flex: 1, 
    minWidth: 180,
    borderRadius: 8, 
    border: '2px solid #e5e7eb',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit'
  },
  buttonSmall: { 
    padding: '10px 20px', 
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
    color: '#fff', 
    border: 'none', 
    borderRadius: 8, 
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    transition: 'transform 0.2s',
    whiteSpace: 'nowrap'
  },
  entriesSection: {
    marginTop: 15
  },
  entriesTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 12
  },
  entriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  entryCard: { 
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
    padding: 15, 
    borderRadius: 10, 
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    border: '1px solid #bae6fd',
    transition: 'transform 0.2s'
  },
  entryContent: {
    flex: 1,
    minWidth: 0
  },
  entryNote: {
    fontSize: 14,
    color: '#1e40af',
    margin: 0,
    marginBottom: 8,
    fontWeight: 500
  },
  entryLink: {
    fontSize: 13,
    color: '#0284c7',
    textDecoration: 'none',
    wordBreak: 'break-all',
    display: 'inline-block'
  },
  deleteProofButton: { 
    background: '#fee2e2',
    color: '#dc2626', 
    border: 'none', 
    borderRadius: 6, 
    padding: '6px 10px', 
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    transition: 'background 0.2s',
    flexShrink: 0
  },
  noEntries: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    margin: 0
  }
}
