export default function SummaryCard({ title, amount, icon, type = 'default' }) {
  const styles = {
    default: { bg:'#fff',        border:'#e8c98a', label:'#a0522d', value:'#5c2e18' },
    income:  { bg:'#f0fdf4',     border:'#bbf7d0', label:'#15803d', value:'#14532d' },
    expense: { bg:'#fef2f2',     border:'#fecaca', label:'#dc2626', value:'#7f1d1d' },
    balance: { bg:'#a0522d',     border:'#7a3e22', label:'#f5deb3', value:'#ffffff' },
  }
  const s = styles[type]
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ background:s.bg, border:`1px solid ${s.border}` }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: type === 'balance' ? 'rgba(245,222,179,0.2)' : '#fdf6e9' }}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color:s.label }}>{title}</p>
        <p className="text-xl font-extrabold" style={{ color:s.value }}>{amount}</p>
      </div>
    </div>
  )
}