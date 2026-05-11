import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import axiosInstance from '../../utils/axiosInstance'
import { INCOME_ENDPOINTS } from '../../utils/apiPaths'
import { formatCurrency, formatDate, downloadBlob, INCOME_SOURCES, CHART_COLORS } from '../../utils/helpers'

const today = () => new Date().toISOString().split('T')[0]

export default function IncomePage() {
  const [incomes, setIncomes]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [adding, setAdding]     = useState(false)
  const [downloading, setDl]    = useState(false)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({ icon:'💰', source:'', amount:'', date: today() })

  const fetchIncomes = async () => {
    try {
      const { data } = await axiosInstance.get(INCOME_ENDPOINTS.ALL)
      setIncomes(data)
    } catch { setError('Failed to load income data') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchIncomes() }, [])

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError('') }

  const handleSourceSelect = (src) => setForm({ ...form, icon: src.icon, source: src.label })

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.source || !form.amount || !form.date) { setError('All fields required'); return }
    if (Number(form.amount) <= 0) { setError('Amount must be > 0'); return }
    setAdding(true)
    try {
      await axiosInstance.post(INCOME_ENDPOINTS.ADD, { ...form, amount: Number(form.amount) })
      setForm({ icon:'💰', source:'', amount:'', date: today() })
      await fetchIncomes()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add income')
    } finally { setAdding(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income?')) return
    try {
      await axiosInstance.delete(INCOME_ENDPOINTS.DELETE(id))
      setIncomes(incomes.filter(i => i._id !== id))
    } catch { setError('Failed to delete') }
  }

  const handleDownload = async () => {
    setDl(true)
    try {
      const { data } = await axiosInstance.get(INCOME_ENDPOINTS.DOWNLOAD_EXCEL, { responseType:'blob' })
      downloadBlob(data, `income-report-${Date.now()}.xlsx`)
    } catch { setError('Download failed') }
    finally { setDl(false) }
  }

  const total = incomes.reduce((s,i) => s + i.amount, 0)

  const pieData = INCOME_SOURCES.map(src => ({
    name: src.label,
    value: incomes.filter(i => i.source === src.label).reduce((s,i) => s + i.amount, 0),
  })).filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold" style={{ color:'#5c2e18' }}>Income</h1>
          <p className="text-sm mt-0.5" style={{ color:'#a0522d' }}>Manage all your income sources</p>
        </div>
        <button onClick={handleDownload} disabled={downloading || incomes.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-md disabled:opacity-50"
          style={{ background:'#a0522d', color:'#f5deb3' }}>
          {downloading ? '⏳ Downloading...' : '📥 Download Excel'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">⚠️ {error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add form */}
        <div className="rounded-2xl p-6 shadow-sm border" style={{ background:'#fff', borderColor:'#e8c98a' }}>
          <h2 className="text-base font-bold mb-4" style={{ color:'#5c2e18' }}>➕ Add Income</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            {/* Quick source select */}
            <div>
              <label className="label">Select Source</label>
              <div className="grid grid-cols-3 gap-1.5">
                {INCOME_SOURCES.map((src,i) => (
                  <button key={i} type="button" onClick={() => handleSourceSelect(src)}
                    className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: form.source === src.label ? '#a0522d' : '#fdf6e9',
                      color:      form.source === src.label ? '#f5deb3' : '#7a3e22',
                      border:     form.source === src.label ? '1.5px solid #7a3e22' : '1px solid #e8c98a',
                    }}>
                    <span className="text-lg">{src.icon}</span>
                    <span className="leading-tight text-center">{src.label.split('&')[0].trim()}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Source name</label>
              <input type="text" name="source" value={form.source} onChange={handleChange}
                placeholder="e.g. Monthly Salary" className="input-field" />
            </div>
            <div>
              <label className="label">Amount (₹)</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange}
                placeholder="0.00" min="1" className="input-field" />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className="input-field" />
            </div>
            <button type="submit" disabled={adding} className="btn-primary w-full py-2.5">
              {adding ? 'Adding...' : '+ Add Income'}
            </button>
          </form>
        </div>

        {/* Right column — summary + chart */}
        <div className="lg:col-span-2 space-y-5">
          {/* Summary + chart */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Total */}
            <div className="rounded-2xl p-5 shadow-sm border flex flex-col justify-between"
              style={{ background:'#a0522d', borderColor:'#7a3e22' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'#f5deb3' }}>Total Income</p>
              <p className="text-3xl font-extrabold text-white">{formatCurrency(total)}</p>
              <p className="text-sm mt-2" style={{ color:'#f5deb3' }}>{incomes.length} record{incomes.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Pie */}
            <div className="rounded-2xl p-4 shadow-sm border" style={{ background:'#fff', borderColor:'#e8c98a' }}>
              <p className="text-xs font-bold mb-2" style={{ color:'#5c2e18' }}>By Source</p>
              <div className="rounded-xl" style={{ background:'#fdf6e9' }}>
                {pieData.length === 0
                  ? <div className="h-28 flex items-center justify-center text-xs" style={{ color:'#a0522d' }}>No data</div>
                  : <ResponsiveContainer width="100%" height={130}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={50} dataKey="value">
                          {pieData.map((_,i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={v => formatCurrency(v)}
                          contentStyle={{ background:'#fff', border:'1px solid #e8c98a', borderRadius:8, fontSize:11 }} />
                        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize:10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                }
              </div>
            </div>
          </div>

          {/* Income list */}
          <div className="rounded-2xl shadow-sm border overflow-hidden" style={{ background:'#fff', borderColor:'#e8c98a' }}>
            <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom:'1px solid #faf0dc' }}>
              <h3 className="text-sm font-bold" style={{ color:'#5c2e18' }}>All Income Records</h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:'#fdf6e9', color:'#a0522d' }}>
                {incomes.length} total
              </span>
            </div>
            {loading ? (
              <div className="p-8 text-center text-sm" style={{ color:'#a0522d' }}>Loading...</div>
            ) : incomes.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-3xl mb-2">💰</p>
                <p className="text-sm font-semibold" style={{ color:'#a0522d' }}>No income added yet</p>
                <p className="text-xs mt-1" style={{ color:'#c4733f' }}>Use the form to add your first income</p>
              </div>
            ) : (
              <div className="divide-y max-h-80 overflow-y-auto" style={{ divideColor:'#faf0dc' }}>
                {incomes.map(income => (
                  <div key={income._id}
                    className="group flex items-center justify-between px-5 py-3 transition-all hover:bg-amber-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                        style={{ background:'#f0fdf4' }}>
                        {income.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color:'#5c2e18' }}>{income.source}</p>
                        <p className="text-xs" style={{ color:'#a0522d' }}>{formatDate(income.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold" style={{ color:'#15803d' }}>
                        +{formatCurrency(income.amount)}
                      </span>
                      <button onClick={() => handleDelete(income._id)}
                        className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-red-100">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#ef4444">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
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