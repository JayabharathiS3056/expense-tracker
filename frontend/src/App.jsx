import { Routes, Route, Navigate } from 'react-router-dom'
import { useUser } from './context/UserContext'
import Layout       from './components/common/Layout'
import LandingPage  from './components/landing/LandingPage'
import LoginPage    from './components/auth/LoginPage'
import SignupPage   from './components/auth/SignupPage'
import Dashboard    from './components/dashboard/Dashboard'
import IncomePage   from './components/income/IncomePage'
import ExpensePage  from './components/expense/ExpensePage'

const Spinner = () => (
  <div className="flex items-center justify-center h-screen bg-amber-50">
    <div className="w-10 h-10 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin" />
  </div>
)

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser()
  if (loading) return <Spinner />
  return user ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useUser()
  if (loading) return <Spinner />
  return user ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup"  element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/income"    element={<IncomePage />} />
        <Route path="/expense"   element={<ExpensePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}