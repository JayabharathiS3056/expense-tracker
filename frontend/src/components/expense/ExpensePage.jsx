import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import axiosInstance from '../../utils/axiosInstance'
import { EXPENSE_ENDPOINTS } from '../../utils/apiPaths'
import { formatCurrency, formatDate, downloadBlob, EXPENSE_CATEGORIES, CHART_COLORS } from '../../utils/helpers'

const today = () => new Date().toISOString().split('T')[0]

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading]   = useState(true)
  const [adding, setAdding]     = useState(false)
  const [downloading, setDl]    = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm] = useState({
    icon: '💸', category: '', description: '', amount: '', date: today()
  })

  const fetchExpenses = async () => {
    try {
      const { data } = await axiosInstance.get(EXPENSE_ENDPOINTS.ALL)
      setExpenses(data)
    } catch { setError('Failed to load expense data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchExpenses() }, [])

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const handleCategorySelect = (cat) => setForm({ ...form, icon: cat.icon, category: cat.label })

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.category || !form.amount || !form.date) { setError('Category, amount and date are required'); return }
    if (Number(form.amount) <= 0) { setError('Amount must be greater than 0'); return }
    setAdding(true)
    try {
      await axiosInstance.post(EXPENSE_ENDPOINTS.ADD, { ...form, amount: Number(form.amount) })
      setForm({ icon: '💸', category: '', description: '', amount: '', date: today() })
      await fetchExpenses()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense')
    } finally { setAdding(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense record?')) return
    try {
      await axiosInstance.delete(EXPENSE_ENDPOINTS.DELETE(id))
      setExpenses(expenses.filter(e => e._id !== id))
    } catch { setError('Failed to delete expense') }
  }

  const handleDownload = async () => {
    setDl(true)
    try {
      const { data } = await axiosInstance.get(EXPENSE_ENDPOINTS.DOWNLOAD_EXCEL, { responseType: 'blob' })
      downloadBlob(data, `expense-report-${Date.now()}.xlsx`)
    } catch { setError('Download failed') }
    finally { setDl(false) }
  }

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  // Pie chart — by category
  const pieData = EXPENSE_CATEGORIES.map(cat => ({
    name: cat.label,
    value: expenses.filter(e => e.category === cat.label).reduce((s, e) => s + e.amount, 0),
  })).filter(d => d.value > 0)

  // Bar chart — top 6 categories
  const barData = pieData.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color: '#5c2e18' }}>Expenses</h1>
          <p className="text-sm mt-0.5" style={{ color: '#a0522d' }}>Track and manage all your expenses</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading || expenses.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          style={{ background: '#a0522d', color: '#f5deb3' }}
        >
          {downloading ? '⏳ Downloading...' : '📥 Download Excel'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex gap-2">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Add Expense Form ── */}
        <div className="rounded-2xl p-6 shadow-sm border" style={{ background: '#fff', borderColor: '#e8c98a' }}>
          <h2 className="text-base font-bold mb-4" style={{ color: '#5c2e18' }}>➕ Add Expense</h2>
          <form onSubmit={handleAdd} className="space-y-4">

            {/* Category quick-select grid */}
            <div>
              <label className="label">Select Category</label>
              <div className="grid grid-cols-3 gap-1.5">
                {EXPENSE_CATEGORIES.map((cat, i) => (
                  <button
                    key={i} type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: form.category === cat.label ? '#a0522d' : '#fdf6e9',
                      color:      form.category === cat.label ? '#f5deb3' : '#7a3e22',
                      border:     form.category === cat.label ? '1.5px solid #7a3e22' : '1px solid #e8c98a',
                    }}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="leading-tight text-center">{cat.label.split('&')[0].trim()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category name (editable) */}
            <div>
              <label className="label">Category name</label>
              <input
                type="text" name="category" value={form.category}
                onChange={handleChange} placeholder="e.g. Lunch, Netflix..."
                className="input-field"
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">Description <span className="font-normal text-xs" style={{ color: '#c4733f' }}>(optional)</span></label>
              <input
                type="text" name="description" value={form.description}
                onChange={handleChange} placeholder="Short note..."
                className="input-field"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="label">Amount (₹)</label>
              <input
                type="number" name="amount" value={form.amount}
                onChange={handleChange} placeholder="0.00" min="1"
                className="input-field"
              />
            </div>

            {/* Date */}
            <div>
              <label className="label">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="input-field" />
            </div>

            <button type="submit" disabled={adding} className="btn-primary w-full py-2.5">
              {adding
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Adding...
                  </span>
                : '+ Add Expense'}
            </button>
          </form>
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Summary card + pie chart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Total card */}
            <div className="rounded-2xl p-5 shadow-sm border flex flex-col justify-between"
              style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', borderColor: '#fca5a5' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1 text-red-100">Total Expenses</p>
              <p className="text-3xl font-extrabold text-white">{formatCurrency(total)}</p>
              <p className="text-sm mt-2 text-red-200">{expenses.length} record{expenses.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Pie chart */}
            <div className="rounded-2xl p-4 shadow-sm border" style={{ background: '#fff', borderColor: '#e8c98a' }}>
              <p className="text-xs font-bold mb-2" style={{ color: '#5c2e18' }}>By Category</p>
              <div className="rounded-xl" style={{ background: '#fdf6e9' }}>
                {pieData.length === 0
                  ? <div className="h-28 flex items-center justify-center text-xs" style={{ color: '#a0522d' }}>No data yet</div>
                  : <ResponsiveContainer width="100%" height={130}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={50} dataKey="value">
                          {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip
                          formatter={v => formatCurrency(v)}
                          contentStyle={{ background: '#fff', border: '1px solid #e8c98a', borderRadius: 8, fontSize: 11 }}
                        />
                        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                }
              </div>
            </div>
          </div>

          {/* Bar chart — spending by category */}
          {barData.length > 0 && (
            <div className="rounded-2xl p-5 shadow-sm border" style={{ background: '#fff', borderColor: '#e8c98a' }}>
              <p className="text-sm font-bold mb-3" style={{ color: '#5c2e18' }}>📊 Spending by Category</p>
              <div className="rounded-xl p-3" style={{ background: '#fdf6e9' }}>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={barData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8c98a" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a0522d' }}
                      tickFormatter={v => v.length > 8 ? v.slice(0, 8) + '…' : v} />
                    <YAxis tick={{ fontSize: 10, fill: '#a0522d' }} tickFormatter={v => `₹${v}`} />
                    <Tooltip
                      formatter={v => [formatCurrency(v), 'Amount']}
                      contentStyle={{ background: '#fff', border: '1px solid #e8c98a', borderRadius: 8, fontSize: 11 }}
                    />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                      {barData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ── Expense List ── */}
          <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ background: '#fff', borderColor: '#e8c98a' }}>
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid #faf0dc' }}>
              <h3 className="text-sm font-bold" style={{ color: '#5c2e18' }}>All Expense Records</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#fef2f2', color: '#dc2626' }}>
                {expenses.length} total
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm" style={{ color: '#a0522d' }}>Loading...</div>
            ) : expenses.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2">💸</p>
                <p className="text-sm font-semibold" style={{ color: '#a0522d' }}>No expenses added yet</p>
                <p className="text-xs mt-1" style={{ color: '#c4733f' }}>Use the form to log your first expense</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {expenses.map(exp => (
                  <div
                    key={exp._id}
                    className="group flex items-center justify-between px-5 py-3 transition-all hover:bg-red-50"
                    style={{ borderBottom: '1px solid #faf0dc' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: '#fef2f2' }}>
                        {exp.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#5c2e18' }}>{exp.category}</p>
                        {exp.description && (
                          <p className="text-xs truncate max-w-[200px]" style={{ color: '#a0522d' }}>{exp.description}</p>
                        )}
                        <p className="text-xs" style={{ color: '#c4733f' }}>{formatDate(exp.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold" style={{ color: '#dc2626' }}>
                        -{formatCurrency(exp.amount)}
                      </span>
                      <button
                        onClick={() => handleDelete(exp._id)}
                        className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-red-100"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#ef4444">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
