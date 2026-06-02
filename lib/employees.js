// Source-of-truth employee data imported from Employee Details - Pratham.xlsx
// - Categories are auto-computed from joining date (or fallback tenure) on every read
//   so they evolve dynamically as time passes.
// - Pratham Nibade is the system Admin and is excluded from leaderboard rankings.

import { email } from "zod/v4-mini"

export const DEFAULT_PASSWORD = 'kime@2026'

export const EMPLOYEES_RAW = [                                                                                                                                                                                                
  
  { name: 'Prasad Deshpande',    email: 'prasad.D@kimeedu.co.in',        branch: 'Pune',   lead: 'Deepti',           designation: 'Proposed Team Lead - Sales',              tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Rutuja Nikam',        email: 'rutuja.n@kimeedu.co.in',        branch: 'Pune',   lead: 'Uday',             designation: 'Assistant Manager-Business Development',  tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Suwarnaprabha Dive',  email: 'suwarnaprabha.d@kimeedu.co.in', branch: 'Pune',   lead: 'Amit',             designation: 'Executive-Business Development',          tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Amit Tiwari',         email: 'amit.t@kimeedu.co.in',          branch: 'Pune',   lead: 'Uday',             designation: 'Assistant Manager-Business Development',  tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Ishita Bahl',         email: 'ishita.b@kimeedu.co.in',        branch: 'Pune',   lead: 'Deepti',           designation: 'Executive-Business Development',          tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Netra Chinta',        email: 'netra.c@kimeedu.co.in',         branch: 'Pune',   lead: 'Amit',             designation: 'Proposed Team Lead - Sales',              tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Krity Mahato',        email: 'krity.m@kimeedu.co.in',         branch: 'Pune',   lead: 'Amit',             designation: 'Senior Executive-Business Development',   tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Rahul Dembda',        email: 'rahul.d@kimeedu.co.in',         branch: 'Pune',   lead: 'Deepti',           designation: 'Senior Executive-Business Development',   tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Gaurav Kadam',        email: 'gaurav.k@kimeedu.co.in',        branch: 'Pune',   lead: 'Deepti',           designation: 'Executive-Business Development',          tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Deepti Pawar',        email: 'deepti.p@kimeedu.co.in',        branch: 'Pune',   lead: 'Uday',             designation: 'Assistant Manager-Business Development',  tenure: 8, joiningDate: '11/01/2025' },
  { name: 'Aachal Dahikar',      email: 'aachal.d@kimeedu.co.in',        branch: 'Pune',   lead: 'Deepti',           designation: 'Senior Executive-Business Development',   tenure: 5, joiningDate: '12/01/2025' },
  { name: 'Shamal Dhanawade',    email: 'shamal@kimeedu.co.in',          branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Executive-Business Development',          tenure: 6, joiningDate: '01/01/2026' },
  
  { name: 'Ayesha Khan',         email: 'ayesha@kimeedu.co.in',          branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Senior Executive-Business Development',   tenure: 6, joiningDate: '01/01/2026' },
  { name: 'Harshit Amuley',      email: 'harshit.a@kimeedu.co.in',       branch: 'Pune',   lead: 'Amit',             designation: 'Executive-Business Development',          tenure: 5, joiningDate: '02/01/2026' },
  { name: 'Amod Tripathi',       email: 'amod@kimeedu.co.in',            branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Executive-Business Development',          tenure: 4, joiningDate: '02/01/2026' },
  { name: 'Mansi Sharma',        email: 'mansi@kimeedu.co.in',           branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Executive-Business Development',          tenure: 4, joiningDate: '03/01/2026' },
  { name: 'Astha Pande',         email: 'astha.p@kimeedu.co.in',         branch: 'Pune',   lead: 'Deepti',           designation: 'Executive-Business Development',          tenure: 4, joiningDate: '03/01/2026' },
  { name: 'Nilima Singha',       email: 'nilima.s@kimeedu.co.in',        branch: 'Pune',   lead: 'Deepti',           designation: 'Executive-Business Development',          tenure: 4, joiningDate: '03/01/2026' },
  { name: 'Janhavi Nakshulwar',  email: 'janhavi.n@kimeedu.co.in',       branch: 'Pune',   lead: 'Amit',             designation: 'Executive-Business Development',          tenure: 4, joiningDate: '03/01/2026' },
  { name: 'Darshan Gandhi',      email: 'darshan.g@kimeedu.co.in',       branch: 'Pune',   lead: 'Deepti',           designation: 'Executive-Business Development',          tenure: 4, joiningDate: '03/01/2026' },
  { name: 'Vineeth Prashant',    email: 'vineeth@kimeedu.co.in',         branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Senior Executive-Business Development',   tenure: 3, joiningDate: '3/1/2026' },
  { name: 'Sai Das',             email: 'sai.d@kimeedu.co.in',           branch: 'Pune',   lead: 'Amit',             designation: 'Senior Executive-Business Development',   tenure: 3, joiningDate: '3/1/2026' },
  { name: 'Shubham Kumar',       email: 'shubham.p@kimeedu.co.in',       branch: 'Pune',   lead: 'Rutuja',           designation: 'Senior Executive-Business Development',   tenure: 3, joiningDate: '4/01/2026' },
  { name: 'Shruti Singh',        email: 'shruti@kimeedu.co.in',          branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  { name: 'Tausif Sayyed',       email: 'tausif@kimeedu.co.in',          branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Senior Executive-Business Development',   tenure: 3, joiningDate: '4/01/2026' },
  { name: 'Soniya Salunkhe',     email: 'soniya.s@kimeedu.co.in',        branch: 'Pune',   lead: 'Amit',             designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  { name: 'Kanchan Pathare',     email: 'kanchan.p@kimeedu.co.in',       branch: 'Pune',   lead: 'Deepti',           designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  { name: 'Anusha Lagudu',       email: 'anusha.l@kimeedu.co.in',        branch: 'Pune',   lead: 'Deepti',           designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  { name: 'Jagriti Mahajan',     email: 'jagriti.m@kimeedu.co.in',       branch: 'Pune',   lead: 'Amit',             designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  { name: 'Vedanti Wanare',      email: 'vedanti.w@kimeedu.co.in',       branch: 'Pune',   lead: 'Amit',             designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  { name: 'Bhagyashree Palan',   email: 'bhagyashree@kimeedu.co.in',     branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  { name: 'Vijay Badsiwal',      email: 'vijay@kimeedu.co.in',         branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  {name: 'Diksh Shaikh',         email: 'diksh@kimeedu.co.in',         branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  {name: 'Kajal Tiwari',         email: 'kajal@kimeedu.co.in',         branch: 'Mumbai', lead: 'Aditya Maithani',  designation: 'Executive-Business Development',          tenure: 3, joiningDate: '4/01/2026' },
  {name: 'Ashwini Nikam',        email: 'ashwini.n@kimeedu.co.in',        branch: 'Pune',   lead: 'Amit',           designation: 'Executive-Business Development',          tenure: 8, joiningDate: '11/01/2025' },
  {name: 'Akshata Shirawale',        email: 'akshata.s@kimeedu.co.in',        branch: 'Pune',   lead: 'Deepti',           designation: 'Executive-Business Development',   tenure: 2, joiningDate: '5/01/2026' },
  {name: 'Aditya Maithani',       email: 'aditya.maithani@kimeedu.co.in', branch: 'Mumbai', lead: 'Admin',            designation: 'VP',                                 tenure: 8, joiningDate: '11/01/2025' },
  // Admin user — excluded from rankings
  { name: 'Pratham Nibade',      email: 'pratham@kimeedu.co.in',         branch: 'HQ',     lead: 'Admin',            designation: 'Administrator',                           tenure: 0, joiningDate: null, isAdmin: true },
]

/**
 * Parse a joining date string in formats:
 *  - "M/D/YYYY"  e.g. "7/23/2025"
 *  - "Month-Date-Year"  e.g. "April-27-2026"
 *  - any value parseable by Date
 */
export function parseJoiningDate(s) {
  if (!s) return null
  if (s instanceof Date) return s
  const str = String(s).trim()

  const slash = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (slash) {
    const [, m, d, y] = slash
    return new Date(Number(y), Number(m) - 1, Number(d))
  }

  const named = str.match(/^([A-Za-z]+)[-\s](\d{1,2})[-,\s]+(\d{4})$/)
  if (named) {
    const months = ['january','february','march','april','may','june','july','august','september','october','november','december']
    const m = months.indexOf(named[1].toLowerCase())
    if (m >= 0) return new Date(Number(named[3]), m, Number(named[2]))
  }

  const t = Date.parse(str)
  return isNaN(t) ? null : new Date(t)
}

function monthsBetween(start, end) {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
}

/**
 * Returns the dynamic tenure (in months) for an employee.
 * Prefers joining date when available; otherwise falls back to the static tenure value.
 */
export function computeTenure(emp) {
  return Number(emp.tenure) || 0
}
/**
 * Auto-derive category by tenure (in months).
 *  - 0 to 3 months          → Warrior
 *  - More than 3 to 6 months → Prince
 *  - More than 6 months     → King
 */
export function categoryForTenure(tenureMonths) {
  const t = Number(tenureMonths) || 0
  if (t > 6) return 'King'
  if (t > 3) return 'Prince'
  return 'Warrior'
}

export function categoryForEmployee(emp, now = new Date()) {
  return categoryForTenure(computeTenure(emp, now))
}

export function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0])
    .join('')
    .toUpperCase()
}

/** All non-admin employees (used for leaderboard, podium, filters, search). */
export function getRankedEmployees() {
  return EMPLOYEES_RAW.filter(e => !e.isAdmin)
}

export function findEmployeeByEmail(email) {
  if (!email) return null
  const norm = String(email).trim().toLowerCase()
  return EMPLOYEES_RAW.find(e => e.email.toLowerCase() === norm) || null
}
