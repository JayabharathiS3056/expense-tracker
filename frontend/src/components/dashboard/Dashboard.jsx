import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts'
import axiosInstance from '../../utils/axiosInstance'
import { DASHBOARD_ENDPOINTS } from '../../utils/apiPaths'
import { formatCurrency, formatDateShort, CHART_COLORS } from '../../utils/helpers'
import SummaryCard from '../common/SummaryCard'
import TransactionItem from '../common/TransactionItem'

const WHEAT = '#fdf6e9'
const SIENNA = '#a0522d'

const ChartWrap = ({ title, children }) => (
  <div className="rounded-2xl p-5 shadow-sm border" style={{ background:'#fff', borderColor:'#e8c98a' }}>
    <h3 className="text-sm font-bold mb-4" style={{ color:'#5c2e18' }}>{title}</h3>
    <div className="rounded-xl p-3" style={{ background: WHEAT }}>
      {children}
    </div>
  </div>
)

const Empty = ({ msg = 'No data yet' }) => (
  <div className="h-40 flex items-center justify-center text-sm" style={{ color:'#a0522d' }}>
    <span>📭 {msg}</span>
  </div>
)

export default function Dashboard() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosInstance.get(DASHBOARD_ENDPOINTS.DATA)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent" style={{ borderColor:'#e8c98a', borderTopColor:'#a0522d', animation:'spin 0.8s linear infinite' }} />
    </div>
  )
  if (!data) return <p className="text-center mt-20" style={{ color:'#a0522d' }}>Failed to load dashboard.</p>

  /* ── Chart data ── */
  const barData = [...data.last30DaysExpenses.transactions]
    .reverse().slice(-10)
    .map(e => ({ date: formatDateShort(e.date), amount: e.amount }))

  const lineData = [...data.last60DaysIncome.transactions]
    .reverse().slice(-12)
    .map(e => ({ date: formatDateShort(e.date), amount: e.amount }))

  const pieOverview = [
    { name:'Income',  value: data.totalIncome },
    { name:'Expense', value: data.totalExpense },
  ]

  const expensePie = data.expenseByCategory.slice(0, 6).map(c => ({ name: c._id, value: c.total }))
  const incomePie  = data.incomeBySource.slice(0, 6).map(s => ({ name: s._id, value: s.total }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold" style={{ color:'#5c2e18' }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color:'#a0522d' }}>Your complete financial overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard title="Total Balance" amount={formatCurrency(data.totalBalance)} icon="💎" type="balance" />
        <SummaryCard title="Total Income"  amount={formatCurrency(data.totalIncome)}  icon="📈" type="income" />
        <SummaryCard title="Total Expenses" amount={formatCurrency(data.totalExpense)} icon="📉" type="expense" />
      </div>

      {/* Row 1 — Bar + Pie overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartWrap title="📊 Last 30 Days Expenses">
          {barData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8c98a" />
                <XAxis dataKey="date" tick={{ fontSize:11, fill:'#a0522d' }} />
                <YAxis tick={{ fontSize:11, fill:'#a0522d' }} tickFormatter={v => `₹${v}`} />
                <Tooltip
                  formatter={v => [formatCurrency(v), 'Expense']}
                  contentStyle={{ background:'#fff', border:'1px solid #e8c98a', borderRadius:8, fontSize:12 }} />
                <Bar dataKey="amount" fill={SIENNA} radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartWrap>

        <ChartWrap title="🥧 Income vs Expenses">
          {data.totalIncome === 0 && data.totalExpense === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieOverview} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                  labelLine={{ stroke:'#a0522d' }}>
                  <Cell fill="#10b981" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip formatter={v => formatCurrency(v)}
                  contentStyle={{ background:'#fff', border:'1px solid #e8c98a', borderRadius:8, fontSize:12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartWrap>
      </div>

      {/* Row 2 — Line + Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartWrap title="📈 Last 60 Days Income">
          {lineData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8c98a" />
                <XAxis dataKey="date" tick={{ fontSize:10, fill:'#a0522d' }} />
                <YAxis tick={{ fontSize:10, fill:'#a0522d' }} tickFormatter={v => `₹${v}`} />
                <Tooltip formatter={v => [formatCurrency(v), 'Income']}
                  contentStyle={{ background:'#fff', border:'1px solid #e8c98a', borderRadius:8, fontSize:11 }} />
                <Line type="monotone" dataKey="amount" stroke={SIENNA} strokeWidth={2.5} dot={{ fill:SIENNA, r:3 }} activeDot={{ r:5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartWrap>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 rounded-2xl p-5 shadow-sm border" style={{ background:'#fff', borderColor:'#e8c98a' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color:'#5c2e18' }}>🕐 Recent Transactions</h3>
          {data.recentTransactions.length === 0
            ? <Empty msg="No transactions yet" />
            : data.recentTransactions.map(t => <TransactionItem key={t._id} item={t} />)
          }
        </div>
      </div>

      {/* Row 3 — Two small pies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartWrap title="💸 Expenses by Category">
          {expensePie.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expensePie} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                  {expensePie.map((_,i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v)}
                  contentStyle={{ background:'#fff', border:'1px solid #e8c98a', borderRadius:8, fontSize:11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, color:'#a0522d' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartWrap>

        <ChartWrap title="💰 Income by Source">
          {incomePie.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={incomePie} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {incomePie.map((_,i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v)}
                  contentStyle={{ background:'#fff', border:'1px solid #e8c98a', borderRadius:8, fontSize:11 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:11, color:'#a0522d' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartWrap>
      </div>
    </div>
  )
}