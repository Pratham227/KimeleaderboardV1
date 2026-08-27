'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import * as htmlToImage from 'html-to-image'
import {
  Trophy, Crown, Medal, Flame, Sparkles, Rocket, Shield, Star, Zap, ChevronUp, ChevronDown, Minus,
  Search, Filter, Bell, LogOut, Gem, Users, Target, Award, Calendar, Swords, TrendingUp,
  Eye, EyeOff, Lock, User as UserIcon, ArrowRight, ArrowLeft, Home, BarChart3, Gift, Hexagon,
  Camera, Download, Share2, X, Instagram,
} from 'lucide-react'
import Particles from '@/components/leaderboard/Particles'
import Counter from '@/components/leaderboard/Counter'
import { BRANCHES, TEAM_LEADS, CHALLENGES ,REWARD_CONTEST } from '@/lib/leaderboard-data'
import { getSortedRowModel } from '@tanstack/react-table'
import ProfileSection from '@/components/leaderboard/profile/ProfileSection'
import NotificationBell from '@/components/NotificationBell'


/* ------------- LOGO ------------- */
const Logo = ({ size = 40 }) => (
  <div className="flex items-center gap-3">
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <motion.div
        className="absolute -inset-1.5 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-blue-500"
        animate={{ rotate: [0, 360] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
        style={{ filter: 'blur(14px)', opacity: 0.6 }}
      />
      <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-white/95 to-white/80 p-1.5 shadow-[0_0_24px_rgba(59,130,246,0.45)] ring-1 ring-white/30 overflow-hidden">
        <img
          src="/Kimelogo.jpg"
          alt="Kime Careers"
          className="w-full h-full object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>
    </div>
    <div className="leading-none">
      <div className="font-display font-black tracking-widest text-lg gradient-text-cyber">KIME</div>
      <div className="text-[10px] uppercase tracking-[0.35em] text-white/50">Careers</div>
    </div>
  </div>
)

/* ------------- LOGIN ------------- */
function LoginView({ onLogin, goForgot }) {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Email and password are required'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error || 'Login failed'); setLoading(false); return }
      try {
        localStorage.setItem('kime_user', JSON.stringify(data.user))
        localStorage.setItem('kime_token', data.token)
      } catch {}
      onLogin(data.user)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative overflow-hidden bg-aurora">
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="stars" />
      {/* LEFT */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <Particles density={70} />
        <div className="relative z-10">
          <Logo size={44} />
        </div>
        <div className="relative z-10 space-y-6 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-fuchsia-300"
          >
            <Sparkles size={14} /> Month 04 · Live Now
          </motion.div>
          <h1 className="font-display text-5xl xl:text-6xl font-black leading-[1.05]">
            Unlock <span className="gradient-text-cyber">Peak</span><br />
            <span className="gradient-text-gold">Productivity</span>
          </h1>
          <p className="text-white/60 text-lg max-w-md">
            Compete. Climb. Conquer. The elite counsellor leaderboard where every admission pushes you higher.
          </p>
          <div className="flex gap-3 pt-4">
            {[{ v: '₹4.8Cr+', l: 'Season Revenue' }, { v: '1,284', l: 'Admissions' }, { v: '28', l: 'Warriors' }].map((s, i) => (
              <motion.div key={i} className="glass rounded-xl px-4 py-3 min-w-[110px]"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <div className="font-display text-xl font-bold gradient-text-cyber">{s.v}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">{s.l}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-white/40">© 2025 Kime Careers · All victories belong to the bold.</div>
        {/* Floating glow orbs */}
        <div className="absolute -left-20 top-1/3 w-72 h-72 rounded-full bg-fuchsia-600/30 blur-[100px]" />
        <div className="absolute right-10 bottom-10 w-80 h-80 rounded-full bg-blue-600/25 blur-[110px]" />
      </div>

      {/* RIGHT */}
      <div className="relative flex items-center justify-center p-6 lg:p-10">
        <div className="lg:hidden absolute top-6 left-6"><Logo /></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md"
        >
          <div className="relative glass-strong rounded-2xl p-8 conic-border">
            <div className="space-y-1.5 mb-7">
              <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-400">Welcome back, Champion</div>
              <h2 className="font-display text-3xl font-bold text-white">Sign in to <span className="gradient-text-cyber">KIME</span></h2>
              <p className="text-sm text-white/50">Your throne awaits.</p>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <Field icon={UserIcon} label="Email ID" type="email" placeholder="you@kimeedu.co.in"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <Field icon={Lock} label="Password" type={show ? 'text' : 'password'} placeholder="••••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                trailing={
                  <button type="button" onClick={() => setShow(v => !v)} className="text-white/50 hover:text-white">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                } />
              {error && (
                <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{error}</div>
              )}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/70 cursor-pointer group">
                  <span className="w-4 h-4 rounded border border-white/20 group-hover:border-fuchsia-400 bg-white/5 grid place-items-center">
                    <span className="w-2 h-2 rounded-sm bg-gradient-to-br from-fuchsia-400 to-blue-400 opacity-0 group-hover:opacity-100 transition" />
                  </span>
                  Remember me
                </label>
                <button type="button" onClick={goForgot} className="text-fuchsia-400 hover:text-fuchsia-300">Forgot password?</button>
              </div>
              <button type="submit" disabled={loading}
                className="btn-glow w-full py-3 rounded-xl font-display font-bold tracking-wider text-white bg-gradient-to-r from-fuchsia-600 via-violet-600 to-blue-600 hover:from-fuchsia-500 hover:to-blue-500 neon-border-purple transition shadow-lg shadow-violet-700/40 disabled:opacity-60">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? 'SIGNING IN…' : <>ENTER THE ARENA <ArrowRight size={18} /></>}
                </span>
              </button>
              <div className="text-center text-sm text-white/50 pt-2">
                <button type="button" onClick={goForgot} className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold">Forgot password? →</button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, label, type = 'text', placeholder, trailing, value, onChange }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-white/50 mb-1.5">{label}</label>
      <div className="relative group">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/0 to-blue-500/0 group-focus-within:from-fuchsia-500/40 group-focus-within:via-violet-500/40 group-focus-within:to-blue-500/40 blur-md transition" />
        <div className="relative flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 group-focus-within:border-fuchsia-400/60 px-3">
          {Icon && <Icon size={16} className="text-white/50" />}
          <input type={type} placeholder={placeholder} value={value} onChange={onChange}
            className="flex-1 bg-transparent outline-none py-3 text-sm text-white placeholder:text-white/30" />
          {trailing}
        </div>
      </div>
    </div>
  )
}

/* ------------- FORGOT PASSWORD ------------- */
function ForgotPasswordView({ onUpdated, goLogin }) {
  const [email, setEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required'); return
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match'); return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), oldPassword, newPassword, confirmPassword }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error || 'Update failed'); setLoading(false); return }
      setSuccess('Password updated! Redirecting to sign in…')
      setTimeout(() => onUpdated(), 1200)
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 bg-aurora overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="stars" />
      <Particles density={55} />
      <div className="absolute -left-24 top-1/4 w-80 h-80 rounded-full bg-fuchsia-600/25 blur-[110px]" />
      <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full bg-blue-600/25 blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative w-full max-w-md">
        <div className="flex justify-center mb-6"><Logo size={44} /></div>
        <div className="relative glass-strong rounded-2xl p-8 conic-border">
          <div className="mb-7 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-xs uppercase tracking-widest text-fuchsia-300 mb-3">
              <Lock size={12} /> Reset Access
            </div>
            <h2 className="font-display text-3xl font-bold text-white">Update your <span className="gradient-text-cyber">Password</span></h2>
            <p className="text-sm text-white/50 mt-1">Secure your throne with a new password.</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <Field icon={UserIcon} label="Email ID" type="email" placeholder="you@kimeedu.co.in"
              value={email} onChange={(e) => setEmail(e.target.value)} />
            <Field icon={Lock} label="Old Password" type="password" placeholder="••••••••••"
              value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
            <Field icon={Shield} label="New Password" type="password" placeholder="••••••••••"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Field icon={Shield} label="Confirm Password" type="password" placeholder="••••••••••"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {error && (
              <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-lg px-3 py-2">{error}</div>
            )}
            {success && (
              <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">{success}</div>
            )}
            <button type="submit" disabled={loading}
              className="btn-glow w-full py-3 rounded-xl font-display font-bold tracking-wider text-white bg-gradient-to-r from-fuchsia-600 via-violet-600 to-blue-600 hover:brightness-110 neon-border-purple transition disabled:opacity-60">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'UPDATING…' : <>UPDATE PASSWORD <ArrowRight size={16} /></>}
              </span>
            </button>
            <div className="text-center text-sm text-white/50 pt-2">
              <button type="button" onClick={goLogin} className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold inline-flex items-center gap-1">
                <ArrowLeft size={12} /> Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

/* ------------- DASHBOARD ------------- */
const roleConfig = {
  King:    { icon: Crown,  emoji: '👑', color: 'from-amber-400 to-orange-500',    glow: 'rgba(245,158,11,0.45)', txt: 'text-amber-300' },
  Prince:  { icon: Trophy, emoji: '🏆', color: 'from-fuchsia-500 to-violet-600',  glow: 'rgba(217,70,239,0.45)', txt: 'text-fuchsia-300' },
  Warrior: { icon: Swords, emoji: '⚔',  color: 'from-blue-500 to-indigo-600',     glow: 'rgba(59,130,246,0.45)', txt: 'text-blue-300' },
}

function DashboardView({ user, onLogout }) {
  const searchParams = useSearchParams()
  const [COUNSELLORS, setCounsellors] = useState([])
  const [period, setPeriod] = useState('Monthly')
  const [challengeLeaders, setChallengeLeaders] = useState({
  weekly: null,
  monthly: null,
  quarterly: null
  })
  const [lifetimeData, setLifetimeData] = useState(null)
  useEffect(() => {
    if (!user?.email) return

    loadLeaderboard()
    loadChallenges()
    loadLifetime()

    const interval = setInterval(() => {
      loadLeaderboard()
      loadChallenges()
      loadLifetime()
    }, 10000)

    return () => clearInterval(interval)
  }, [period, user?.email])

  const loadLeaderboard = async () => {
     try {
       const res = await fetch(`/api/leaderboard?period=${period}`)
       const data = await res.json()

       if (data.ok) {
        console.log("API DATA:", data.data)
        setCounsellors(data.data)
      }
     } catch (err) {
      console.log('Leaderboard fetch failed')
     }
  } 
  const loadChallenges = async () => {
   try {
    const [weeklyRes, monthlyRes, quarterlyRes] =
      await Promise.all([
        fetch('/api/leaderboard?period=Weekly'),
        fetch('/api/leaderboard?period=Monthly'),
        fetch('/api/leaderboard?period=Quarterly')
      ])

    const weekly = await weeklyRes.json()
    const monthly = await monthlyRes.json()
    const quarterly = await quarterlyRes.json()

    setChallengeLeaders({
      weekly: weekly.data || [],
      monthly: monthly.data || [],
      quarterly: quarterly.data || []
    })
  } catch (err) {
    console.log('Challenge fetch failed')
    }
  }
  const loadLifetime = async () => {
    try {
      if (!user?.email) return

      const res = await fetch(
        '/api/leaderboard?period=Lifetime'
      )

      const data = await res.json()

      if (data.ok && Array.isArray(data.data)) {

        const me = data.data.find(
          x =>
            x.email?.toLowerCase() ===
            user.email.toLowerCase()
        )

        if (me) {
          setLifetimeData(me)
          return
        }
      }

    // Fallback: use current leaderboard data
      const fallback = COUNSELLORS.find(
        x =>
          x.email?.toLowerCase() ===
          user.email.toLowerCase()
        )

      if (fallback) {
        setLifetimeData({
          ...fallback,
          lifetime: {
            admissions: fallback.admissions || 0,
            revenue: fallback.revenue || 0,
            points: fallback.points || 0
          }
        })
      }

    } catch (err) {
      console.error('Lifetime fetch failed:', err)

    // Fallback if API fails
      const fallback = COUNSELLORS.find(
        x =>
          x.email?.toLowerCase() ===
          user?.email?.toLowerCase()
      )

       if (fallback) {
         setLifetimeData({
          ...fallback,
          lifetime: {
            admissions: fallback.admissions || 0,
            revenue: fallback.revenue || 0,
            points: fallback.points || 0
          }
        })
     }
    }
   }
  
  const [branch, setBranch] = useState('All')
  const [lead, setLead] = useState('All')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('leaderboard') // leaderboard | rewards | challenges
  const [selectedCounselor, setSelectedCounselor] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [category, setCategory] = useState(null) // null | 'King' | 'Prince' | 'Warrior'
  const [snapUser, setSnapUser] = useState(null) // user object for snapshot modal
  const [time, setTime] = useState({ d: 10, h: 3, m: 28, s: 42 })

  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { d, h, m, s } = prev
        s--; if (s < 0) { s = 59; m--; if (m < 0) { m = 59; h--; if (h < 0) { h = 23; d--; if (d < 0) d = 0 } } }
        return { d, h, m, s }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [])

  // Confetti for top rank
  useEffect(() => {
    const blast = () => {
      confetti({
        particleCount: 120, spread: 80, origin: { y: 0.25 },
        colors: ['#a855f7', '#3b82f6', '#eab308', '#ec4899', '#ffffff']
      })
    }
    const t1 = setTimeout(blast, 600)
    const interval = setInterval(blast, 14000)
    return () => { clearTimeout(t1); clearInterval(interval) }
  }, [])

  const filtered = useMemo(() =>
    COUNSELLORS
      .filter(c => branch === 'All' || c.branch === branch)
      .filter(c => lead === 'All' || c.lead === lead)
      .filter(c => !category || c.role === category)
      .filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  , [COUNSELLORS, branch, lead, search, category])

  const sorted = useMemo(() => {
    return [...filtered]
      .map(c => ({
        ...c,
        displayPoints: c.points || 0,
          
      }))
      .sort((a, b) => b.displayPoints - a.displayPoints)
      .map((c, i) => ({ ...c, displayRank: i + 1 }))
   }, [filtered])
  const top3 = sorted.slice(0, 3)
  const rest = sorted.length > 3 ? sorted.slice(3) : sorted

  // Current logged-in user resolved from leaderboard data (so rank/points are accurate).
  // For Admin (Pratham), there is no leaderboard entry — fall back to the auth payload.
  const currentUser = useMemo(() => {

    if (user?.email) {

      const found = COUNSELLORS.find(
        c =>
          c.email &&
          c.email.toLowerCase() ===
          user.email.toLowerCase()
      )

      if (found) {
        return found
      }

    // Fallback for Admin / non-ranked user
      return {
        name: user.name || 'User',
        email: user.email,
        initials: (user.name || 'U')
          .split(/\s+/)
          .slice(0, 2)
          .map(s => s[0])
          .join('')
          .toUpperCase(),

        branch: user.branch || '—',
        lead: user.lead || '—',
        designation: user.designation || '—',

        role: user.role || 'Admin',
        isAdmin: !!user.isAdmin,

        rank: null,
        points: 0,
        revenue: 0,
        admissions: 0,
        streak: 0,
        winRate: 0,
        movement: 0
      }
    }

    return COUNSELLORS[0] || null

  }, [user, COUNSELLORS])
  const profileUser = selectedCounselor
    ? (profileData || selectedCounselor)
    : (lifetimeData || currentUser || {
        name: user?.name || 'User',
        email: user?.email || '',
        initials: (user?.name || 'U')
          .split(/\s+/)
          .slice(0, 2)
          .map(s => s[0])
          .join('')
          .toUpperCase(),
        branch: user?.branch || '—',
        lead: user?.lead || '—',
        designation: user?.designation || '—',
        role: user?.role || 'Warrior',
        rank: null,
        points: 0,
        revenue: 0,
        admissions: 0
      })
  const openCounselorProfile = async (counselor) => {

    if (!counselor?.email) return

    setSelectedCounselor(counselor)
    setProfileData(null)
    setProfileLoading(true)
    setTab('profile')

    try {

      const res = await fetch(
        `/api/profile?email=${encodeURIComponent(counselor.email)}`
      )

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Profile loading failed')
      }

      setProfileData(data.profile)

      } catch (error) {

       console.error('Profile loading failed:', error)

      } finally {

       setProfileLoading(false)

     }
   }
   useEffect(() => {

     if (!user?.email) return

     const profileEmail =
      searchParams.get('profileEmail')

     if (!profileEmail) return

     const section =
       searchParams.get('section')

     openCounselorProfile({
       email: profileEmail
     })

  }, [user?.email, searchParams])
   const openMyProfile = async () => {

     if (!user?.email) {
      console.error('Logged-in user email not found')
      return
     }

  // Clear previously opened counselor
     setSelectedCounselor(null)
     setProfileData(null)

  // Show loading state
     setProfileLoading(true)

  // Open profile tab
     setTab('profile')

     try {

       const res = await fetch(
         `/api/profile?email=${encodeURIComponent(user.email)}`
       )

       const data = await res.json()

       if (!res.ok || !data.ok) {
         throw new Error(
          data.error || 'Unable to load your profile'
        )
       }

    // Load logged-in user's profile
       setProfileData(data.profile)

      } catch (error) {

        console.error(
          'My profile loading failed:',
           error
        )

      } finally {

        setProfileLoading(false)

      }
    }


  const isAdmin = !!(currentUser && currentUser.isAdmin)

  const roleCounts = useMemo(() => {
    const counts = { King: 0, Prince: 0, Warrior: 0 }

    COUNSELLORS.forEach(c => {
      if (c.role === "King") counts.King++
      else if (c.role === "Prince") counts.Prince++
      else if (c.role === "Warrior") counts.Warrior++
    })

    return counts
  }, [COUNSELLORS])  

  return (
    <div className="min-h-screen bg-aurora relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40 pointer-events-none" />
      <div className="stars opacity-70" />
      <div className="absolute -left-40 top-10 w-[480px] h-[480px] rounded-full bg-fuchsia-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute right-0 top-40 w-[520px] h-[520px] rounded-full bg-blue-600/20 blur-[140px] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-20 sticky top-0 backdrop-blur-xl bg-[#05050f]/70 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
          <Logo />
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
              { id: 'worldcup', label: 'World Cup 26', icon: Trophy },
              { id: 'challenges', label: 'Challenges', icon: Target },
              { id: 'rewards', label: 'Rewards', icon: Gift },
              
            ].map(n => {
              const active = tab === n.id
              return (
                <button 
                  key={n.id} 
                  onClick={() => {
                    if (n.id === 'worldcup') {
                      window.open(
                       'https://kimeedu.co.in/worldcupsales',
                       '_blank'
                      )
                      return
                     }
                    setTab(n.id)}
                  }
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${active ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                  {active && (
                    <motion.span layoutId="navpill" className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-600/70 to-blue-600/70 neon-border-purple" />
                  )}
                  <n.icon size={14} className="relative" /> <span className="relative">{n.label}</span>
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <button onClick={() => setSnapUser(currentUser)}
                className="relative hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-600/80 to-blue-600/80 hover:brightness-110 text-white text-xs font-semibold tracking-wide neon-border-purple transition btn-glow">
                <span className="relative z-10 flex items-center gap-1.5"><Camera size={14} /> Snapshot</span>
              </button>
            )}
             <NotificationBell
               currentUser={currentUser}
             />
            <button
              onClick={openMyProfile}
              className="hidden sm:flex items-center gap-2 glass rounded-full pl-1 pr-3 py-1 hover:scale-105 transition-all cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-full grid place-items-center font-display font-bold text-xs ${
                isAdmin
                  ? 'bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-[#05050f]'
                  : 'bg-gradient-to-br from-fuchsia-500 via-violet-500 to-blue-500 text-white'
              }`}>
                {currentUser.initials}
              </div>
              <div className="text-xs leading-tight">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  {currentUser.name}
                  {isAdmin && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-400 to-orange-500 text-[#05050f] shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                      <Shield size={8} /> Admin
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-white/50">
                  {isAdmin ? 'System Administrator' : `Rank #${currentUser.rank} · ${currentUser.role}`}
                </div>
              </div>
            </button>
            <button onClick={onLogout} className="p-2 rounded-xl glass hover:bg-white/10" title="Logout">
              <LogOut size={16} className="text-white/70" />
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-8 space-y-10">
        {/* HERO HEADER */}
        <section className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-[11px] uppercase tracking-[0.3em] text-fuchsia-300 mb-3">
              <Flame size={12} /> Month 05 · {period}
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-black leading-tight">
              The <span className="gradient-text-cyber">KIME</span> Podium
            </h1>
            <p className="text-white/50 mt-2">Only the fiercest close the deal. Claim your crown. 👑</p>
          </div>
          <CountdownCard time={time} />
        </section>

        {/* TOP 3 PODIUM */}
        <AnimatePresence mode="wait">

          {(tab === 'leaderboard' || tab === 'home' || tab === 'counsellors') && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >

      
              <Podium
                top3={top3}
                onSnap={setSnapUser}
                onProfile={openCounselorProfile}
              />

      {/* PERIOD TABS */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex p-1 rounded-full glass border border-white/10">
                  {['Weekly', 'Monthly', 'Quarterly'].map(p => (
                   <button
                     key={p}
                     onClick={() => setPeriod(p)}
                     className={`relative px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition ${
                     period === p
                       ? 'text-white'
                       : 'text-white/50 hover:text-white/80'
                     }`}
                    >
                     {period === p && (
                       <motion.span
                         layoutId="periodpill"
                         className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-600 to-blue-600 neon-border-purple"
                       />
                     )}
                     <span className="relative">{p}</span>
                   </button>
                  ))}
               </div>

               <div className="flex items-center gap-2 text-xs text-white/50">
                 <TrendingUp size={14} className="text-emerald-400" />
                 <span>Leaderboard updates every 60 seconds</span>
               </div>
             </div>

      {/* ROLE STATS */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
               { role: 'King', desc: 'Reigning closers (>6 mo tenure)' },
               { role: 'Prince', desc: 'Royal risers (>3-6 mo tenure)' },
               { role: 'Warrior', desc: 'Battle ready (0-3 mo tenure)' },
              ].map((s, i) => (
                <RoleCard
                  key={s.role}
                  {...s}
                  count={roleCounts[s.role] || 0}
                  i={i}
                  active={category === s.role}
                  onClick={() =>
                  setCategory(category === s.role ? null : s.role)
                }
              />
            ))}
           </section>

      {/* FILTERS */}
           <section className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-widest">
                <Filter size={14} /> Filters
              </div>

              <Dropdown
                label="Branch"
                value={branch}
                onChange={setBranch}
                options={BRANCHES}
              />

              <Dropdown
                label="Team Lead"
                value={lead}
                onChange={setLead}
                options={TEAM_LEADS}
              />

              <div className="flex-1 min-w-[220px] flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <Search size={14} className="text-white/50" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search counsellor..."
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
           </section>

           <LeaderboardTable
             rows={rest}
             onSnap={setSnapUser}
             onProfile={openCounselorProfile}
           />

         </motion.div>
        )}

        {tab === 'challenges' && (
          <motion.div
            key="ch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
           <ChallengesSection
             leaders={challengeLeaders}
             currentUser={currentUser}
           />
         </motion.div>
        )}

        {tab === 'rewards' && (
          <motion.div
            key="rw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
         >
            <RewardsSection />
          </motion.div>
        )}

        {tab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
          >

          {profileLoading && (
           <div className="glass-strong rounded-2xl p-10 text-center">
             <div className="text-fuchsia-300 text-sm font-semibold">
               Loading profile...
             </div>

             <div className="text-white/40 text-xs mt-2">
               Fetching counsellor achievements and lifetime performance
             </div>
           </div>
          )}

          {!profileLoading && profileData && (
            <ProfileSection
              currentUser={profileUser}
              lifetimeData={profileData}
              setTab={setTab}
            />
          )}

          {!profileLoading && !profileData && selectedCounselor && (
            <div className="glass-strong rounded-2xl p-10 text-center">
              <div className="text-rose-300 text-sm font-semibold">
                Unable to load profile
              </div>

              <button
                onClick={() => setTab('leaderboard')}
                className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm"
              >
                Back to Leaderboard
              </button>
           </div>
           )}

       </motion.div>
     )}

      </AnimatePresence>

        <footer className="py-10 text-center text-xs text-white/40">
          <div className="inline-flex items-center gap-2"><Sparkles size={12} /> Kime Careers · Built for champions · 2025</div>
        </footer>
      </main>

      <SnapshotModal user={snapUser} onClose={() => setSnapUser(null)} />
    </div>
  )
}


/* ------------- DASHBOARD COMPONENTS ------------- */
function CountdownCard() {
  const [time, setTime] = useState({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  })

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()

      // Next month 1st date at 12:00 AM
      const nextReset = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1,
        0,
        0,
        0,
        0
      )

      const diff = nextReset - now

      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / (1000 * 60)) % 60)
      const s = Math.floor((diff / 1000) % 60)

      setTime({ d, h, m, s })
    }

    updateCountdown()

    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const box = (v, l) => (
    <div className="text-center min-w-[52px]">
      <div className="font-display text-3xl font-black gradient-text-gold tabular-nums">
        {String(v).padStart(2, "0")}
      </div>
      <div className="text-[9px] uppercase tracking-[0.25em] text-white/50 mt-0.5">
        {l}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative glass-strong rounded-2xl px-6 py-4 neon-border-gold min-w-[320px]"
    >
      <div className="flex items-center gap-2 mb-2">
        <Calendar size={14} className="text-amber-400" />
        <div className="text-[10px] uppercase tracking-[0.3em] text-amber-300">
          Monthly Reset In
        </div>
      </div>

      <div className="flex items-center gap-4">
        {box(time.d, "Days")}
        <div className="text-amber-400/40 font-display text-2xl">:</div>

        {box(time.h, "Hours")}
        <div className="text-amber-400/40 font-display text-2xl">:</div>

        {box(time.m, "Mins")}
        <div className="text-amber-400/40 font-display text-2xl">:</div>

        {box(time.s, "Secs")}
      </div>
    </motion.div>
  )
}

function Podium({ top3, onSnap, onProfile }) {
  if (top3.length < 3) return null
  const [p2, p1, p3] = [top3[1], top3[0], top3[2]]
  return (
    <section className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
        <PodiumCard
           user={p2}
           rank={2}
           onSnap={onSnap}
           onProfile={onProfile}
         />

        <PodiumCard
           user={p1}
           rank={1}
           onSnap={onSnap}
           onProfile={onProfile}
         />

        <PodiumCard
          user={p3}
          rank={3}
          onSnap={onSnap}
          onProfile={onProfile}
        />
      </div>
    </section>
  )
}

function PodiumCard({ user, rank, onSnap, onProfile }) {
  const cfg = {
    1: { border: 'neon-border-gold', grad: 'from-amber-400 via-yellow-300 to-orange-500', icon: Crown, label: 'Champion', txt: 'gradient-text-gold', scale: 'md:scale-110 md:-translate-y-4', order: 'md:order-2' },
    2: { border: 'neon-border-silver', grad: 'from-slate-200 via-slate-300 to-slate-500', icon: Medal, label: '2nd Place', txt: 'text-slate-200', scale: '', order: 'md:order-1' },
    3: { border: 'neon-border-bronze', grad: 'from-orange-500 via-amber-600 to-rose-600', icon: Medal, label: '3rd Place', txt: 'text-orange-300', scale: '', order: 'md:order-3' },
  }[rank]
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank === 1 ? 0.2 : 0.35, type: 'spring', stiffness: 80 }}
      className={`relative ${cfg.order} ${cfg.scale} ${rank === 1 ? 'animate-floaty' : 'animate-floaty-delay'}`}
    >
      <div className={`relative glass-strong rounded-2xl p-6 ${cfg.border} transition-all hover:scale-[1.02] overflow-visible`}>
        {onSnap && (
          <button onClick={(e) => { e.stopPropagation(); onSnap(user) }}
            title="Snapshot"
            className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-white/5 hover:bg-fuchsia-500/30 border border-white/10 hover:border-fuchsia-400/60 transition">
            <Camera size={14} className="text-white/70" />
          </button>
        )}
        {rank === 1 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="absolute -top-7 left-1/2 -translate-x-1/2 z-10"
          >
            <div className="relative animate-pulse-glow">
              <Crown size={44} className="text-amber-300 fill-amber-400/60" strokeWidth={1.5} />
            </div>
          </motion.div>
        )}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Avatar */}
          <div className="relative">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${cfg.grad} grid place-items-center font-display text-2xl font-black text-[#05050f] shadow-xl`}>
              {user.initials}
            </div>
            <div
              className={`absolute ${
                rank === 1 ? '-bottom-3 z-20' : '-bottom-2'
              } left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black font-display text-xs font-bold shadow-lg border border-white/10`}
              style={{
                 color: rank === 1 ? '#FFD700' : '#ffffff'
              }}
            >
              #{rank}
            </div>
          </div>
          <div className="pt-1">
            <div className={`text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-1 ${cfg.txt}`}>
              <Icon size={12} /> {cfg.label}
            </div>
            <div className="font-display font-bold text-xl text-white mt-1">{user.name}</div>
            <div className="text-xs text-white/50">{user.branch} · Led by {user.lead}</div>
          </div>
          <div className="grid grid-cols-3 gap-3 w-full pt-3 border-t border-white/10">
            <Stat label="Points" value={user.displayPoints || 0} format="compact" accent={cfg.txt} />
            <Stat label="Revenue" value={user.revenue} format="money" accent={cfg.txt} />
            <Stat label="Adms" value={user.admissions} accent={cfg.txt} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function Stat({ label, value, format, accent = 'text-white' }) {
  return (
    <div className="text-center">
      <div className={`font-display font-bold text-lg ${accent}`}>
        <Counter to={value} format={format} />
      </div>
      <div className="text-[9px] uppercase tracking-widest text-white/40 mt-0.5">{label}</div>
    </div>
  )
}

function RoleCard({ role, desc, count, i, active, onClick }) {
  const cfg = roleConfig[role]
  const Icon = cfg.icon
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group text-left"
    >
      <div className={`glass-strong rounded-2xl p-5 border overflow-hidden relative transition ${active ? 'border-white/40 ring-2 ring-fuchsia-400/50' : 'border-white/10'}`}
        style={{ boxShadow: `0 10px 40px -15px ${cfg.glow}${active ? ', 0 0 30px ' + cfg.glow : ''}` }}>
        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${cfg.color} ${active ? 'opacity-70' : 'opacity-30'} blur-2xl group-hover:opacity-60 transition`} />
        <div className="flex items-start justify-between relative">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.color} grid place-items-center shadow-lg text-2xl`}>
            <span>{cfg.emoji}</span>
          </div>
          <div className={`text-[10px] px-2 py-0.5 rounded-full border border-white/10 ${cfg.txt} bg-white/5`}>{active ? 'ACTIVE' : 'TIER'}</div>
        </div>
        <div className="mt-4">
          <div className={`font-display font-bold text-2xl ${cfg.txt}`}><Counter to={count} /></div>
          <div className="font-display font-semibold text-white mt-0.5">{role}</div>
          <div className="text-xs text-white/50">{desc}</div>
        </div>
      </div>
    </motion.button>
  )
}

function Dropdown({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false)
  const [openUp, setOpenUp] = useState(false)
  const triggerRef = useRef(null)

  // Decide whether to open upward when there isn't enough space below.
  const handleToggle = () => {
    setOpen(prev => !prev)
    setOpenUp(true) // Always open upward
  }
  return (
    <div className="relative">
      <button ref={triggerRef} onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15 hover:border-fuchsia-400/60 text-sm transition shadow-inner shadow-black/30">
        <span className="text-white/60 text-xs uppercase tracking-wider">{label}:</span>
        <span className="font-semibold text-white">{value}</span>
        <ChevronDown size={14} className={`text-white/70 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 mb-2 z-[9999] min-w-[220px] rounded-xl p-1.5 border border-white/15 shadow-2xl shadow-black/70 max-h-[280px] overflow-y-auto"
              style={{
                background:
                 "linear-gradient(180deg, rgba(15,12,32,0.98), rgba(8,8,18,0.98))",
                backdropFilter: "blur(16px)"
              }}
            >
              {options.map(opt => (
                <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between gap-2 ${
                    value === opt
                      ? 'bg-gradient-to-r from-fuchsia-500/30 to-blue-500/20 text-white font-semibold border border-fuchsia-400/40'
                      : 'text-white/85 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}>
                  <span>{opt}</span>
                  {value === opt && <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function MovementArrow({ m }) {
  if (m === 0) return <div className="flex items-center gap-0.5 text-white/40 text-xs"><Minus size={12} /> <span className="tabular-nums">0</span></div>
  if (m > 0) return <div className="flex items-center gap-0.5 text-emerald-400 text-xs font-semibold"><ChevronUp size={14} /> <span className="tabular-nums">{m}</span></div>
  return <div className="flex items-center gap-0.5 text-rose-400 text-xs font-semibold"><ChevronDown size={14} /> <span className="tabular-nums">{Math.abs(m)}</span></div>
}

function RoleBadge({ role }) {
  const cfg = roleConfig[role] || roleConfig.Warrior
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${cfg.color} text-white`}>
      <Icon size={10} /> {role}
    </span>
  )
}

function LeaderboardTable({ rows, onSnap, onProfile }) {
  const max = Math.max(...rows.map(r => r.displayPoints), 1)
  return (
    <div className="glass-strong rounded-2xl border border-white/10 overflow-hidden">
      <div className="grid grid-cols-[70px_1fr_110px_110px_100px_130px_120px_60px] gap-3 px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white/50 bg-white/5 border-b border-white/10">
        <div>Rank</div><div>Counsellor</div><div>Branch</div><div>Team Lead</div>
        <div className="text-right">Admissions</div><div className="text-right">Revenue</div><div className="text-right">Points</div>
        <div className="text-center">Snap</div>
      </div>
      <div className="divide-y divide-white/5">
        {rows.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}
            className="row-hover grid grid-cols-[70px_1fr_110px_110px_100px_130px_120px_60px] gap-3 px-5 py-4 items-center text-sm transition-all">
            <div className="flex items-center gap-2">
              <div className="font-display font-black text-lg text-white/80 w-8">##{i + 4}</div>
              <MovementArrow m={c.movement} />
            </div>
            <button
              type="button"
              onClick={() => onProfile(c)}
              className="flex items-center gap-3 min-w-0 text-left group"
              title={`View ${c.name}'s profile`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-blue-500 grid place-items-center font-display font-bold text-xs text-white shrink-0">
                {c.initials}
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white truncate flex items-center gap-2">
                  {c.name}
                  {c.streak >= 7 && <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-300"><Flame size={10} /> {c.streak}</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <RoleBadge role={c.role} />
                  <span className="text-[10px] text-white/40">Win {c.winRate}%</span>
                </div>
              </div>
            </button>
            <div className="text-white/70 text-xs">{c.branch}</div>
            <div className="text-white/70 text-xs">{c.lead}</div>
            <div className="text-right font-display font-semibold tabular-nums text-white">{c.admissions}</div>
            <div className="text-right font-display font-semibold tabular-nums text-emerald-300">₹{(c.revenue / 100000).toFixed(1)}L</div>
            <div className="text-right">
              <div className="font-display font-bold tabular-nums gradient-text-cyber">{c.displayPoints.toLocaleString()}</div>
              <div className="mt-1 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(c.displayPoints / max) * 100}%` }} transition={{ delay: 0.1 + i * 0.02, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-fuchsia-500 via-violet-500 to-blue-500" />
              </div>
            </div>
            <div className="flex justify-center">
              <button onClick={() => onSnap(c)} title="Snapshot"
                className="p-2 rounded-lg bg-white/5 hover:bg-fuchsia-500/20 border border-white/10 hover:border-fuchsia-400/60 transition">
                <Camera size={14} className="text-white/70 hover:text-fuchsia-300" />
              </button>
            </div>
          </motion.div>
        ))}
        {rows.length === 0 && <div className="px-5 py-12 text-center text-white/40 text-sm">No warriors match your filters.</div>}
      </div>
    </div>
  )
}

function RewardsSection() {
  const contest = {
    title: '20 Admissions Challenge',
    benchmark: 20,
    prizeValue: '₹50,000',
    winner: 'Suwarnaprabha Dive',

    rewards: [
      {
        name: 'PlayStation 5',
        image: '/rewards/ps5.png',
        description: 'Gaming Console'
      },
      {
        name: 'Dyson Airwrap',
        image: '/rewards/dyson.png',
        description: 'Premium Hair Styler'
      }
    ]
  }

  return (
    <div className="space-y-5">

      
      {/* SECTION HEADER */}
      

      <SectionHeader
        icon={Gift}
        title="Rewards & Glory"
        subtitle="Previous contest · Winner announced"
      />


      
      {/* CONTEST CARD */}
     

      <div className="
        relative
        mx-auto
        w-full
        max-w-5xl
        overflow-hidden
        rounded-3xl
         border
        border-yellow-500/20
        bg-[#080a16]
        shadow-[0_20px_70px_-35px_rgba(250,204,21,0.25)]
      ">


        
        {/* BLURRED OLD CONTEST CONTENT */}
        

        <div
          className="
            blur-[3px]
            opacity-55
            pointer-events-none
            select-none
          "
        >

          <div className="p-5 md:p-6">


            {/* Contest Header */}

            <div className="
              flex
              items-center
              justify-between
              gap-4
              mb-4
            ">

              <div className="flex items-center gap-4">

                <div className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-yellow-400
                  to-orange-500
                  flex
                  items-center
                  justify-center
                ">

                  <Trophy
                    size={25}
                    className="text-black"
                  />

                </div>


                <div>

                  <div className="
                    text-[10px]
                    uppercase
                    tracking-[0.3em]
                    text-yellow-300
                    font-black
                  ">
                    Previous Contest
                  </div>

                  <h2 className="
                    text-2xl
                    md:text-3xl
                    font-black
                    text-white
                    mt-1
                  ">
                    {contest.title}
                  </h2>

                </div>

              </div>


              <div className="
                px-4
                py-2
                rounded-full
                bg-yellow-400/10
                border
                border-yellow-400/20
                text-yellow-300
                text-xs
                font-black
              ">
                COMPLETED
              </div>

            </div>


            {/* Benchmark */}

            <div className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              p-5
              mb-4
            ">

              <div className="
                text-[10px]
                uppercase
                tracking-[0.25em]
                text-white/40
                font-black
              ">
                Contest Benchmark
              </div>

              <div className="
                text-3xl
                font-black
                text-white
                mt-2
              ">
                {contest.benchmark} Admissions
              </div>

              <div className="
                text-sm
                text-white/40
                mt-1
              ">
                Reach the admission target and unlock the premium reward.
              </div>

            </div>


            {/* Reward Heading */}

            <div className="text-center mb-4">

              <div className="
                text-[10px]
                uppercase
                tracking-[0.35em]
                text-white/40
                font-black
              ">
                Choose Your Reward
              </div>

              <div className="
                text-3xl
                md:text-4xl
                font-black
                text-yellow-300
                mt-2
              ">
                WORTH {contest.prizeValue}
              </div>

            </div>


            {/* Rewards */}

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">

              {contest.rewards.map((reward) => (

                <div
                  key={reward.name}
                  className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-5
                  "
                >

                  <div className="
                    h-[150px]
                    flex
                    items-center
                    justify-center
                  ">

                    <img
                      src={reward.image}
                      alt={reward.name}
                      className="
                        max-h-[130px]
                        max-w-full
                        object-contain
                      "
                    />

                  </div>


                  <div className="text-center mt-3">

                    <h3 className="
                      text-xl
                      font-black
                      text-white
                    ">
                      {reward.name}
                    </h3>

                    <p className="
                      text-sm
                      text-white/40
                      mt-1
                    ">
                      {reward.description}
                    </p>

                  </div>

                </div>

              ))}
            
            </div>



            {/* Old CTA */}

            <div className="
              mt-4
              text-center
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              p-4
            ">

              <div className="
                text-sm
                font-bold
                text-white
              ">
                Complete the challenge to claim your reward
              </div>

            </div>

          </div>

        </div>


        
        {/* CONTEST OVER OVERLAY */}
        

        <div className="
          absolute
          inset-0
          z-30
          flex
          items-center
          justify-center
          p-5
        ">

          <div className="
            w-full
            max-w-md
            text-center
          ">


            {/* Contest Over Badge */}

            <div className="
              inline-flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-full
              bg-black/75
              border
              border-red-400/40
              backdrop-blur-xl
              shadow-[0_0_35px_rgba(239,68,68,0.18)]
            ">

              <span className="
                w-2.5
                h-2.5
                rounded-full
                bg-red-400
                shadow-[0_0_12px_rgba(248,113,113,0.9)]
              " />

              <span className="
                text-xs
                uppercase
                tracking-[0.3em]
                font-black
                text-red-300
              ">
                Contest Over
              </span>

            </div>


            {/* Winner Card */}

            <div className="
              mt-5
              rounded-3xl
              border
              border-yellow-400/25
              bg-black/75
              backdrop-blur-xl
              px-7
              py-6
              shadow-[0_0_50px_rgba(250,204,21,0.12)]
            ">

              <div className="
                flex
                justify-center
                mb-3
              ">

                <div className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-gradient-to-br
                  from-yellow-300
                  via-amber-400
                  to-orange-500
                  flex
                  items-center
                  justify-center
                  shadow-[0_0_25px_rgba(250,204,21,0.3)]
                ">

                  <Crown
                    size={25}
                    className="text-black"
                  />

                </div>

              </div>


              <div className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-yellow-300/70
                font-black
              ">
                Grand Winner
              </div>


              <h2 className="
                text-2xl
                md:text-3xl
                font-black
                text-white
                mt-2
              ">
                {contest.winner}
              </h2>


              <p className="
                text-sm
                text-white/50
                mt-2
              ">
                Winner of the {contest.title}
              </p>


              {/* Prize */}

              <div className="
                mt-5
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                bg-yellow-400/10
                border
                border-yellow-400/20
              ">

                <Trophy
                  size={15}
                  className="text-yellow-300"
                />

                <span className="
                  text-sm
                  font-black
                  text-yellow-300
                ">
                  {contest.prizeValue}
                </span>

              </div>

            </div>


            {/* Bottom message */}

            <div className="
              mt-4
              text-[9px]
              uppercase
              tracking-[0.2em]
              text-white/35
              font-bold
            ">
              Winner reward awarded · New challenge coming soon
            </div>

          </div>

        </div>


        
        {/* SUBTLE DARK OVERLAY */}
        

        <div className="
          absolute
          inset-0
          z-10
          bg-black/10
          pointer-events-none
        " />


        {/* Bottom Gold Line */}

        <div className="
          absolute
          bottom-0
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-yellow-400/50
          to-transparent
          z-40
        " />

      </div>


      
      {/* NEW CONTEST MESSAGE */}
      

      <div className="text-center">

        <p className="
          text-[9px]
          uppercase
          tracking-[0.2em]
          text-white/25
          font-bold
        ">
          New rewards and challenges will be announced soon
        </p>

      </div>

    </div>
  )
}
function ChallengesSection({ leaders, currentUser }) {

  
  const monthlyLeader = leaders?.monthly?.[0]
  const quarterlyLeader = leaders?.quarterly?.[0]

  const weeklyCategory = [...(leaders?.weekly || [])]
   .filter(
     c =>
       c.role?.toLowerCase() ===
       currentUser?.role?.toLowerCase()
    )
   .sort((a, b) => b.points - a.points)

  const weeklyLeader = weeklyCategory[0]

  const weeklyUser = weeklyCategory.find(
    c =>
     c.email?.toLowerCase() ===
     currentUser?.email?.toLowerCase()
  )

// Category Rank
  const weeklyRank =
    weeklyCategory.findIndex(
      c =>
       c.email?.toLowerCase() ===
       currentUser?.email?.toLowerCase()
    ) + 1

  const monthlyUser = leaders?.monthly?.find(
    c =>
      c.email?.toLowerCase() ===
      currentUser?.email?.toLowerCase()
  )

  const quarterlyUser = leaders?.quarterly?.find(
    c =>
      c.email?.toLowerCase() ===
      currentUser?.email?.toLowerCase()
  )

  const cards = [
    {
      title: "🚀 Podium Rush",
      leader: weeklyLeader,
      user: weeklyUser,
      rank: weeklyRank,
      period: "Weekly"
    },
    {
      title: "👑 Podium Topper",
      leader: monthlyLeader,
      user: monthlyUser,
      rank: monthlyUser?.rank,
      period: "Monthly"
    },
    {
      title: "🏆 Ballon d'Or",
      leader: quarterlyLeader,
      user: quarterlyUser,
      rank: quarterlyUser?.rank,
      period: "Quarterly"
    }
  ]

  return (
    <div>
      <SectionHeader
        icon={Target}
        title="Active Challenges"
        subtitle="Beat the current leaders and claim glory"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {cards.map((card, i) => {

          if (!card.leader) return null

          const needed =
            Math.max(
              0,
              (card.leader?.points || 0) -
              (card.user?.points || 0)
            )

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-6 border border-white/10 neon-border-purple"
            >

              <div className="text-xs uppercase tracking-widest text-fuchsia-300">
                {card.period}

                {card.period === "Weekly" && (
                  <span className="text-white/40">
                     {" • "}
                     {currentUser.role}
                   </span>
                 )}
               </div>

              <h3 className="font-display text-xl font-bold text-white mt-2">
                {card.title}
              </h3>

              <div className="mt-5">
                <div className="text-white/50 text-xs">
                  Current Leader
                </div>

                <div className="text-lg font-bold text-white">
                  {card.leader.name}
                </div>

                <div className="gradient-text-gold font-display text-2xl font-black">
                  {card.leader.points}
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">

                <div className="text-xs text-white/50">
                  Your Rank
                </div>

                <div className="text-xl font-bold text-white">
                  #{card.rank || "-"}
                </div>

                <div className="mt-3 text-xs text-white/50">
                  Need
                </div>

                <div className="text-lg font-bold text-emerald-400">
                  {needed} Points
                </div>

                <div className="text-xs text-white/50">
                  to become #1
                </div>

              </div>

            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-blue-500 grid place-items-center">
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <h2 className="font-display font-bold text-xl text-white">
          {title}
        </h2>
        <p className="text-xs text-white/50">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
/* ------------- SNAPSHOT MODAL (PUBG-STYLE) ------------- */
function SnapshotModal({ user, onClose }) {
  const cardRef = useRef(null)
  const [downloading, setDownloading] = useState(false)

  if (!user) return null
  const cfg = roleConfig[user.role] || roleConfig.Warrior

  const handleDownload = async (story = false) => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: window.matchMedia('(min-width: 768px)').matches ? 4 : 3,
        backgroundColor: '#05050f',
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = `kime-${user.name.replace(/\s+/g,'-').toLowerCase()}-snapshot${story ? '-story' : ''}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  const handleWhatsApp = async () => {
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        pixelRatio: window.matchMedia('(min-width: 768px)').matches ? 4 : 3,
        backgroundColor: '#05050f',
      })
      const link = document.createElement('a')
      link.download = `kime-${user.name.replace(/\s+/g,'-').toLowerCase()}-snapshot.png`
      link.href = dataUrl
      link.click()
    } catch(e) { console.error(e) }
    const text = encodeURIComponent(`Check out my rank on KIME Careers Leaderboard!\n\n${user.name} - Rank #${user.rank} - ${user.role}\n${user.displayPoints.toLocaleString()} Points | ${(user.revenue/100000).toFixed(1)}L Revenue | ${user.admissions} Admissions`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <AnimatePresence>
      <motion.div
        key="snap-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="relative w-full max-w-md md:max-w-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose}
            className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/20 text-white transition z-10">
            <X size={18} />
          </button>

          {/* Share Card — 9:16 on mobile, 4:5 on desktop for better readability */}
          <div ref={cardRef} className="relative rounded-3xl overflow-hidden aspect-[9/16] md:aspect-[4/5]"
            style={{
              background: 'radial-gradient(ellipse at top, rgba(168,85,247,0.35), transparent 60%), radial-gradient(ellipse at bottom, rgba(59,130,246,0.35), transparent 60%), #05050f',
              boxShadow: `0 0 60px ${cfg.glow}, 0 0 120px rgba(168,85,247,0.3)`,
            }}
          >
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: 'linear-gradient(rgba(139,92,246,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.08) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />
            <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[80px] opacity-70"
              style={{ background: `radial-gradient(circle, ${cfg.glow}, transparent 70%)` }} />
            <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full blur-[90px] opacity-60"
              style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.6), transparent 70%)' }} />

            <div className="relative h-full flex flex-col p-7 md:p-9 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-white/90 p-1 overflow-hidden ring-1 ring-white/40 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <img src="https://customer-assets.emergentagent.com/job_neon-ranks/artifacts/78ze56i0_kime-logo.jpg"
                      alt="Kime" className="w-full h-full object-contain" style={{ mixBlendMode: 'multiply' }} />
                  </div>
                  <div className="leading-tight">
                    <div className="font-display font-black tracking-widest text-sm md:text-lg gradient-text-cyber">KIME</div>
                    <div className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-white/50">Careers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-amber-300">Season 07</div>
                  <div className="text-[10px] md:text-xs text-white/60">{new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
                </div>
              </div>

              <div className="mt-4 md:mt-5 flex justify-center">
                <div className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.25em] bg-gradient-to-r ${cfg.color} text-white shadow-lg`}>
                  <span className="text-base md:text-lg leading-none">{cfg.emoji}</span> {user.role}
                </div>
              </div>

              <div className="mt-6 md:mt-7 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-70"
                    style={{ background: `radial-gradient(circle, ${cfg.glow}, transparent)` }} />
                  <div className={`relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br ${cfg.color} grid place-items-center font-display text-4xl md:text-5xl font-black text-[#05050f] shadow-2xl ring-4 ring-white/20`}>
                    {user.initials}
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 md:px-4 py-0.5 md:py-1 rounded-full bg-[#05050f] border border-white/20 font-display text-xs md:text-sm font-bold text-white whitespace-nowrap">
                    RANK #{user.rank}
                  </div>
                </div>
                <div className="mt-6 md:mt-7 font-display font-black text-2xl md:text-3xl text-white text-center leading-tight">{user.name}</div>
                <div className="text-xs md:text-sm text-white/60">{user.branch} · Led by {user.lead}</div>
              </div>

              <div className="mt-6 md:mt-7 grid grid-cols-3 gap-2 md:gap-3">
                {[
                  { label: 'Points',     value: user.displayPoints.toLocaleString(), color: 'gradient-text-cyber' },
                  { label: 'Revenue',    value: `₹${(user.revenue/100000).toFixed(1)}L`, color: 'gradient-text-gold' },
                  { label: 'Admissions', value: user.admissions, color: 'text-white' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-3 md:p-4 text-center">
                    <div className={`font-display font-black text-lg md:text-2xl ${s.color}`}>{s.value}</div>
                    <div className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-white/50 mt-0.5 md:mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 md:mt-5 flex items-center justify-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1 px-2 md:px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  <TrendingUp size={10} /> Win {user.winRate}%
                </div>
                {user.streak >= 3 && (
                  <div className="inline-flex items-center gap-1 px-2 md:px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-amber-300">
                    <Flame size={10} /> {user.streak} Streak
                  </div>
                )}
                <div className="inline-flex items-center gap-1 px-2 md:px-2.5 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/40 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-fuchsia-300">
                  <Trophy size={10} /> Top {Math.ceil((user.rank/Math.max(1, /* total ranked */ 35))*100)}%
                </div>
              </div>

              <div className="mt-auto pt-6 md:pt-8 text-center">
                <div className="font-display font-bold text-base md:text-xl gradient-text-cyber">COMPETE · CLIMB · CONQUER</div>
                <div className="text-[9px] md:text-[11px] uppercase tracking-[0.35em] text-white/40 mt-1">kime careers · leaderboard</div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button onClick={() => handleDownload(false)} disabled={downloading}
              className="btn-glow flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:brightness-110 text-white text-xs font-semibold tracking-wide neon-border-purple transition disabled:opacity-60">
              <span className="relative z-10 flex items-center gap-1.5"><Download size={14} /> Download</span>
            </button>
            <button onClick={handleWhatsApp}
              className="btn-glow flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 text-white text-xs font-semibold tracking-wide transition"
              style={{ boxShadow: '0 0 24px rgba(16,185,129,0.45)' }}>
              <span className="relative z-10 flex items-center gap-1.5"><Share2 size={14} /> WhatsApp</span>
            </button>
            <button onClick={() => handleDownload(true)} disabled={downloading}
              className="btn-glow flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-amber-500 hover:brightness-110 text-white text-xs font-semibold tracking-wide transition disabled:opacity-60"
              style={{ boxShadow: '0 0 24px rgba(236,72,153,0.5)' }}>
              <span className="relative z-10 flex items-center gap-1.5"><Instagram size={14} /> Story</span>
            </button>
          </div>
          <div className="mt-2 text-center text-[10px] text-white/40">Save to gallery then share to Instagram Stories</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}


/* ------------- ROOT ------------- */
function App() {
  const [view, setView] = useState('login') // 'login' | 'forgot' | 'dashboard'
  const [user, setUser] = useState(null)

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('kime_user') : null
      if (stored) {
        setUser(JSON.parse(stored))
        setView('dashboard')
      }
    } catch {}
  }, [])

  const handleLogin = (u) => { setUser(u); setView('dashboard') }
  const handleLogout = () => {
    try { localStorage.removeItem('kime_user'); localStorage.removeItem('kime_token') } catch {}
    setUser(null); setView('login')
  }

  return (
    <AnimatePresence mode="wait">
      {view === 'login' && (
        <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <LoginView onLogin={handleLogin} goForgot={() => setView('forgot')} />
        </motion.div>
      )}
      {view === 'forgot' && (
        <motion.div key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ForgotPasswordView onUpdated={() => setView('login')} goLogin={() => setView('login')} />
        </motion.div>
      )}
      {view === 'dashboard' && (
        <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <DashboardView user={user} onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default App

