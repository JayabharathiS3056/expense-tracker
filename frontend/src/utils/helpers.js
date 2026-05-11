import moment from 'moment'

export const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(amount)

export const formatDate      = (d) => moment(d).format('DD MMM YYYY')
export const formatDateShort = (d) => moment(d).format('DD MMM')

export const downloadBlob = (data, filename) => {
  const url  = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href  = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

export const EXPENSE_CATEGORIES = [
  { label:'Food & Dining',    icon:'🍽️' },
  { label:'Transportation',   icon:'🚗' },
  { label:'Shopping',         icon:'🛍️' },
  { label:'Entertainment',    icon:'🎬' },
  { label:'Health & Fitness', icon:'💊' },
  { label:'Utilities',        icon:'⚡' },
  { label:'Education',        icon:'📚' },
  { label:'Travel',           icon:'✈️' },
  { label:'Housing & Rent',   icon:'🏠' },
  { label:'Personal Care',    icon:'💅' },
  { label:'Subscriptions',    icon:'📱' },
  { label:'Others',           icon:'💸' },
]

export const INCOME_SOURCES = [
  { label:'Salary',         icon:'💼' },
  { label:'Freelance',      icon:'💻' },
  { label:'Business',       icon:'🏢' },
  { label:'Investments',    icon:'📈' },
  { label:'Rental Income',  icon:'🏘️' },
  { label:'Dividends',      icon:'💹' },
  { label:'Side Project',   icon:'🚀' },
  { label:'Gift',           icon:'🎁' },
  { label:'Bonus',          icon:'🎯' },
  { label:'Others',         icon:'💰' },
]

export const CHART_COLORS = [
  '#a0522d','#c4733f','#e8c98a','#f5deb3',
  '#7a3e22','#d4a96a','#5c2e18','#f0c060',
  '#8b5e3c','#daa060',
]