// Leaderboard derives from real (non-admin) employees imported from Excel.
// Categories are auto-computed from joining date (or fallback tenure) on every render
// so as time passes employees automatically transition Warrior → Prince → King.
import { getRankedEmployees, categoryForEmployee, computeTenure, initialsOf } from './employees'

const RANKED = getRankedEmployees()

export const BRANCHES   = ['All', ...Array.from(new Set(RANKED.map(e => e.branch).filter(Boolean))).sort()]
export const TEAM_LEADS = ['All', ...Array.from(new Set(RANKED.map(e => e.lead).filter(Boolean))).sort()]

// Deterministic seeded RNG keyed by email so that mock revenue/admissions are stable
// across renders but unique per employee.
function seededRng(seed) {
  let s = 0
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function buildCounsellor(emp, idx) {
  const rand = seededRng(emp.email + '|s07')
  const tenure = computeTenure(emp)
  // Tenure tilts performance: longer tenure → higher closing power.
 

  const admissions = 0
  const revenue = 0
  const points = 0
  const movement    = Math.floor(rand() * 9) - 4
  return {
    id: idx + 1,
    name: emp.name,
    email: emp.email,
    gender: emp.gender,
    initials: initialsOf(emp.name),
    branch: emp.branch,
    lead: emp.lead,
    designation: emp.designation,
    tenure,
    role: categoryForEmployee(emp),
    admissions,
    revenue,
    points,
    movement,
    streak: Math.floor(rand() * 14),
    winRate: Math.floor(rand() * 40) + 55,
  }
}

export function generateCounsellors() {
  const list = RANKED.map((e, i) => buildCounsellor(e, i))
  list.sort((a, b) => b.points - a.points)
  list.forEach((c, idx) => { c.rank = idx + 1 })
  return list
}

export const COUNSELLORS = generateCounsellors()

export const REWARDS = [
  { title: 'Revenue Champion', sub: 'Top revenue of the month', icon: '💎', color: 'from-fuchsia-500 to-purple-600', glow: 'rgba(217,70,239,0.55)', prize: '₹ 1,00,000' },
  { title: 'Admission King',   sub: 'Most admissions closed',   icon: '👑', color: 'from-amber-400 to-orange-500',  glow: 'rgba(245,158,11,0.55)', prize: '₹ 75,000' },
  { title: 'Weekly Beast',     sub: 'Highest weekly streak',    icon: '⚡', color: 'from-sky-400 to-indigo-500',    glow: 'rgba(59,130,246,0.55)', prize: '₹ 50,000' },
  { title: 'Comeback Player',  sub: 'Biggest leaderboard jump', icon: '🚀', color: 'from-emerald-400 to-teal-500',  glow: 'rgba(16,185,129,0.55)', prize: '₹ 40,000' },
]

export const CHALLENGES = [
  { title: 'Close 10 Admissions',     progress: 72, reward: '500 pts',  deadline: '3d left',  tier: 'Daily' },
  { title: 'Hit ₹5L Revenue',         progress: 48, reward: '1200 pts', deadline: '6d left',  tier: 'Weekly' },
  { title: 'Beat your previous rank', progress: 86, reward: '800 pts',  deadline: '12d left', tier: 'Monthly' },
]
