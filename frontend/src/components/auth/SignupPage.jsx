import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { AUTH_ENDPOINTS } from '../../utils/apiPaths'
import { useUser } from '../../context/UserContext'

const EMOJIS = ['😊','😎','🧑','👩','🧔','👨‍💻','👩‍💻','🦸','🧙','🎯','🌟','🚀']

export default function SignupPage() {
  const navigate = useNavigate()
  const { login } = useUser()
  const fileRef = useRef(null)
  const [form, setForm]     = useState({ fullName:'', email:'', password:'' })
  const [emoji, setEmoji]   = useState(null)
  const [preview, setPreview]     = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [error, setError]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [showPw, setShowPw]       = useState(false)
  const [strength, setStrength]   = useState(0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); setError('')
    if (e.target.name === 'password') {
      const v = e.target.value; let s = 0
      if (v.length >= 6) s++; if (v.length >= 10) s++
      if (/[A-Z]/.test(v)) s++; if (/[0-9]/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v)) s++
      setStrength(s)
    }
  }

  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return
    setImageFile(file); setPreview(URL.createObjectURL(file)); setEmoji(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) { setError('All fields required'); return }
    if (form.password.length < 6) { setError('Password must be ≥ 6 characters'); return }
    setLoading(true)
    try {
      const { data } = await axiosInstance.post(AUTH_ENDPOINTS.REGISTER, {
        ...form,
        profileImageUrl: emoji !== null ? `emoji:${EMOJIS[emoji]}` : null,
      })
      if (imageFile) {
        const fd = new FormData(); fd.append('image', imageFile)
        await axiosInstance.post(AUTH_ENDPOINTS.UPLOAD_IMAGE, fd, {
          headers: { Authorization:`Bearer ${data.token}`, 'Content-Type':'multipart/form-data' },
        })
      }
      login(data, data.token); navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally { setLoading(false) }
  }

  const strengthLabel = ['','Weak','Fair','Good','Strong','Very Strong'][strength]
  const strengthColor = ['','#ef4444','#f59e0b','#f59e0b','#10b981','#10b981'][strength]

  return (
    <div className="min-h-screen flex" style={{ background:'#fdf6e9' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background:'linear-gradient(135deg,#a0522d,#5c2e18)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(5)].map((_,i) => (
            <div key={i} className="absolute rounded-full"
              style={{ width:`${80+i*40}px`, height:`${80+i*40}px`, background:'#f5deb3', top:`${15+i*14}%`, right:`${5+i*12}%` }} />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl" style={{ background:'#f5deb3' }}>
            <span className="text-3xl font-extrabold" style={{ color:'#5c2e18' }}>ET</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Join Free Today!</h2>
          <p className="text-amber-200 max-w-xs leading-relaxed mb-8">
            Start tracking your finances beautifully in just a few seconds.
          </p>
          <div className="space-y-3 text-left">
            {['Create your account','Add income sources','Log your expenses','View insights & charts'].map((s,i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-amber-100">
                <div className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                  style={{ background:'rgba(245,222,179,0.25)', border:'1px solid rgba(245,222,179,0.4)' }}>
                  {i+1}
                </div>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <h1 className="text-2xl font-extrabold mb-1" style={{ color:'#5c2e18' }}>Create Account</h1>
          <p className="text-sm mb-6" style={{ color:'#a0522d' }}>
            Already registered?{' '}
            <Link to="/login" className="font-bold underline" style={{ color:'#7a3e22' }}>Sign in</Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar */}
            <div>
              <label className="label">Profile picture (optional)</label>
              <div className="flex items-start gap-4">
                <div onClick={() => fileRef.current?.click()}
                  className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
                  style={{ borderColor:'#a0522d', background:'#faf0dc' }}>
                  {preview
                    ? <img src={preview} alt="" className="w-full h-full object-cover" />
                    : <span className="text-2xl">📷</span>}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <div className="flex flex-wrap gap-1.5">
                  {EMOJIS.map((em,i) => (
                    <button key={i} type="button" onClick={() => { setEmoji(i); setPreview(null); setImageFile(null) }}
                      className="w-9 h-9 rounded-full text-base flex items-center justify-center transition-transform hover:scale-110"
                      style={{
                        background: emoji===i ? '#a0522d' : '#faf0dc',
                        border: emoji===i ? '2px solid #7a3e22' : '1px solid #e8c98a',
                        transform: emoji===i ? 'scale(1.15)' : 'scale(1)',
                      }}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="label">Full name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" className="input-field" />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="At least 6 characters" className="input-field pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm select-none">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className="flex-1 h-1.5 rounded-full transition-all"
                        style={{ background: n <= strength ? strengthColor : '#e8c98a' }} />
                    ))}
                  </div>
                  <p className="text-xs font-semibold" style={{ color: strengthColor }}>{strengthLabel}</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </span>
                : 'Create Account →'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs" style={{ color:'#a0522d' }}>
            <Link to="/" className="hover:underline">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}