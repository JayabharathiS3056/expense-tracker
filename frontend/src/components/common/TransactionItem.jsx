import { formatCurrency, formatDate } from '../../utils/helpers'

export default function TransactionItem({ item, onDelete }) {
  const isIncome = item.type === 'income'
  return (
    <div className="group flex items-center justify-between py-3 px-3 rounded-xl transition-all hover:shadow-sm"
      style={{ borderBottom:'1px solid #faf0dc' }}
      onMouseEnter={e => e.currentTarget.style.background='#fdf6e9'}
      onMouseLeave={e => e.currentTarget.style.background='transparent'}>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: isIncome ? '#f0fdf4' : '#fef2f2' }}>
          {item.icon || (isIncome ? '💰' : '💸')}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color:'#5c2e18' }}>
            {isIncome ? item.source : item.category}
          </p>
          {!isIncome && item.description && (
            <p className="text-xs truncate max-w-[160px]" style={{ color:'#a0522d' }}>{item.description}</p>
          )}
          <p className="text-xs" style={{ color:'#a0522d' }}>{formatDate(item.date)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-bold" style={{ color: isIncome ? '#15803d' : '#dc2626' }}>
          {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
        </span>
        {onDelete && (
          <button onClick={() => onDelete(item._id)}
            className="opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-red-100"
            title="Delete">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#ef4444">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}