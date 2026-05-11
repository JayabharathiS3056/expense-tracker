import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal,.reveal-left,.reveal-right')
    const io  = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ─── Navbar ─────────────────────────────────────────── */
function Navbar() {
  const { user } = useUser()
  const navRef   = useRef(null)
  useEffect(() => {
    const fn = () => {
      if (!navRef.current) return
      if (window.scrollY > 40) {
        navRef.current.style.boxShadow = '0 4px 24px rgba(160,82,45,0.10)'
        navRef.current.style.background = 'rgba(253,246,233,0.97)'
      } else {
        navRef.current.style.boxShadow = 'none'
        navRef.current.style.background = 'rgba(253,246,233,0.80)'
      }
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav ref={navRef} style={{backdropFilter:'blur(8px)', background:'rgba(253,246,233,0.80)', transition:'all 0.3s'}}
      className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-800 flex items-center justify-center shadow">
            <span className="text-amber-50 font-bold text-sm">ET</span>
          </div>
          <span className="font-extrabold text-amber-900 text-lg tracking-tight">ExpenseTracker</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-amber-800">
          <a href="#about"    className="hover:text-amber-600 transition-colors">About</a>
          <a href="#features" className="hover:text-amber-600 transition-colors">Features</a>
          <a href="#why-us"   className="hover:text-amber-600 transition-colors">Why Us</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-sm py-2 px-5">Dashboard →</Link>
          ) : (
            <>
              <Link to="/login"  className="text-sm font-semibold text-amber-800 hover:text-amber-600 px-3 py-2 transition-colors">Sign In</Link>
              <Link to="/signup" className="btn-primary text-sm py-2 px-5">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
      style={{background:'linear-gradient(135deg, #fdf6e9 0%, #f5deb3 40%, #fdf6e9 100%)'}}>
      {/* Blobs */}
      <div className="absolute top-24 left-8 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{background:'rgba(160,82,45,0.08)'}} />
      <div className="absolute bottom-16 right-8 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{background:'rgba(160,82,45,0.10)'}} />

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 py-16">
        {/* Text side */}
        <div className="anim-slide-right">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full mb-6">
            💰 Smart Finance Management
          </span>
          <h1 className="font-extrabold text-amber-900 leading-tight mb-5"
            style={{fontSize:'clamp(2rem,5vw,3.5rem)'}}>
            Take Control of<br />
            <span className="text-amber-700" style={{textDecoration:'underline', textDecorationColor:'#a0522d', textDecorationThickness:'3px', textUnderlineOffset:'6px'}}>
              Your Finances !
            </span>
          </h1>
          <p className="text-amber-700 text-lg leading-relaxed mb-8 max-w-lg">
            Track every rupee, visualise spending habits and make smarter financial decisions — all in one beautiful dashboard.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to="/signup"
              className="btn-primary text-base py-3 px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Start for Free →
            </Link>
            <a href="#features" className="btn-outline text-base py-3 px-8">See Features</a>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-sm text-amber-600 font-medium">
            <span className="flex items-center gap-1.5"><span className="text-green-500 font-bold">✓</span> No credit card</span>
            <span className="flex items-center gap-1.5"><span className="text-green-500 font-bold">✓</span> Free forever</span>
            <span className="flex items-center gap-1.5"><span className="text-green-500 font-bold">✓</span> Open source</span>
          </div>
        </div>

        {/* Floating card */}
        <div className="anim-slide-left hidden md:flex justify-center">
          <div className="relative">
            <div className="anim-float bg-white rounded-3xl shadow-2xl border border-amber-200 p-6 w-80">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide">Total Balance</p>
                  <p className="text-2xl font-extrabold text-amber-900">₹1,24,500</p>
                </div>
                <div className="w-11 h-11 bg-amber-800 rounded-xl flex items-center justify-center shadow">
                  <span className="text-white font-bold text-sm">ET</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="text-xs text-green-600 font-semibold">Income</p>
                  <p className="text-lg font-bold text-green-700">₹80,000</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                  <p className="text-xs text-red-500 font-semibold">Expenses</p>
                  <p className="text-lg font-bold text-red-600">₹44,500</p>
                </div>
              </div>
              {/* Mini chart */}
              <div className="rounded-xl p-3 mb-4" style={{background:'#fdf6e9'}}>
                <p className="text-xs text-amber-600 font-semibold mb-2">This Week</p>
                <div className="flex items-end gap-1 h-10">
                  {[35,60,28,75,50,68,42].map((h,i) => (
                    <div key={i} className="flex-1 rounded-sm transition-all"
                      style={{height:`${h}%`, background:`rgba(160,82,45,${0.4+i*0.08})`}} />
                  ))}
                </div>
              </div>
              {[
                {icon:'🍽️', label:'Food & Dining', amt:'-₹2,400', c:'#ef4444'},
                {icon:'💼', label:'Salary',         amt:'+₹50,000', c:'#10b981'},
              ].map((t,i) => (
                <div key={i} className="flex items-center justify-between py-2 border-t border-amber-50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                      style={{background:'#fdf6e9'}}>{t.icon}</div>
                    <span className="text-sm font-medium text-amber-800">{t.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{color:t.c}}>{t.amt}</span>
                </div>
              ))}
            </div>
            <div className="absolute -top-3 -right-3 bg-amber-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              📊 Live Charts
            </div>
            <div className="absolute -bottom-3 -left-3 bg-white border border-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              🔒 JWT Secured
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <span className="text-xs font-medium text-amber-500">Scroll to explore</span>
        <div className="w-5 h-8 border-2 border-amber-400 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-amber-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}

/* ─── Stats Banner ───────────────────────────────────── */
function StatsBanner() {
  const stats = [
    {value:'10K+',  label:'Active Users'},
    {value:'₹50Cr+',label:'Tracked'},
    {value:'99.9%', label:'Uptime'},
    {value:'4.9★',  label:'User Rating'},
  ]
  return (
    <section style={{background:'#a0522d'}} className="py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s,i) => (
          <div key={i} className="reveal" style={{animationDelay:`${i*0.1}s`}}>
            <p className="text-3xl font-extrabold text-amber-50">{s.value}</p>
            <p className="text-amber-300 text-sm font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── About / Who Are We ─────────────────────────────── */
function AboutSection() {
  return (
    <section id="about" className="py-24" style={{background:'#fdf6e9'}}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div className="reveal-left">
            <span className="inline-block text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full mb-4">
              Who Are We?
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-5 leading-tight">
              Built by Developer,<br />
              <span className="text-amber-700">For Real People</span>
            </h2>
            <p className="text-amber-700 leading-relaxed mb-4">
              We're a passionate team who got tired of complex, expensive finance apps. We built
              ExpenseTracker to be <strong>simple, beautiful and powerful</strong> — giving everyone
              access to professional-grade financial tools.
            </p>
            <p className="text-amber-700 leading-relaxed mb-7">
              From students managing pocket money to professionals tracking business expenses — our
              app adapts to every lifestyle and financial goal.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {icon:'🎯', text:'Goal-oriented design'},
                {icon:'🔒', text:'Bank-level security'},
                {icon:'📱', text:'Mobile-first approach'},
                {icon:'🇮🇳', text:'India-focused (₹ INR)'},
              ].map((f,i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <span className="text-lg">{f.icon}</span>{f.text}
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-right grid grid-cols-2 gap-4">
            {[
              {icon:'👨‍💻', title:'MERN Stack',   desc:'MongoDB · Express · React · Node.js', dark:true},
              {icon:'🔐', title:'JWT Auth',     desc:'Secure token-based authentication',   dark:false},
              {icon:'📊', title:'Recharts',     desc:'Beautiful interactive charts',        dark:false},
              {icon:'📥', title:'Excel Export', desc:'Download your data anytime',          dark:true},
            ].map((c,i) => (
              <div key={i} className="rounded-2xl p-5 shadow-sm"
                style={{
                  background: c.dark ? '#a0522d' : '#fff',
                  border: c.dark ? 'none' : '1px solid #e8c98a',
                  color: c.dark ? '#fdf6e9' : '#5c2e18',
                }}>
                <span className="text-3xl block mb-2">{c.icon}</span>
                <p className="font-bold text-sm">{c.title}</p>
                <p className="text-xs mt-1 opacity-80">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ───────────────────────────────────────── */
function FeaturesSection() {
  const features = [
    {icon:'📊', title:'Interactive Charts',    desc:'Bar, pie and line charts on a warm wheat background for perfect readability and contrast.'},
    {icon:'💼', title:'Income Tracking',       desc:'Log salary, freelance, business income and view 60-day trends at a glance.'},
    {icon:'💸', title:'Expense Categories',    desc:'12 smart categories — Food, Travel, Health and more. Know exactly where every rupee goes.'},
    {icon:'🔒', title:'JWT Authentication',    desc:'Your data is protected with industry-standard JSON Web Tokens. Sessions last 7 days.'},
    {icon:'📥', title:'Excel Reports',         desc:'Download styled Excel reports for income or expenses — perfect for taxes and audits.'},
    {icon:'📱', title:'Fully Responsive',      desc:'Works flawlessly on desktop, tablet and mobile. Track finances on the go.'},
  ]
  return (
    <section id="features" className="py-24" style={{background:'#faf0dc'}}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <span className="inline-block text-xs font-bold text-amber-800 bg-amber-200 border border-amber-300 px-4 py-1.5 rounded-full mb-4">Features</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-4">Everything You Need</h2>
          <p className="text-amber-600 max-w-xl mx-auto">A complete finance suite built with modern technology and delightful UX.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f,i) => (
            <div key={i} className="reveal group bg-white rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
              style={{animationDelay:`${i*0.08}s`}}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-all duration-300"
                style={{background:'#fdf6e9'}}>
                {f.icon}
              </div>
              <h3 className="font-bold text-amber-900 text-base mb-2">{f.title}</h3>
              <p className="text-amber-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Why Us ─────────────────────────────────────────── */
function WhyUsSection() {
  const reasons = [
    {icon:'🆓', title:'100% Free',       desc:'No hidden fees, no premium tier. Every feature is free — forever.'},
    {icon:'🚀', title:'Fast & Reliable', desc:'High-performance MERN stack with 99.9% uptime and instant responses.'},
    {icon:'🎨', title:'Beautiful Design',desc:'Warm wheat & sienna palette that makes finance feel calm and approachable.'},
    {icon:'📦', title:'Open Source',     desc:'Fully transparent codebase — fork it, host it, customise it your way.'},
  ]
  return (
    <section id="why-us" className="py-24" style={{background:'#fdf6e9'}}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <span className="inline-block text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full mb-4">Why Choose Us?</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-4">Why ExpenseTracker?</h2>
          <p className="text-amber-600 max-w-xl mx-auto">Thousands of users trust us to manage their finances. Here's why.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {reasons.map((r,i) => (
            <div key={i} className="reveal flex gap-5 bg-white rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              style={{animationDelay:`${i*0.1}s`}}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow"
                style={{background:'#a0522d'}}>
                {r.icon}
              </div>
              <div>
                <h3 className="font-bold text-amber-900 text-base mb-1.5">{r.title}</h3>
                <p className="text-amber-600 text-sm leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="reveal overflow-hidden rounded-2xl border border-amber-200 shadow-sm bg-white">
          <div className="grid grid-cols-3 text-sm font-bold text-white" style={{background:'#a0522d'}}>
            <div className="p-4">Feature</div>
            <div className="p-4 text-center opacity-80">Other Apps</div>
            <div className="p-4 text-center">ExpenseTracker ✓</div>
          </div>
          {[
            ['Free Forever',       '❌',        '✅ Free'],
            ['Excel Export',       '💲 Paid',   '✅ Free'],
            ['Interactive Charts', '💲 Paid',   '✅ Free'],
            ['JWT Auth',           '⚠️ Basic',  '✅ Full'],
            ['Mobile Responsive',  '⚠️ Partial','✅ Full'],
            ['Open Source',        '❌',        '✅ Yes'],
          ].map(([feat, other, ours], i) => (
            <div key={i} className="grid grid-cols-3 text-sm border-t border-amber-100"
              style={{background: i%2===0 ? '#fdf6e9' : '#fff'}}>
              <div className="p-4 font-semibold text-amber-800">{feat}</div>
              <div className="p-4 text-center text-amber-500">{other}</div>
              <div className="p-4 text-center font-bold text-green-600">{ours}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden" style={{background:'#a0522d'}}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_,i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width:`${70+i*50}px`, height:`${70+i*50}px`,
              background:'rgba(245,222,179,0.08)',
              top:`${10+i*15}%`, left:`${5+i*20}%`,
            }} />
        ))}
      </div>
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10 reveal">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-5">Ready to Get Started?</h2>
        <p className="text-amber-200 text-lg mb-8 leading-relaxed">
          Join thousands who are already making smarter financial decisions every single day.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/signup"
            className="font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
            style={{background:'#f5deb3', color:'#5c2e18'}}>
            Create Free Account →
          </Link>
          <Link to="/login"
            className="font-bold py-3 px-8 rounded-xl border-2 border-white text-white hover:bg-white/10 transition-all">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{background:'#5c2e18'}} className="text-amber-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'#f5deb3'}}>
                <span className="font-bold text-xs" style={{color:'#5c2e18'}}>ET</span>
              </div>
              <span className="font-extrabold text-amber-50 text-base">ExpenseTracker</span>
            </div>
            <p className="text-sm leading-relaxed text-amber-300 max-w-xs">
              A modern, open-source MERN stack expense tracking app. Beautiful, fast and completely free.
            </p>
            <div className="flex gap-3 mt-4">
              {['GitHub','Twitter','LinkedIn'].map(s => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-colors font-medium"
                  style={{background:'rgba(160,82,45,0.4)', color:'#f5deb3'}}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-amber-50 mb-4 text-sm">Navigate</p>
            <ul className="space-y-2 text-sm">
              {[['Home','/'],['Sign Up','/signup'],['Sign In','/login'],['Dashboard','/dashboard']].map(([l,h]) => (
                <li key={l}><Link to={h} className="hover:text-amber-50 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold text-amber-50 mb-4 text-sm">Tech Stack</p>
            <ul className="space-y-2 text-sm">
              {['MongoDB','Express.js','React 18','Node.js','Recharts','ExcelJS','JWT Auth','Tailwind CSS'].map(t => (
                <li key={t} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:'#f5deb3'}} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-amber-400"
          style={{borderColor:'rgba(160,82,45,0.4)'}}>
          <p>© {new Date().getFullYear()} ExpenseTracker. Built with ❤️ using MERN Stack. By Jayabharathi S</p>
          <div className="flex items-center gap-1">
            Wheat <span className="inline-block w-3 h-3 rounded-full mx-1" style={{background:'#f5deb3'}} />
            &amp; Sienna <span className="inline-block w-3 h-3 rounded-full mx-1" style={{background:'#a0522d'}} />
            Theme
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  useReveal()
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsBanner />
      <AboutSection />
      <FeaturesSection />
      <WhyUsSection />
      <CTASection />
      <Footer />
    </div>
  )
}