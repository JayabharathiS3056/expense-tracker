import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { getInitials } from '../../utils/helpers'

const NAV = [
  { to:'/dashboard', label:'Dashboard', icon:(
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
  )},
  { to:'/income', label:'Income', icon:(
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
  )},
  { to:'/expense', label:'Expenses', icon:(
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/></svg>
  )},
]

function SidebarContent({ onNav }) {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="flex flex-col h-full" style={{ background:'#fdf6e9' }}>
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom:'1px solid #e8c98a' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow" style={{ background:'#a0522d' }}>
            <span className="font-extrabold text-sm" style={{ color:'#f5deb3' }}>ET</span>
          </div>
          <div>
            <p className="font-extrabold text-sm leading-none" style={{ color:'#5c2e18' }}>ExpenseTracker</p>
            <p className="text-xs mt-0.5" style={{ color:'#a0522d' }}>Finance Manager</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-4" style={{ borderBottom:'1px solid #e8c98a' }}>
        <div className="flex items-center gap-3">
          {user?.profileImageUrl && !user.profileImageUrl.startsWith('emoji:') ? (
            <img src={user.profileImageUrl} alt="" className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor:'#a0522d' }} />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background:'#a0522d', color:'#f5deb3' }}>
              {user?.profileImageUrl?.startsWith('emoji:')
                ? user.profileImageUrl.replace('emoji:','')
                : getInitials(user?.fullName)}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate" style={{ color:'#5c2e18' }}>{user?.fullName}</p>
            <p className="text-xs truncate" style={{ color:'#a0522d' }}>{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} onClick={onNav}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            {icon}{label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop:'1px solid #e8c98a' }}>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-semibold transition-all hover:bg-red-50"
          style={{ color:'#c0392b' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  )
}

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { user } = useUser()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'#fdf6e9' }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 shadow-sm" style={{ borderRight:'1px solid #e8c98a' }}>
        <SidebarContent />
      </aside>

      {/* Mobile overlay sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="relative w-64 h-full shadow-xl z-50"><SidebarContent onNav={() => setOpen(false)} /></aside>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 shadow-sm" style={{ background:'#fdf6e9', borderBottom:'1px solid #e8c98a' }}>
          <button onClick={() => setOpen(true)} className="p-2 rounded-lg" style={{ background:'#f5deb3' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color:'#5c2e18' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span className="font-extrabold" style={{ color:'#5c2e18' }}>ExpenseTracker</span>
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
            style={{ background:'#a0522d', color:'#f5deb3' }}>
            {getInitials(user?.fullName)}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}