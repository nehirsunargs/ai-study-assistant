import { useState } from 'react'

const BACKEND = 'https://ai-study-assistant-ynj5.onrender.com'

const examples = ['Quantum entanglement', 'Blockchain', 'Neural networks', 'Options pricing', 'CRISPR']

export default function App() {
  const [concept, setConcept] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function explain() {
    if (!concept.trim()) return
    setLoading(true)
    setResult('')
    setError('')
    try {
      const res = await fetch(`${BACKEND}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept })
      })
      const data = await res.json()
      if (data.explanation) setResult(data.explanation)
      else setError('No explanation found. Try a different concept.')
    } catch {
      setError('Could not reach the server. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 640, width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>✦ Concept Explainer</h1>
        <p style={{ color: '#888', fontSize: 15 }}>Type any concept and get a clear AI-powered explanation.</p>
      </div>

      <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16, padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <textarea
            value={concept}
            onChange={e => setConcept(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); explain() } }}
            placeholder="e.g. Black holes, Fourier transform, Game theory..."
            style={{ flex: 1, background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 14px', color: '#f0f0f0', fontSize: 15, resize: 'none', height: 48, lineHeight: 1.5 }}
          />
          <button
            onClick={explain}
            disabled={loading}
            style={{ padding: '10px 20px', background: '#f0f0f0', color: '#0f0f0f', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, whiteSpace: 'nowrap', height: 48 }}
          >
            {loading ? '...' : 'Explain →'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {examples.map(ex => (
            <button key={ex} onClick={() => setConcept(ex)}
              style={{ fontSize: 12, padding: '4px 12px', borderRadius: 999, border: '1px solid #2a2a2a', background: 'transparent', color: '#888', cursor: 'pointer' }}>
              {ex}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', gap: 6, padding: '1rem 0' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#444', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      )}

      {(result || error) && (
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 16, padding: '1.25rem' }}>
          <p style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>✦ explanation</p>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: error ? '#e05' : '#f0f0f0' }}>{result || error}</p>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  )
}
