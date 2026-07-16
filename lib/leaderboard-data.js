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

export const REWARD_CONTEST = {
  title: '20 Admissions Challenge',
  benchmark: 20,
  benchmarkLabel: 'Admissions',
  prizeValue: '₹50,000',
  subtitle: 'Hit the benchmark. Unlock the reward. Claim your glory.',
  eligibility: 'Complete 20 Admissions',
  rewards: [
    {
      name: 'PlayStation 5',
      shortName: 'PS5',
      image: '/rewards/PS5.png',
      description: 'Ultimate gaming experience'
    },
    {
      name: 'Dyson Hair Dryer',
      shortName: 'Hair Dryer',
      image: '/rewards/Dyson.png',
      description: 'Premium styling experience'
    }
  ]
}

export const CHALLENGES = [
  { title: 'Close 10 Admissions',     progress: 72, reward: '500 pts',  deadline: '3d left',  tier: 'Daily' },
  { title: 'Hit ₹5L Revenue',         progress: 48, reward: '1200 pts', deadline: '6d left',  tier: 'Weekly' },
  { title: 'Beat your previous rank', progress: 86, reward: '800 pts',  deadline: '12d left', tier: 'Monthly' },
]
