import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  EMPLOYEES_RAW,
  DEFAULT_PASSWORD,
  findEmployeeByEmail,
  categoryForEmployee,
  computeTenure
} from '@/lib/employees'

// MongoDB connection (lazy)
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

function handleCORS(response) {
  response.headers.set(
    'Access-Control-Allow-Origin',
    process.env.CORS_ORIGINS || '*'
  )
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-api-key'
  )
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// ---------------- AUTH HELPERS ----------------
const SALT = 'kime-salt-2026'

function hashPwd(email, password) {
  return crypto
    .createHash('sha256')
    .update(`${email.toLowerCase()}:${password}:${SALT}`)
    .digest('hex')
}

async function getStoredPasswordRecord(db, email) {
  return db
    .collection('user_passwords')
    .findOne({ email: email.toLowerCase() })
}

async function verifyPassword(db, email, password) {
  const record = await getStoredPasswordRecord(db, email)

  if (record && record.passwordHash) {
    return record.passwordHash === hashPwd(email, password)
  }

  // fallback default password
  return password === DEFAULT_PASSWORD
}

async function upsertPassword(db, email, password) {
  await db.collection('user_passwords').updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        email: email.toLowerCase(),
        passwordHash: hashPwd(email, password),
        updatedAt: new Date()
      }
    },
    { upsert: true }
  )
}

// ---------------- ROUTE HANDLER ----------------
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // ROOT
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(
        NextResponse.json({ message: 'KIME API Running Successfully' })
      )
    }

    // ---------------- LOGIN ----------------
    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json().catch(() => ({}))

      const email = (body.email || '').trim().toLowerCase()
      const password = body.password || ''

      if (!email || !password) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Email and password are required' },
            { status: 400 }
          )
        )
      }

      const employee = findEmployeeByEmail(email)

      if (!employee) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'No employee found with this email' },
            { status: 404 }
          )
        )
      }

      const ok = await verifyPassword(db, email, password)

      if (!ok) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Incorrect password' },
            { status: 401 }
          )
        )
      }

      const token = uuidv4()

      await db.collection('sessions').insertOne({
        token,
        email,
        createdAt: new Date()
      }).catch(() => {})

      return handleCORS(
        NextResponse.json({
          ok: true,
          token,
          user: {
            name: employee.name,
            email: employee.email,
            branch: employee.branch,
            lead: employee.lead,
            designation: employee.designation,
            tenure: computeTenure(employee),
            role: employee.isAdmin
              ? 'Admin'
              : categoryForEmployee(employee),
            isAdmin: !!employee.isAdmin
          }
        })
      )
    }

    // ---------------- FORGOT PASSWORD ----------------
    if (route === '/auth/forgot-password' && method === 'POST') {
      const body = await request.json().catch(() => ({}))

      const email = (body.email || '').trim().toLowerCase()
      const oldPassword = body.oldPassword || ''
      const newPassword = body.newPassword || ''
      const confirmPassword = body.confirmPassword || ''

      if (!email || !oldPassword || !newPassword || !confirmPassword) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'All fields are required' },
            { status: 400 }
          )
        )
      }

      if (newPassword !== confirmPassword) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Passwords do not match' },
            { status: 400 }
          )
        )
      }

      const employee = findEmployeeByEmail(email)

      if (!employee) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'No employee found with this email' },
            { status: 404 }
          )
        )
      }

      const ok = await verifyPassword(db, email, oldPassword)

      if (!ok) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Old password incorrect' },
            { status: 401 }
          )
        )
      }

      await upsertPassword(db, email, newPassword)

      return handleCORS(
        NextResponse.json({
          ok: true,
          message: 'Password updated successfully'
        })
      )
    }

    // ---------------- EMPLOYEES ----------------
    if (route === '/employees' && method === 'GET') {
      const list = EMPLOYEES_RAW
        .filter(emp => !emp.isAdmin)
        .map(emp => ({
          ...emp,
          tenure: computeTenure(emp),
          role: categoryForEmployee(emp)
        }))

      return handleCORS(
        NextResponse.json({
          ok: true,
          employees: list
        })
      )
    }
    // ---------------- LEADERBOARD ----------------
    if (route === '/leaderboard' && method === 'GET') {
      const { searchParams } = new URL(request.url)
      const period = searchParams.get('period') || 'Monthly'
  // 1. Fetch live stats from MongoDB
      const stats = await db
        .collection('leaderboard_stats')
        .find({})
        .toArray() 
      

  // 2. Convert DB rows into fast lookup map
      const statsMap = {}

      stats.forEach((row) => {
        statsMap[row.email.toLowerCase()] = row
      })

  // 3. Merge all employees with DB stats
      const merged = EMPLOYEES_RAW
       .filter(emp => !emp.isAdmin)
       .map((emp) => {

         const live = statsMap[emp.email.toLowerCase()] || {}

         let statsData

         if (period === 'Weekly') statsData = live.weekly || {}
         else if (period === 'Monthly') statsData = live.monthly || {}
         else statsData = live.quarterly || {}

         const admissions = Number(statsData.admissions || 0)
         const revenue = Number(statsData.revenue || 0)

         const points =
          admissions * 100 +
          Math.floor(revenue / 1000)

         return {
          name: emp.name,
          email: emp.email,
          branch: emp.branch || '',
          lead: emp.lead || '',
          designation: emp.designation || '',
          admissions,
          revenue,
          points,
          role: categoryForEmployee(emp),
          tenure: computeTenure(emp),
          movement: 0,
          streak: 0,
          winRate: 0,
          initials: emp.name
            .split(' ')
            .map(x => x[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
         }
       })

  // 4. Sort by points
     merged.sort((a, b) => b.points - a.points)

  // 5. Add ranks
     const finalData = merged.map((item, index) => ({
       ...item,
       id: index + 1,
       rank: index + 1,
       displayRank: index + 1
     }))

     return handleCORS(
       NextResponse.json({
         ok: true,
        data: finalData
      })
    )
  }
   
    // ===================================================
    // SUPERLEAP WEBHOOK
    // POST /api/superleap/webhook
    // ===================================================
    if (route === '/superleap/webhook' && method === 'POST') {
      const apiKey = request.headers.get('x-api-key')

      if (apiKey !== process.env.SUPERLEAP_API_KEY) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Unauthorized' },
            { status: 401 }
          )
        )
      }

      const body = await request.json().catch(() => ({}))

      const email = (body.email || '').trim().toLowerCase()
      const totalAdmissions = Math.max(0, Number(body.totalAdmissions || 0))
      const revenue = Math.max(0, Number(body.revenue || 0))

      if (!email) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Email required' },
            { status: 400 }
          )
        )
      }

      const employee = findEmployeeByEmail(email)

      if (!employee) {
        return handleCORS(
          NextResponse.json(
            { ok: false, error: 'Employee not found' },
            { status: 404 }
          )
        )
      }

      // Points Formula
      // Add new values to previous values
      const now = new Date()

      const isSameWeek = (d1, d2) => {
        const onejan = new Date(d1.getFullYear(), 0, 1)
        const week1 = Math.ceil((((d1 - onejan) / 86400000) + onejan.getDay() + 1) / 7)
        const week2 = Math.ceil((((d2 - onejan) / 86400000) + onejan.getDay() + 1) / 7)
        return week1 === week2 && d1.getFullYear() === d2.getFullYear()
      }

      const isSameMonth = (d1, d2) =>
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()

      const getQuarter = d => Math.floor(d.getMonth() / 3)

      const isSameQuarter = (d1, d2) =>
        getQuarter(d1) === getQuarter(d2) &&
        d1.getFullYear() === d2.getFullYear()

      let existing = await db.collection('leaderboard_stats').findOne({ email })

      if (!existing) {
        existing = {
          weekly: { admissions: 0, revenue: 0, points: 0 },
          monthly: { admissions: 0, revenue: 0, points: 0 },
          quarterly: { admissions: 0, revenue: 0, points: 0 },
          updatedAt: now
       }
      }

      if (!existing.updatedAt || !isSameWeek(existing.updatedAt, now)) {
         existing.weekly = { admissions: 0, revenue: 0, points: 0 }
      }

      if (!existing.updatedAt || !isSameMonth(existing.updatedAt, now)) {
         existing.monthly = { admissions: 0, revenue: 0, points: 0 }
      }

      if (!existing.updatedAt || !isSameQuarter(existing.updatedAt, now)) {
         existing.quarterly = { admissions: 0, revenue: 0, points: 0 }
      }

      existing.weekly.admissions += totalAdmissions
      existing.weekly.revenue += revenue

      existing.monthly.admissions += totalAdmissions
      existing.monthly.revenue += revenue

      existing.quarterly.admissions += totalAdmissions
      existing.quarterly.revenue += revenue

      const calcPoints = (a, r) => Math.floor(r / 1000) + a * 100

      existing.weekly.points = calcPoints(existing.weekly.admissions, existing.weekly.revenue)
      existing.monthly.points = calcPoints(existing.monthly.admissions, existing.monthly.revenue)
      existing.quarterly.points = calcPoints(existing.quarterly.admissions, existing.quarterly.revenue)

      existing.updatedAt = now

      await db.collection('leaderboard_stats').updateOne(
        { email },
        { $set: existing },
        { upsert: true }
      )
       

      return handleCORS(
        NextResponse.json({
          ok: true,
          message: 'Leaderboard updated successfully',
          data: {
            email,
            admissions: updated.admissions,
            revenue: updated.revenue,
            points
          }
        })
      )
    }

    // ---------------- NOT FOUND ----------------
    return handleCORS(
      NextResponse.json(
        { error: `Route ${route} not found` },
        { status: 404 }
      )
    )
  } catch (error) {
    console.error('API Error:', error)

    return handleCORS(
      NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    )
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute

