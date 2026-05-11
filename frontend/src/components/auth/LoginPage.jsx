import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { AUTH_ENDPOINTS } from '../../utils/apiPaths'
import { useUser } from '../../context/UserContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useUser()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    setLoading(true)
    try {
      const { data } = await axiosInstance.post(AUTH_ENDPOINTS.LOGIN, form)
      login(data, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#fdf6e9' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#a0522d,#7a3e22)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(6)].map((_,i) => (
            <div key={i} className="absolute rounded-full"
              style={{ width:`${60+i*40}px`, height:`${60+i*40}px`, background:'#f5deb3', top:`${10+i*13}%`, left:`${5+i*15}%` }} />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl" style={{ background:'#f5deb3' }}>
            <span className="text-3xl font-extrabold" style={{ color:'#5c2e18' }}>ET</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4">Welcome Back!</h2>
          <p className="text-amber-200 max-w-xs leading-relaxed">
            Sign in to access your dashboard, track expenses, and manage your financial journey.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-3 text-sm text-left">
            {[{icon:'📊',t:'View charts'},{icon:'💰',t:'Track income'},{icon:'💸',t:'Log expenses'},{icon:'📥',t:'Export Excel'}].map((f,i) => (
              <div key={i} className="flex items-center gap-2 text-amber-100"><span>{f.icon}</span>{f.t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center shadow mb-2" style={{ background:'#a0522d' }}>
              <span className="text-xl font-extrabold" style={{ color:'#f5deb3' }}>ET</span>
            </div>
            <p className="font-extrabold text-lg" style={{ color:'#5c2e18' }}>ExpenseTracker</p>
          </div>

          <h1 className="text-2xl font-extrabold mb-1" style={{ color:'#5c2e18' }}>Sign In</h1>
          <p className="text-sm mb-7" style={{ color:'#a0522d' }}>
            No account yet?{' '}
            <Link to="/signup" className="font-bold underline" style={{ color:'#7a3e22' }}>Create one free</Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5 flex items-start gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="input-field" autoComplete="email" />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} placeholder="Enter your password" className="input-field pr-11"
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm select-none">
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl text-xs" style={{ background:'#faf0dc', border:'1px solid #e8c98a' }}>
            <p className="font-bold mb-1" style={{ color:'#7a3e22' }}>💡 First time?</p>
            <p style={{ color:'#a0522d' }}>Register on the Signup page, then come back here to sign in.</p>
          </div>
          <p className="mt-5 text-center text-xs" style={{ color:'#a0522d' }}>
            <Link to="/" className="hover:underline">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}